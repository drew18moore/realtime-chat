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

export const editUser = async (req: Request, res: Response) => {
  const { display_name, username, profile_picture } = req.body;
  
  const userIdParsed = parseInt(req.userId);
  const displayNameTrimmed = req.body.display_name?.trim();
  const usernameTrimmed = req.body.username?.trim();

  try {
    const user = await db.user.update({
      where: { id: userIdParsed },
      data: {
        display_name: displayNameTrimmed || undefined,
        username: usernameTrimmed || undefined,
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
