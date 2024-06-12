import { Request, Response } from "express";
import sql from "../db";
import {
  ConversationDetails,
  ConversationWithParticipants,
  GetConversationResponse,
  ParticipantDetails,
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
  const { userId } = req.params;
  const userIdParsed = parseInt(userId);
  try {
    const conversations = await sql<ConversationDetails[]>`
      SELECT
        c.id AS conversation_id,
        c.title AS conversation_title,
        m.id AS last_message_id,
        m.message AS last_message_content,
        m.created_at AS last_message_created_at,
        cu."isRead" AS is_read,
        u.id AS participant_id,
        u.display_name AS participant_display_name,
        u.username AS participant_username,
        u.profile_picture AS participant_profile_picture
      FROM
        "Conversation" c
        JOIN "ConversationUser" cu ON c.id = cu."conversationId"
        JOIN "User" u ON cu."userId" = u.id
        LEFT JOIN "Message" m ON m.id = (
          SELECT m2.id
          FROM "Message" m2
          WHERE m2."conversationId" = c.id
          ORDER BY m2.created_at DESC
          LIMIT 1
        )
      WHERE
        EXISTS (
          SELECT 1 FROM "ConversationUser" cu
          WHERE cu."conversationId" = c.id AND cu."userId" = ${userIdParsed}
        )
      ORDER BY
        c."dateLastMessage" DESC;
    `;
    // Process the results into the desired structure
    const conversationMap: { [key: number]: GetConversationResponse } = {};
    conversations.forEach((row: any) => {
      const conversationId = row.conversation_id;

      if (!conversationMap[conversationId]) {
        conversationMap[conversationId] = {
          id: row.conversation_id,
          title: row.conversation_title,
          participants: [],
          lastMessageSent: row.last_message_id
            ? {
                id: row.last_message_id,
                message: row.last_message_content,
                created_at: row.last_message_created_at,
              }
            : undefined,
          isRead: row.is_read,
        };
      }

      conversationMap[conversationId].participants.push({
        id: row.participant_id,
        display_name: row.participant_display_name,
        username: row.participant_username,
        profile_picture: row.participant_profile_picture,
      });
    });

    const conversationList: ConversationDetails[] =
      Object.values(conversationMap);

    res.status(200).json(conversationList);
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
