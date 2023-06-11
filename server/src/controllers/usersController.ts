import { Request, Response } from "express";
import { db } from "../db";

export const getAllUsers = async (req: Request, res: Response) => {
  const search = (req.query.search as string) || "";
  const { page = 1, limit = 10 } = req.query;
  const parsedPage = parseInt(page as string);
  const parsedLimit = parseInt(limit as string);
  try {
    const users = await db.user.findMany({
      select: {
        id: true,
        display_name: true,
        username: true,
        profile_picture: true,
      },
      where: {
        OR: [
          { username: { contains: search, mode: "insensitive" } },
          { display_name: { contains: search, mode: "insensitive" } },
        ],
      },
      skip: (parsedPage - 1) * parsedLimit,
      take: parsedLimit,
    });
    res.status(200).json({ users: users, numFound: users.length });
  } catch (err) {
    res.status(500).json({ message: err });
  }
};

export const getAllConversations = async (req: Request, res: Response) => {
  const { userId } = req.params;
  const userIdParsed = parseInt(userId);
  try {
    const conversations = await db.conversation.findMany({
      where: {
        participants: {
          some: { userId: userIdParsed }
        },
        messages: {
          some: {},
        },
      },
      select: {
        id: true,
        title: true,
        messages: {
          select: {
            id: true,
            message: true,
            created_at: true,
          },
          orderBy: {
            created_at: "desc",
          },
          take: 1,
        },
        participants: {
          select: {
            isRead: true,
            user: {
              select: {
                id: true,
                display_name: true,
                username: true,
                profile_picture: true,
              },
            },
          },
        },
      },
      orderBy: {
        dateLastMessage: "desc",
      },
    });
    const response = conversations.map((conversation) => {
      let recipient;
      let isRead: boolean;
      if (conversation.participants[0].user.id === userIdParsed) {
        recipient = conversation.participants[1].user;
        isRead = conversation.participants[0].isRead;
      } else {
        recipient = conversation.participants[0].user;
        isRead = conversation.participants[1].isRead;
      }
      return {
        ...conversation,
        recipient: recipient,
        lastMessageSent: conversation.messages[0],
        messages: undefined,
        participants: undefined,
        isRead: isRead,
      };
    });
    res.status(200).json(response);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err });
  }
};

export const editUser = async (req: Request, res: Response) => {
  const userIdParsed = parseInt(req.userId);
  const display_name = req.body.display_name.trim();
  const username = req.body.username.trim();
  const profile_picture = req.body.profile_picture;

  try {
    const user = await db.user.update({
      where: { id: userIdParsed },
      data: {
        display_name: display_name || undefined,
        username: username || undefined,
        profile_picture: profile_picture || undefined,
      },
    });

    const response = {
      display_name: user.display_name,
      username: user.username,
      profile_picture: user.profile_picture,
    };
    res.json(response);
  } catch (err: any) {
    console.error(err);
    if (err.code === "P2002")
      return res.status(403).json({ message: "Username already in use" });
    res.status(500).json({ message: err });
  }
};
