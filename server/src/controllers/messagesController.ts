import { Request, Response } from "express";
import { db } from "../db";

export const newMessage = async (req: Request, res: Response) => {
  const { receiverId, authorId, message } = req.body;
  const parsedReceiverId = parseInt(receiverId);
  const parsedAuthorId = parseInt(authorId);

  try {
    const newMessage = await db.message.create({
      data: {
        message,
        authorId: parsedAuthorId,
        receiverId: parsedReceiverId,
      },
    });
    res.status(200).json({ message: "Message has been saved" });
  } catch (err) {
    res.status(500).json({ message: err });
  }
};

export const getMessages = async (req: Request, res: Response) => {
  const { currentUserId, recipientId } = req.query;
  const parsedCurrentUserId = parseInt(currentUserId as string);
  const parsedRecipientId = parseInt(recipientId as string);
  try {
    const messages = await db.message.findMany({
      where: {
        OR: [
          {
            authorId: parsedCurrentUserId,
            receiverId: parsedRecipientId,
          },
          {
            authorId: parsedRecipientId,
            receiverId: parsedCurrentUserId,
          },
        ]
      },
    });
    res.status(200).json(messages);
  } catch (err) {
    res.status(500).json({ message: err });
  }
};
