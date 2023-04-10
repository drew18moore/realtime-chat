import { Request, Response } from "express";
import { db } from "../db";

export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await db.user.findMany({
      select: {
        id: true,
        display_name: true,
        username: true,
      }
    })
    res.status(200).json(users)
  } catch (err) {
    res.status(500).json({ message: err })
  }
}