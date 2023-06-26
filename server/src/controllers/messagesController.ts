import { Request, Response } from "express";
import { db } from "../db";

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
    const newMessage = await db.message.create({
      data: {
        message,
        authorId: parsedAuthorId,
        conversationId: parsedConversationId,
      },
      include: {
        conversation: {
          include: {
            participants: true,
          },
        },
      },
    });

    // Update dateLastMessage
    const conversation = newMessage.conversation;
    if (conversation) {
      await db.conversation.update({
        where: { id: conversation.id },
        data: { dateLastMessage: new Date() },
      });
    }

    // Set all participants' isRead to false except author
    conversation?.participants
      .filter((participant) => participant.userId !== parsedAuthorId)
      .map(async (participant) => {
        await db.conversationUser.updateMany({
          where: {
            conversationId: parsedConversationId,
            userId: participant.userId,
          },
          data: { isRead: false },
        });
      });

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
    const conversation = await db.conversation.findUnique({
      where: { id: parsedConversationId },
      include: { participants: true },
    });
    if (
      conversation?.participants[0].userId !== parsedCurrentUserId &&
      conversation?.participants[1].userId !== parsedCurrentUserId
    ) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    await db.conversationUser.updateMany({
      where: {
        conversationId: parsedConversationId,
        userId: parsedCurrentUserId,
      },
      data: { isRead: true },
    });

    let messages;
    if (page) {
      messages = await db.message.findMany({
        where: {
          conversationId: parsedConversationId,
        },
        orderBy: { created_at: "desc" },
        skip: (parsedPage - 1) * parsedLimit,
        take: parsedLimit,
      });
    } else {
      messages = await db.message.findMany({
        where: {
          conversationId: parsedConversationId,
        },
        orderBy: { created_at: "desc" },
      });
    }
    res.status(200).json(messages);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err });
  }
};

export const deleteMessage = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  try {
    const message = await db.message.findUnique({
      where: { id },
    });

    if (message?.authorId !== parseInt(req.userId)) {
      return res
        .status(403)
        .json({ message: "You can only delete your own messages" });
    }

    if (!message) {
      return res.status(404).json({ message: "Message not found" });
    }

    await db.message.delete({
      where: { id },
    });

    res
      .status(200)
      .json({ message: "Message deleted successfully", messageId: id });
  } catch (err) {
    res.status(500).json({ message: err });
  }
};

export const editMessage = async (req: Request, res: Response) => {
  const { message: newMessageBody } = req.body;

  if (!newMessageBody || newMessageBody.trim() === "")
    return res.status(400).json({ message: "Must provide a message" });

  const id = parseInt(req.params.id);
  try {
    const message = await db.message.findUnique({
      where: { id },
    });

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

    const updatedMessage = await db.message.update({
      where: {
        id,
      },
      data: {
        message: newMessageBody,
        isEdited: true,
      },
    });

    res.status(200).json({ updatedMessage });
  } catch (err) {
    res.status(500).json(err);
  }
};
