import { Request, Response } from "express";
import { db } from "../db";

export const newConversation = async (req: Request, res: Response) => {
  const { joinerId } = req.body;
  const creatorId = req.userId;
  const joinerIdParsed = parseInt(joinerId);
  const creatorIdParsed = parseInt(creatorId);
  try {
    let query;
    if (creatorIdParsed === joinerIdParsed) {
      query = {
        participants: {
          every: {
            AND: [
              {
                userId: creatorIdParsed,
              },
              {
                userId: joinerIdParsed,
              },
            ],
          },
        },
      };
    } else {
      query = {
        AND: [
          {
            participants: {
              some: {
                userId: creatorIdParsed,
              },
            },
          },
          {
            participants: {
              some: {
                userId: joinerIdParsed,
              },
            },
          },
        ],
      };
    }
    // Check if a conversation exists
    const existingConversation = await db.conversation.findMany({
      where: query,
      select: {
        id: true,
        title: true,
        participants: {
          select: {
            user: {
              select: {
                id: true,
                display_name: true,
                profile_picture: true,
              },
            },
          },
        },
      },
    });
    if (existingConversation.length > 0) {
      const recipient =
        existingConversation[0].participants[0].user.id === creatorIdParsed
          ? existingConversation[0].participants[1].user
          : existingConversation[0].participants[0].user;
      const response = {
        ...existingConversation[0],
        recipient: recipient,
        messages: undefined,
        participants: undefined,
      };
      return res.status(200).json(response);
    }
    const conversation = await db.conversation.create({
      data: {
        participants: {
          create: [
            { user: { connect: { id: creatorIdParsed } } },
            { user: { connect: { id: joinerIdParsed } } },
          ],
        },
      },
      select: {
        id: true,
        title: true,
        participants: {
          select: {
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
    });
    const recipient =
      conversation.participants[0].user.id === creatorIdParsed
        ? conversation.participants[1].user
        : conversation.participants[0].user;
    const response = {
      ...conversation,
      recipient: recipient,
      messages: undefined,
      participants: undefined,
    };
    res.status(201).json(response);
  } catch (err) {
    console.error(err);
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

export const readConversation = async (req: Request, res: Response) => {
  const { conversationId } = req.params;
  const parsedConversationId = parseInt(conversationId);
  const userId = req.userId;
  const parsedUserId = parseInt(userId);
  try {
    await db.conversationUser.updateMany({
      where: {
        conversationId: parsedConversationId,
        userId: parsedUserId,
      },
      data: {
        isRead: true,
      },
    });
    res.status(200).json({ message: "Conversation has been read successfully" })
  } catch (err) {
    console.error(err);
  }
};
