import { Request, Response } from "express";
import sql from "../db";
import {
  ConversationDetails,
  ConversationWithParticipants,
  ParticipantDetails,
  dbUser,
} from "../types";
("../types");

export const newConversation = async (req: Request, res: Response) => {
  const participantIds: number[] = req.body.participants;

  if (!participantIds || participantIds.length === 0)
    res.status(400).json({ message: "Must provide array of participants" });

  const creatorId = req.userId;
  const creatorIdParsed = parseInt(creatorId);

  const participants = [creatorIdParsed, ...participantIds];
  const conversationWithSelf =
    participantIds.length === 1 && participantIds[0] === creatorIdParsed;

  try {
    // Conditionally write query
    let existingConversation: ConversationWithParticipants[];
    if (conversationWithSelf) {
      existingConversation = await sql<ConversationWithParticipants[]>`
      SELECT c.id, c.title, cu.user_id
      FROM "Conversation" c
      JOIN "ConversationUser" cu ON c.id = cu.conversation_id
      WHERE cu.user_id = ${creatorIdParsed}
    `;
    } else {
      existingConversation = await sql`
      SELECT c.id, c.title, cu.user_id
      FROM "Conversation" c
      JOIN "ConversationUser" cu ON c.id = cu.conversation_id
      WHERE cu.user_id = ANY(${participants})
      GROUP BY c.id, cu.user_id
      HAVING COUNT(DISTINCT cu.user_id) = ${participants.length}
    `;
    }

    if (existingConversation.length > 0) {
      const participantDetails = await sql<ParticipantDetails[]>`
        SELECT u.id, u.display_name, u.profile_picture
        FROM "User" u
        JOIN "ConversationUser" cu ON u.id = cu.user_id
        WHERE cu.conversation_id = ${existingConversation[0].id}
      `;

      const response = {
        ...existingConversation[0],
        participants: existingConversation[0].participants.map(
          (participant) => ({
            id: participant.id,
            display_name: participant.display_name,
            profile_picture: participant.profile_picture,
          })
        ),
      };
      return res.status(200).json(response);
    }

    const conversation = await sql<ConversationDetails[]>`
    INSERT INTO "Conversation" (title)
    VALUES (NULL)
    RETURNING id, title
  `;

    const conversationId = conversation[0].id;

    const participantData = participants.map((participantId) => ({
      userId: participantId,
      conversationId,
    }));

    await sql`
    INSERT INTO "ConversationUser" (user_id, conversation_id)
    SELECT userId, conversationId FROM json_populate_recordset(NULL::"ConversationUser", ${JSON.stringify(
      participantData
    )})
  `;

    const participantDetails = await sql<ParticipantDetails[]>`
    SELECT u.id, u.display_name, u.profile_picture
    FROM users u
    JOIN "ConversationUser" cu ON u.id = cu.user_id
    WHERE cu.conversation_id = ${conversationId}
  `;
    const response = {
      ...conversation,
      messages: undefined,
      participants: participantDetails,
    };
    res.status(201).json(response);
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
          created_at: Date;
        }
      | undefined;
  };
  type Participant = {
    isRead: boolean;
    user: dbUser
  }

  const { userId } = req.params;
  const userIdParsed = parseInt(userId);

  try {
    const conversations = await sql<Conversation[]>`
      SELECT c.id, c.title,
        (
          SELECT row_to_json(m)
          FROM (
            SELECT m.id, m.message, m.created_at
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
      let isRead = conversation.participants.find((p) => p.user.id === userIdParsed)?.isRead;

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
