import { Request, Response } from "express";
import { db } from "../db";

export const newMessage = async (req: Request, res: Response) => {
  const { receiverId, message, conversationId } = req.body;
  const authorId = req.userId;
  const parsedReceiverId = parseInt(receiverId);
  const parsedAuthorId = parseInt(authorId);
  const parsedConversationId = parseInt(conversationId);

  if (message.trim() === "" || !message)
    return res.status(400).json({ message: "Message cannot be empty" });

  try {
    const newMessage = await db.message.create({
      data: {
        message,
        authorId: parsedAuthorId,
        receiverId: parsedReceiverId,
        conversationId: parsedConversationId,
      },
      include: {
        conversation: true,
      },
    });

    const conversation = newMessage.conversation;
    if (conversation) {
      await db.conversation.update({
        where: { id: conversation.id },
        data: { dateLastMessage: new Date() },
      });
    }
    const response = {
      id: newMessage.id,
      message: newMessage.message,
      receiverId: newMessage.receiverId,
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
  const { currentUserId, conversationId, page, limit = 10 } = req.query;
  const parsedCurrentUserId = parseInt(currentUserId as string);
  const parsedConversationId = parseInt(conversationId as string);
  const parsedPage = parseInt(page as string);
  const parsedLimit = parseInt(limit as string);
  try {
    const conversation = await db.conversation.findUnique({
      where: { id: parsedConversationId },
      include: { creator: true, joiner: true },
    });
    if (
      conversation?.creatorId !== parsedCurrentUserId &&
      conversation?.joinerId !== parsedCurrentUserId
    ) {
      return res.status(401).json({ message: "Unauthorized" });
    }

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
