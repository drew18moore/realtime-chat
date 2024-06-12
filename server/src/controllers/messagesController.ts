import { Request, Response } from "express";
import sql from "../db";
import { MessageDetails } from "../types";

export const newMessage = async (req: Request, res: Response) => {
  const { message, conversationId } = req.body;

  if (!message || message.trim() === "")
    return res.status(400).json({ message: "Must provide a message" });

  if (!conversationId)
    return res.status(400).json({ message: "Must provide a conversationId" });

  const authorId = req.userId;
  const parsedAuthorId = parseInt(authorId);
  const parsedConversationId = parseInt(conversationId);

  try {
    const [newMessage] = await sql<MessageDetails[]>`
    INSERT INTO "Messages" (message, author_id, conversation_id)
    VALUES (${message}, ${parsedAuthorId}, ${parsedConversationId})
      RETURNING id, message, author_id, created_at, is_edited, conversation_id
    `;

    await sql`
      UPDATE "Conversation"
      SET date_last_message = NOW()
      WHERE id = ${parsedConversationId}
    `;

    await sql`
      UPDATE "ConversationUser"
      SET is_read = FALSE
      WHERE conversation_id = ${parsedConversationId} AND user_id <> ${parsedAuthorId}
    `;

    const response = {
      id: newMessage.id,
      message: newMessage.message,
      authorId: newMessage.authorId,
      created_at: newMessage.created_at,
    };

    res.status(200).json(response);
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

    if (!conversationUserIds.some(user => user.userId === parsedCurrentUserId)) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    await sql`
      UPDATE "ConversationUser"
      SET "isRead" = TRUE
      WHERE "conversationId" = ${parsedConversationId} AND "userId" = ${parsedCurrentUserId}
    `;

    const messages = await sql<MessageDetails[]>`
      SELECT id, message, "authorId", created_at, "isEdited", "conversationId"
      FROM "Message"
      WHERE "conversationId" = ${parsedConversationId}
      ORDER BY created_at DESC
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
      SELECT author_id
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
    const [message] = await sql<MessageDetails[]>`
      SELECT author_id
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

    if (!newMessageBody || newMessageBody.trim() === "")
      return res.status(400).json({ message: "Message cannot be empty" });

    const [updatedMessage] = await sql<MessageDetails[]>`
      UPDATE "Message"
      SET message = ${newMessageBody}, is_edited = TRUE
      WHERE id = ${id}
      RETURNING id, message, author_id, created_at, is_edited, conversation_id
    `;

    res.status(200).json(updatedMessage);
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
};
