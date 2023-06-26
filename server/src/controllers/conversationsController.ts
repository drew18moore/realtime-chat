import { Request, Response } from "express";
import { db } from "../db";

export const newConversation = async (req: Request, res: Response) => {
  const participantIds: number[] = req.body.participants;

  if (!participantIds || participantIds.length === 0)
    res.status(400).json({ message: "Must provide array of participants" });

  const creatorId = req.userId;
  const creatorIdParsed = parseInt(creatorId);

  const participants = [creatorIdParsed, ...participantIds];
  const conversationWithSelf =
    participantIds.length === 1 && participantIds[0] === creatorIdParsed;

  try {
    // Conditionally write query
    let query;
    if (conversationWithSelf) {
      query = {
        participants: {
          every: {
            userId: { in: participants },
          },
        },
      };
    } else {
      query = {
        AND: participants.map((participantId) => ({
          participants: {
            some: {
              userId: participantId,
            },
          },
        })),
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
      const response = {
        ...existingConversation[0],
        messages: undefined,
        participants: existingConversation[0].participants.map(
          (participant) => participant.user
        ),
      };
      return res.status(200).json(response);
    }
    // New conversation data
    let data;
    if (conversationWithSelf) {
      data = [{ user: { connect: { id: creatorIdParsed } } }];
    } else {
      data = participants.map((participantId) => ({
        user: { connect: { id: participantId } },
      }));
    }
    // Create new conversation
    const conversation = await db.conversation.create({
      data: {
        participants: {
          create: data,
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
    const response = {
      ...conversation,
      messages: undefined,
      participants: conversation.participants.map(
        (participant) => participant.user
      ),
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
          some: { userId: userIdParsed },
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
      let isRead =
        conversation.participants[0].user.id === userIdParsed
          ? conversation.participants[0].isRead
          : conversation.participants[1].isRead;
      return {
        ...conversation,
        lastMessageSent: conversation.messages[0],
        messages: undefined,
        participants: conversation.participants.map(
          (participant) => participant.user
        ),
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
    res
      .status(200)
      .json({ message: "Conversation has been read successfully" });
  } catch (err) {
    console.error(err);
  }
};
