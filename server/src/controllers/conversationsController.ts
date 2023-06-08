import { Request, Response } from "express";
import { db } from "../db";

export const newConversation = async (req: Request, res: Response) => {
  const { joinerId } = req.body;
  const creatorId = req.userId;
  const joinerIdParsed = parseInt(joinerId);
  const creatorIdParsed = parseInt(creatorId);
  try {
    // Check if a conversation exists
    const existingConversation = await db.conversation.findMany({
      where: {
        OR: [
          {
            AND: [{ creatorId: creatorIdParsed }, { joinerId: joinerIdParsed }],
          },
          {
            AND: [{ creatorId: joinerIdParsed }, { joinerId: creatorIdParsed }],
          },
        ],
      },
      select: {
        id: true,
        title: true,
        creator: {
          select: {
            id: true,
            display_name: true,
            profile_picture: true,
          },
        },
        joiner: {
          select: {
            id: true,
            display_name: true,
            profile_picture: true,
          },
        },
      },
    });
    if (existingConversation.length > 0) {
      const response = {
        ...existingConversation[0],
        recipient:
          existingConversation[0].creator.id === parseInt(req.userId)
            ? existingConversation[0].joiner
            : existingConversation[0].creator,
        creator: undefined,
        joiner: undefined,
        messages: undefined,
      };
      return res.status(200).json(response);
    }
    const conversation = await db.conversation.create({
      data: {
        creator: { connect: { id: creatorIdParsed } },
        joiner: { connect: { id: joinerIdParsed } },
      },
      select: {
        id: true,
        title: true,
        creator: {
          select: {
            id: true,
            username: true,
          },
        },
        joiner: {
          select: {
            id: true,
            display_name: true,
            profile_picture: true,
          },
        },
      },
    });
    const response = {
      ...conversation,
      recipient: conversation.joiner,
      creator: undefined,
      joiner: undefined,
      messages: undefined,
    };
    res.status(201).json(response);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err });
  }
};
