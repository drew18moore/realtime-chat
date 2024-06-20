import { Request, Response } from "express";
import sql from "../db";
import { UserDetails } from "../types";

export const getAllUsers = async (req: Request, res: Response) => {
  const search = (req.query.search as string) || "";
  const { page = 1, limit = 10 } = req.query;
  const parsedPage = parseInt(page as string);
  const parsedLimit = parseInt(limit as string);

  try {
    const users = await sql<UserDetails[]>`
      SELECT id, display_name, username, profile_picture
      FROM "User"
      WHERE username ILIKE ${'%' + search + '%'} OR display_name ILIKE ${'%' + search + '%'}
      LIMIT ${parsedLimit} 
      OFFSET ${(parsedPage - 1) * parsedLimit}
    `
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
    const [user] = await sql<UserDetails[]>`
      UPDATE "User"
      SET
        display_name = CASE
          WHEN ${displayNameTrimmed}::TEXT IS NOT NULL AND ${displayNameTrimmed}::TEXT != '' THEN ${displayNameTrimmed}::TEXT
          ELSE display_name
        END,
        username = CASE
          WHEN ${usernameTrimmed}::TEXT IS NOT NULL AND ${usernameTrimmed}::TEXT != '' THEN ${usernameTrimmed}::TEXT
          ELSE username
        END,
        profile_picture = CASE
          WHEN ${profile_picture}::TEXT IS NOT NULL AND ${profile_picture}::TEXT != '' THEN ${profile_picture}::TEXT
          ELSE profile_picture
        END
      WHERE
        id = ${userIdParsed}
      RETURNING id, display_name, username, profile_picture
  `;

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
