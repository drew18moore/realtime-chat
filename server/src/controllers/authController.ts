import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { db } from "../db";

export const registerNewUser = async (req: Request, res: Response) => {
  const { display_name, username, password } = req.body;

  if (!display_name || display_name === "")
    return res.status(400).json({ message: "Display name is required" });
  if (!username || username === "")
    return res.status(400).json({ message: "Username is required" });
  if (!password || password === "")
    return res.status(400).json({ message: "Password is required" });

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await db.user.create({
      data: {
        display_name,
        username,
        password: hashedPassword,
      },
    });
    const response = {
      id: user.id,
      displayName: user.display_name,
      username: user.username,
    }
    res.status(200).json(response);
  } catch (err: any) {
    if (err.code === "P2002")
      return res.status(403).json({ message: "Username already in use" });
    res.status(500).json(err);
  }
};

export const loginUser = async (req: Request, res: Response) => {
  const { username, password } = req.body;

  if (!username || username === "")
    return res.status(400).json({ message: "Username is required" });
  if (!password || password === "")
    return res.status(400).json({ message: "Password is required" });

  try {
    const user = await db.user.findUnique({ where: { username } });
    if (!user) return res.status(404).json({ message: "User not found" });

    if (!(await bcrypt.compare(password, user.password)))
      return res.status(400).json({ message: "Incorrect password" });
    const response = {
      id: user.id,
      displayName: user.display_name,
      username: user.username,
    }
    res.status(200).json(response);
  } catch (err) {
    console.error(err)
    res.status(500).json(err);
  }
};
