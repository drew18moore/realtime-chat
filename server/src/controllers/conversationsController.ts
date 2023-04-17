import { Request, Response } from "express";
import { db } from "../db";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime";

export const newConversation = async (req: Request, res: Response) => {
  const { recipientId, message, authorId } = req.body;
  const recipientIdParsed = parseInt(recipientId);
  const authorIdParsed = parseInt(authorId);
  try {
    const conversation = await db.conversation.create({
      data: {
        users: {
          connect: [{ id: recipientIdParsed }, { id: authorIdParsed }],
        },
        messages: {
          create: {
            message,
            authorId: authorIdParsed,
            receiverId: recipientIdParsed,
          },
        },
      },
      include: {
        users: true,
        messages: true,
      },
    });
    res.status(200).json(conversation);
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: err });
  }
};
