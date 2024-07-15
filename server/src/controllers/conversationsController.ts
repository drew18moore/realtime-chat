import { Request, Response } from "express";
import sql from "../db";
import { dbUser } from "../types";
("../types");

type ConversationWithParticipants = {
  id: number;
  title: string;
  created_at: Date;
  dateLastMessage: Date;
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
    const allUserConversations = await sql<ConversationWithParticipants[]>`
      SELECT 
      c.id,
      c.title,
      c.created_at,
      c."dateLastMessage",
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
      GROUP BY 
        c.id
    `;

    let conversationTargetId = -1;
    const participants = allUserConversations.map((c) =>
      c.participants.map((p) => p.userId)
    );
    for (let i = 0; i < participants.length; i++) {
      if (arraysEqual(participantIds, participants[i])) {
        conversationTargetId = i;
      }
    }

    if (conversationTargetId !== -1) {
      const conversation = allUserConversations[conversationTargetId];
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
  const participantIds: number[] = req.body.participants;

  if (!participantIds || participantIds.length === 0)
    res.status(400).json({ message: "Must provide array of participants" });

  try {
    const existingConversation = await findConversationByParticipants(
      req.userId,
      participantIds
    );

    if (existingConversation !== null) {
      return res.status(200).json(existingConversation);
    }

    await sql.begin(async (sql) => {
      const [conversation] = await sql<{ id: number; title: string | null }[]>`
      INSERT INTO "Conversation" (title)
      VALUES (NULL)
      RETURNING id, title
    `;

      const conversationId = conversation.id;
      // Create the insert values for participants
      const participantValues = participantIds
        .map((participantId) => `(${participantId}, ${conversationId}, true)`)
        .join(", ");

      // Insert participants into ConversationUser
      await sql.unsafe(`
      INSERT INTO "ConversationUser" ("userId", "conversationId", "isRead")
      VALUES ${participantValues}
    `);

      const [createdConversation] = await sql<ConversationWithParticipants[]>`
      SELECT 
      c.id,
      c.title,
      c.created_at,
      c."dateLastMessage",
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
      SELECT c.id, c.title,
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
        AND EXISTS (
          SELECT 1
          FROM "Message" m
          WHERE m."conversationId" = c.id
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
      SET "isRead = TRUE
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
