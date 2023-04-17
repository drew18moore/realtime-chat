import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { db } from "../db";
import jwt from "jsonwebtoken";

interface Token {
  userId: string;
}

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

    const accessToken = jwt.sign(
      { userId: user.id },
      process.env.ACCESS_TOKEN_SECRET as string,
      { expiresIn: "900000" } // 15 min
    );

    const refreshToken = jwt.sign(
      { userId: user.id },
      process.env.REFRESH_TOKEN_SECRET as string,
      { expiresIn: "7d" }
    );

    await db.user.update({
      where: { id: user.id },
      data: { refresh_token: refreshToken },
    });

    const response = {
      id: user.id,
      displayName: user.display_name,
      username: user.username,
      accessToken,
    };

    res.cookie("jwt", refreshToken, {
      httpOnly: true,
      sameSite: "none",
      secure: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

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
    const user = await db.user.findFirst({ where: { username } });
    if (!user) return res.status(404).json({ message: "User not found" });

    if (!(await bcrypt.compare(password, user.password)))
      return res.status(400).json({ message: "Incorrect password" });

    const accessToken = jwt.sign(
      { userId: user.id },
      process.env.ACCESS_TOKEN_SECRET as string,
      { expiresIn: "900000" }
    );

    const refreshToken = jwt.sign(
      { userId: user.id },
      process.env.REFRESH_TOKEN_SECRET as string,
      { expiresIn: "7d" }
    );

    await db.user.update({
      where: { id: user.id },
      data: { refresh_token: refreshToken },
    });

    const response = {
      id: user.id,
      displayName: user.display_name,
      username: user.username,
      accessToken,
    };

    res.cookie("jwt", refreshToken, {
      httpOnly: true,
      sameSite: "none",
      secure: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json(response);
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
};

export const handleRefreshToken = async (req: Request, res: Response) => {
  try {
    const cookies = req.cookies;
    if (!cookies?.jwt) return res.status(401).json({ message: "Unauthorized" });

    const refreshToken = cookies.jwt as string;
    const user = await db.user.findFirst({
      where: { refresh_token: refreshToken },
    });
    if (!user) return res.status(403).json({ message: "Forbidden" });

    jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET as string,
      (err, decoded) => {
        const userId = (decoded as Token).userId;
        if (err || user.id.toString() !== userId.toString())
          return res.status(403).json({ message: "Forbidden" });
        const accessToken = jwt.sign(
          { userId: userId },
          process.env.ACCESS_TOKEN_SECRET as string,
          { expiresIn: "900000" } // 15 mins
        );
        res.status(200).json({ accessToken });
      }
    );
  } catch (err) {
    console.error(err);
  }
};

export const handlePersistentLogin = async (req: Request, res: Response) => {
  try {
    const cookies = req.cookies;
    if (!cookies?.jwt) return res.status(401).json({ message: "Unauthorized" });

    const refreshToken = cookies.jwt as string;
    const user = await db.user.findFirst({
      where: { refresh_token: refreshToken },
    });
    if (!user) return res.status(403).json({ message: "Forbidden" });

    jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET as string,
      (err, decoded) => {
        const userId = (decoded as Token).userId;
        if (err || user.id.toString() !== userId.toString())
          return res.status(403).json({ message: "Forbidden" });
        const accessToken = jwt.sign(
          { userId: userId },
          process.env.ACCESS_TOKEN_SECRET as string,
          { expiresIn: "900000" } // 15 mins
        );

        const response = {
          id: user.id,
          displayName: user.display_name,
          username: user.username,
          accessToken,
        };

        res.status(200).json(response);
      }
    );
  } catch (err) {
    console.error(err);
  }
};
