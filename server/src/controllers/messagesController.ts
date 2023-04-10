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
