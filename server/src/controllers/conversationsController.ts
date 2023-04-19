import { Request, Response } from "express";
import { db } from "../db";

export const newConversation = async (req: Request, res: Response) => {
  const { recipientId, authorId } = req.body;
  const recipientIdParsed = parseInt(recipientId);
  const authorIdParsed = parseInt(authorId);
  try {
    // Check if a conversation exists
    const existingConversation = await db.conversation.findMany({
      where: {
        OR: [
          {
            AND: [
              { creatorId: authorIdParsed },
              { joinerId: recipientIdParsed },
            ],
          },
          {
            AND: [
              { creatorId: recipientIdParsed },
              { joinerId: authorIdParsed },
            ],
          },
        ],
      },
      select: {
        id: true,
        title: true,
        creator: {
          select: {
            id: true,
            username: true,
          }
        },
        joiner: {
          select: {
            id: true,
            username: true,
          }
        },
      }
    });
    if (existingConversation.length > 0) {
      const response = {
        ...existingConversation[0],
        recipient: existingConversation[0].creator,
        creator: undefined,
        joiner: undefined,
        messages: undefined,
      }
      return res.status(200).json(response)
    }
    const conversation = await db.conversation.create({
      data: {
        creator: { connect: { id: authorIdParsed } },
        joiner: { connect: { id: recipientIdParsed } },
      },
      select: {
        id: true,
        title: true,
        creator: {
          select: {
            id: true,
            username: true,
          }
        },
        joiner: {
          select: {
            id: true,
            username: true,
          }
        },
      }
    });
    const response = {
      ...conversation,
      recipient: conversation.joiner,
      creator: undefined,
      joiner: undefined,
      messages: undefined,
    }
    res.status(201).json(response);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err });
  }
};
