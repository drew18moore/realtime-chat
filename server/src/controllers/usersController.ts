import { Request, Response } from "express";
import { db } from "../db";

export const getAllUsers = async (req: Request, res: Response) => {
  const search = req.query.search as string || ""
  try {
    const users = await db.user.findMany({
      select: {
        id: true,
        display_name: true,
        username: true,
      },
      where: {
        username: {
          contains: search,
          mode: "insensitive"
        }
      }
    });
    res.status(200).json({ users: users, numFound: users.length });
  } catch (err) {
    res.status(500).json({ message: err });
  }
};

export const getAllConversations = async (req: Request, res: Response) => {
  const { userId } = req.params;
  const userIdParsed = parseInt(userId)
  try {
    const conversations = await db.conversation.findMany({
      where: {
        users: {
          some: {
            id: userIdParsed,
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
      users: conversation.users.filter(user => user.id !== userIdParsed),
      lastMessageSent: conversation.messages[0],
      messages: undefined
    }));
    res.status(200).json(response);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err });
  }
};
