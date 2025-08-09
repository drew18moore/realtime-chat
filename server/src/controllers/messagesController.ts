import { Request, Response } from "express";
import sql from "../db";
import { MessageDetails, Reaction } from "../types";

export const newMessage = async (req: Request, res: Response) => {
  const { message, conversationId, img, replyToId } = req.body;

  if ((!message || message.trim() === "") && (!img || img === ""))
    return res
      .status(400)
      .json({ message: "Must provide a message or include an image" });

  if (!conversationId)
    return res.status(400).json({ message: "Must provide a conversationId" });

  const authorId = req.userId;
  const parsedAuthorId = parseInt(authorId);
  const parsedConversationId = parseInt(conversationId);

  try {
    await sql.begin(async (sql) => {
      const [newMessage] = await sql<MessageDetails[]>`
      INSERT INTO "Message" (message, "authorId", "conversationId", "img", "replyToId")
      VALUES (${message}, ${parsedAuthorId}, ${parsedConversationId}, ${
        img || ""
      }, ${replyToId ? parseInt(replyToId) : null})
        RETURNING id, message, img, "authorId", created_at::timestamptz, "isEdited", "conversationId", "replyToId"
      `;

      await sql`
        UPDATE "Conversation"
        SET "dateLastMessage" = NOW()
        WHERE id = ${parsedConversationId}
      `;

      await sql`
        UPDATE "ConversationUser"
        SET "isRead" = FALSE
        WHERE "conversationId" = ${parsedConversationId} AND "userId" <> ${parsedAuthorId}
      `;

      const response = {
        id: newMessage.id,
        message: newMessage.message,
        img: newMessage.img,
        authorId: newMessage.authorId,
        created_at: newMessage.created_at,
      };

      res.status(200).json(response);
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err });
  }
};

export const getMessagesInConversation = async (
  req: Request,
  res: Response
) => {
  const { conversationId, page = 1, limit = 10 } = req.query;

  if (!conversationId)
    return res.status(400).json({ message: "Must provide a conversationId" });

  const currentUserId = req.userId;
  const parsedCurrentUserId = parseInt(currentUserId as string);
  const parsedConversationId = parseInt(conversationId as string);
  const parsedPage = parseInt(page as string);
  const parsedLimit = parseInt(limit as string);

  try {
    const conversationUserIds = await sql<{ userId: number }[]>`
      SELECT "userId" FROM "ConversationUser"
      WHERE "conversationId" = ${parsedConversationId}
    `;

    if (
      !conversationUserIds.some((user) => user.userId === parsedCurrentUserId)
    ) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    await sql`
      UPDATE "ConversationUser"
      SET "isRead" = TRUE
      WHERE "conversationId" = ${parsedConversationId} AND "userId" = ${parsedCurrentUserId}
    `;

    const messages = await sql<MessageDetails[]>`
      SELECT 
        m.id, m.message, m.img, m."authorId", m.created_at::timestamptz, m."isEdited", m."conversationId", m."replyToId",
        CASE 
          WHEN m."replyToId" IS NOT NULL THEN 
            json_build_object(
              'id', rm.id,
              'message', rm.message,
              'img', rm.img,
              'authorId', rm."authorId",
              'authorDisplayName', ru.display_name
            )
          ELSE NULL
        END as "repliedToMessage",
        COALESCE(
          (
            SELECT json_agg(json_build_object('emoji', r.emoji, 'count', r.count))
            FROM (
              SELECT emoji, COUNT(*) as count
              FROM "Reaction"
              WHERE "messageId" = m.id
              GROUP BY emoji
            ) r
          ),
          '[]'
        ) as reactions
      FROM "Message" m
      LEFT JOIN "Message" rm ON m."replyToId" = rm.id
      LEFT JOIN "User" ru ON rm."authorId" = ru.id
      WHERE m."conversationId" = ${parsedConversationId}
      ORDER BY m.created_at DESC
      OFFSET ${(parsedPage - 1) * parsedLimit}
      LIMIT ${parsedLimit}
    `;

    res.status(200).json(messages);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err });
  }
};

export const deleteMessage = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  try {
    const [message] = await sql<MessageDetails[]>`
      SELECT "authorId"
      FROM "Message"
      WHERE id = ${id}
    `;

    if (message?.authorId !== parseInt(req.userId)) {
      return res
        .status(403)
        .json({ message: "You can only delete your own messages" });
    }

    if (!message) {
      return res.status(404).json({ message: "Message not found" });
    }

    await sql`
      DELETE FROM "Message"
      WHERE id = ${id}
    `;

    res
      .status(200)
      .json({ message: "Message deleted successfully", messageId: id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err });
  }
};

export const editMessage = async (req: Request, res: Response) => {
  const { message: newMessageBody } = req.body;

  if (!newMessageBody || newMessageBody.trim() === "")
    return res.status(400).json({ message: "Must provide a message" });

  const id = parseInt(req.params.id);
  try {
    const [message] = await sql<{ authorId: number }[]>`
      SELECT "authorId"
      FROM "Message"
      WHERE id = ${id}
    `;

    if (!message) {
      return res.status(404).json({ message: "Message not found" });
    }

    if (message?.authorId !== parseInt(req.userId)) {
      return res
        .status(403)
        .json({ message: "You can only edit your own messages" });
    }

    const [updatedMessage] = await sql<MessageDetails[]>`
      UPDATE "Message"
      SET message = ${newMessageBody}, "isEdited" = TRUE
      WHERE id = ${id}
      RETURNING id, message, img, "authorId", created_at, "isEdited", "conversationId"
    `;

    res.status(200).json(updatedMessage);
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
};

type ReactionsResponse = {
  id: number;
  messageId: number;
  emoji: string;
  count: number;
}[];

export const reactToMessage = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { emoji, userId } = req.body;

  try {
    await sql`
      INSERT INTO "Reaction" ("messageId", emoji, "userId")
      VALUES (${id}, ${emoji}, ${userId})
      ON CONFLICT ("messageId", emoji, "userId")
      DO NOTHING;
    `;
    const reactions = await sql<ReactionsResponse>`
      SELECT "messageId", emoji, COUNT(*) as count
      FROM "Reaction"
      WHERE "messageId" = ${id}
      GROUP BY emoji, "messageId";
    `;

    res.status(200).json(reactions);
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
};
