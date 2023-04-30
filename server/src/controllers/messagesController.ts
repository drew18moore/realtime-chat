import { Request, Response } from "express";
import { db } from "../db";

export const newMessage = async (req: Request, res: Response) => {
  const { receiverId, authorId, message, conversationId } = req.body;
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
  const { currentUserId, conversationId } = req.query;
  const parsedCurrentUserId = parseInt(currentUserId as string);
  const parsedConversationId = parseInt(conversationId as string);
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
    const messages = await db.message.findMany({
      where: {
        conversationId: parsedConversationId,
      },
    });
    res.status(200).json(messages);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err });
  }
};
