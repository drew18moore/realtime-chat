import { Request, Response } from "express";
import { db } from "../db";

export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await db.user.findMany({
      select: {
        id: true,
        display_name: true,
        username: true,
      },
    });
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ message: err });
  }
};

export const getAllConversations = async (req: Request, res: Response) => {
  const { userId } = req.params;
  try {
    const conversations = await db.conversation.findMany({
      where: {
        users: {
          some: {
            id: parseInt(userId),
          },
        },
      },
      select: {
        id: true,
        title: true,
        users: {
          select: {
            id: true,
            username: true,
          },
        },
        messages: {
          select: {
            message: true,
            created_at: true,
          },
          orderBy: {
            created_at: "desc",
          },
          take: 1,
        },
      },
    });
    const response = conversations.map((conversation) => ({
      ...conversation,
      lastMessageSent: conversation.messages[0],
      messages: undefined
    }));
    res.status(200).json(response);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err });
  }
};
