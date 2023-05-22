import { Request, Response } from "express";
import { db } from "../db";

export const getAllUsers = async (req: Request, res: Response) => {
  const search = (req.query.search as string) || "";
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
        OR: [{ creatorId: parseInt(userId) }, { joinerId: parseInt(userId) }],
        messages: {
          some: {},
        },
      },
      select: {
        id: true,
        title: true,
        creator: {
          select: {
            id: true,
            display_name: true,
            username: true,
            profile_picture: true,
          },
        },
        joiner: {
          select: {
            id: true,
            display_name: true,
            username: true,
            profile_picture: true,
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
      orderBy: {
        dateLastMessage: "desc",
      },
    });
    const response = conversations.map((conversation) => ({
      ...conversation,
      recipient:
        conversation.creator.id === userIdParsed
          ? conversation.joiner
          : conversation.creator,
      creator: undefined,
      joiner: undefined,
      lastMessageSent: conversation.messages[0],
      messages: undefined,
    }));
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
