import { Request, Response } from "express";
import sql from "../db";
import { dbUser } from "../types";
("../types");

type ConversationWithParticipants = {
  id: number;
  title: string | null;
  created_at: Date;
  dateLastMessage: Date;
  isGroup: boolean;
  ownerId: number | null;
  group_picture: string;
  participants: {
    id: number;
    userId: number;
    display_name: string;
    profile_picture: string;
  }[];
};

const findConversationByParticipants = async (
  currUserId: string,
  participantIds: number[]
) => {
  const arraysEqual = (a: number[], b: number[]) => {
    if (a.length !== b.length) return false;
    a = a.slice().sort();
    b = b.slice().sort();
    for (let i = 0; i < a.length; i++) {
      if (a[i] !== b[i]) return false;
    }
    return true;
  };

  try {
    const allUserNonGroupConversations = await sql<
      ConversationWithParticipants[]
    >`
      SELECT 
      c.id,
      c.title,
      c.created_at,
      c."dateLastMessage",
      c."isGroup",
      c."ownerId",
      c.group_picture,
      json_agg(
        json_build_object(
          'id', cu.id,
          'userId', cu."userId",
          'display_name', u.display_name,
          'profile_picture', u.profile_picture
        )
      ) as participants
      FROM 
        "Conversation" c
      JOIN 
        "ConversationUser" cu
      ON 
        c.id = cu."conversationId"
      JOIN
        "User" u
      ON
        cu."userId" = u.id
      WHERE 
        c.id IN (
          SELECT "conversationId" 
          FROM "ConversationUser" 
          WHERE "userId" = ${currUserId}
        )
        AND c."isGroup" = FALSE
      GROUP BY 
        c.id
    `;

    let conversationTargetId = -1;
    const participants = allUserNonGroupConversations.map((c) =>
      c.participants.map((p) => p.userId)
    );
    for (let i = 0; i < participants.length; i++) {
      if (arraysEqual(participantIds, participants[i])) {
        conversationTargetId = i;
      }
    }

    if (conversationTargetId !== -1) {
      const conversation = allUserNonGroupConversations[conversationTargetId];
      const response = {
        id: conversation.id,
        title: conversation.title,
        participants: conversation.participants.map((p) => ({
          id: p.userId,
          display_name: p.display_name,
          profile_picture: p.profile_picture,
        })),
      };
      return response;
    }

    return null;
  } catch (err) {
    console.error(err);
  }
};

export const newConversation = async (req: Request, res: Response) => {
  const participantIdsRaw: number[] = req.body.participants;
  const isGroup: boolean = Boolean(req.body.isGroup);
  const title: string | null = req.body.title ?? null;
  const group_picture: string = req.body.group_picture ?? "";

  if (!participantIdsRaw || participantIdsRaw.length === 0)
    res.status(400).json({ message: "Must provide array of participants" });

  try {
    if (!isGroup) {
      const existingConversation = await findConversationByParticipants(
        req.userId,
        participantIdsRaw
      );
      if (existingConversation !== null) {
        return res.status(200).json(existingConversation);
      }
    }

    await sql.begin(async (sql) => {
      const ownerId = isGroup ? parseInt(req.userId) : null;
      const [conversation] = await sql<
        {
          id: number;
          title: string | null;
        }[]
      >`
        INSERT INTO "Conversation" (title, "isGroup", "ownerId", group_picture)
        VALUES (${title}, ${isGroup}, ${ownerId}, ${group_picture})
        RETURNING id, title
      `;

      const conversationId = conversation.id;
      // Ensure current user (owner for group) is included and unique
      const participantIdsUnique = Array.from(
        new Set<number>([
          ...participantIdsRaw.map((p) => parseInt(String(p))),
          parseInt(req.userId),
        ])
      );

      // Create the insert values for participants with roles
      const participantValues = participantIdsUnique
        .map((participantId) => {
          const role =
            isGroup && participantId === ownerId ? "owner" : "member";
          return `(${participantId}, ${conversationId}, true, '${role}')`;
        })
        .join(", ");

      // Insert participants into ConversationUser
      await sql.unsafe(`
      INSERT INTO "ConversationUser" ("userId", "conversationId", "isRead", role)
      VALUES ${participantValues}
    `);

      const [createdConversation] = await sql<ConversationWithParticipants[]>`
      SELECT 
      c.id,
      c.title,
      c.created_at,
      c."dateLastMessage",
      c."isGroup",
      c."ownerId",
      c.group_picture,
      json_agg(
        json_build_object(
          'id', cu.id,
          'userId', cu."userId",
          'display_name', u.display_name,
          'profile_picture', u.profile_picture
        )
      ) as participants
      FROM 
        "Conversation" c
      JOIN 
        "ConversationUser" cu
      ON 
        c.id = cu."conversationId"
      JOIN
        "User" u
      ON
        cu."userId" = u.id
      WHERE 
        c.id = ${conversationId}
      GROUP BY 
        c.id
    `;

      const response = {
        id: createdConversation.id,
        title: createdConversation.title,
        isGroup: createdConversation.isGroup,
        ownerId: createdConversation.ownerId,
        group_picture: createdConversation.group_picture,
        participants: createdConversation.participants.map((p) => ({
          id: p.userId,
          display_name: p.display_name,
          profile_picture: p.profile_picture,
        })),
      };
      res.status(201).json(response);
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err });
  }
};

export const getAllConversations = async (req: Request, res: Response) => {
  type Conversation = {
    id: number;
    title: string | null;
    isGroup: boolean;
    ownerId: number | null;
    group_picture: string;
    participants: Participant[];
    lastMessageSent:
      | {
          id: number;
          message: string;
          img: string;
          created_at: Date;
        }
      | undefined;
  };
  type Participant = {
    isRead: boolean;
    user: dbUser;
  };

  const { userId } = req.params;
  const userIdParsed = parseInt(userId);

  try {
    const conversations = await sql<Conversation[]>`
      SELECT c.id, c.title, c."isGroup", c."ownerId", c.group_picture,
        (
          SELECT row_to_json(m)
          FROM (
            SELECT m.id, m.message, m.img, m.created_at::timestamptz AS created_at
            FROM "Message" m
            WHERE m."conversationId" = c.id
            ORDER BY m.created_at DESC
            LIMIT 1
          ) m
        ) AS "lastMessageSent",
        (
          SELECT json_agg(p)
          FROM (
            SELECT p."isRead", json_build_object(
              'id', u.id,
              'username', u.username,
              'display_name', u.display_name,
              'profile_picture', u.profile_picture
            ) AS user
            FROM "ConversationUser" p
            JOIN "User" u ON p."userId" = u.id
            WHERE p."conversationId" = c.id
          ) p
        ) AS participants
      FROM "Conversation" c
      WHERE EXISTS (
        SELECT 1
        FROM "ConversationUser" p
        WHERE p."conversationId" = c.id
          AND p."userId" = ${userIdParsed}
      )
        AND (
          c."isGroup" = TRUE
          OR EXISTS (
            SELECT 1
            FROM "Message" m
            WHERE m."conversationId" = c.id
          )
        )
      ORDER BY c."dateLastMessage" DESC
    `;

    const response = conversations.map((conversation) => {
      let participants = conversation.participants.map(
        (participant) => participant.user
      );
      let isRead = conversation.participants.find(
        (p) => p.user.id === userIdParsed
      )?.isRead;

      return {
        id: conversation.id,
        title: conversation.title,
        isGroup: conversation.isGroup,
        ownerId: conversation.ownerId,
        group_picture: conversation.group_picture,
        lastMessageSent: conversation.lastMessageSent,
        participants: participants,
        isRead: isRead,
      };
    });

    res.status(200).json(response);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err });
  }
};

export const readConversation = async (req: Request, res: Response) => {
  const { conversationId } = req.params;
  const parsedConversationId = parseInt(conversationId);
  const userId = req.userId;
  const parsedUserId = parseInt(userId);
  try {
    await sql`
      UPDATE "ConversationUser"
      SET "isRead" = TRUE
      WHERE "conversationId" = ${parsedConversationId} AND "userId" = ${parsedUserId}
    `;
    res
      .status(200)
      .json({ message: "Conversation has been read successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err });
  }
};

export const updateConversation = async (req: Request, res: Response) => {
  const { conversationId } = req.params;
  const parsedConversationId = parseInt(conversationId);
  const { title, img } = req.body as {
    title?: string | null;
    img?: string | null;
  };

  try {
    const [conversation] = await sql<
      { id: number; isGroup: boolean; ownerId: number | null }[]
    >`
      SELECT id, "isGroup", "ownerId"
      FROM "Conversation"
      WHERE id = ${parsedConversationId}
    `;

    if (!conversation) {
      return res.status(404).json({ message: "Conversation not found" });
    }

    if (!conversation.isGroup) {
      return res
        .status(400)
        .json({ message: "Only group conversations can be updated" });
    }

    if (conversation.ownerId !== parseInt(req.userId)) {
      return res
        .status(403)
        .json({ message: "Only the owner can update this conversation" });
    }

    const normalizedTitle = !title ? "" : title?.trim();
    const normalizedImg = !img ? "" : img?.trim();

    const [updated] = await sql<
      { id: number; title: string | null; group_picture: string }[]
    >`
      UPDATE "Conversation"
      SET title = ${normalizedTitle}, group_picture = ${normalizedImg}
      WHERE id = ${parsedConversationId}
      RETURNING id, title, group_picture
    `;

    return res.status(200).json(updated);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: err });
  }
};

export const deleteConversation = async (req: Request, res: Response) => {
  const { conversationId } = req.params;
  const parsedConversationId = parseInt(conversationId);
  try {
    const [conversation] = await sql<
      { id: number; isGroup: boolean; ownerId: number | null }[]
    >`
      SELECT id, "isGroup", "ownerId"
      FROM "Conversation"
      WHERE id = ${parsedConversationId}
    `;

    if (!conversation) {
      return res.status(404).json({ message: "Conversation not found" });
    }

    // Leave group conversation
    if (conversation.isGroup && conversation.ownerId !== parseInt(req.userId)) {
      await sql`
        DELETE FROM "ConversationUser"
        WHERE "conversationId" = ${parsedConversationId} AND "userId" = ${parseInt(req.userId)}
      `;
      return res.status(200).json({ message: "You have left the group conversation" });
    }

    if (conversation.ownerId !== parseInt(req.userId)) {
      return res.status(403).json({ message: "Only the owner can delete this conversation" });
    }

    await sql`
      DELETE FROM "Conversation"
      WHERE id = ${parsedConversationId}
    `;
    res.status(200).json({ message: "Conversation deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err });
  }
};
