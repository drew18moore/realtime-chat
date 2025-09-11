import { Request, Response } from "express";
import bcrypt from "bcrypt";
import sql from "../db";
import jwt from "jsonwebtoken";
import { UserCreationResponse, dbUser } from "../types";

interface Token {
  userId: string;
}

// Helper function to determine device type from custom header
const getDeviceType = (req: Request): "web" | "mobile" => {
  const deviceType = req.headers["x-device-type"] as string;
  return deviceType === "mobile" ? "mobile" : "web";
};

export const registerNewUser = async (req: Request, res: Response) => {
  const { display_name, username, password } = req.body;
  const deviceType = getDeviceType(req);

  if (!display_name || display_name === "")
    return res.status(400).json({ message: "Display name is required" });
  if (!username || username === "")
    return res.status(400).json({ message: "Username is required" });
  if (!password || password === "")
    return res.status(400).json({ message: "Password is required" });

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const [existingUser] = await sql<
      dbUser[]
    >`SELECT * FROM "User" WHERE username = ${username}`;
    if (existingUser) {
      return res.status(403).json({ message: "Username already in use" });
    }

    const [user] = await sql<UserCreationResponse[]>`
      INSERT INTO "User" 
        (display_name, username, password) 
      VALUES 
        (${display_name}, ${username}, ${hashedPassword})
      RETURNING id, display_name, username
    `;

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

    await sql`
      UPDATE "User"
      SET refresh_token = ${refreshToken}
      WHERE id = ${user.id}
    `;

    const response: any = {
      id: user.id,
      display_name: user.display_name,
      username: user.username,
      accessToken,
    };

    // Add refresh token to response body for mobile devices
    if (deviceType === "mobile") {
      response.refreshToken = refreshToken;
    }

    // Set httpOnly cookie only for web clients
    if (deviceType === "web") {
      res.cookie("jwt", refreshToken, {
        httpOnly: true,
        sameSite: "none",
        secure: true,
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });
    }

    res.status(200).json(response);
  } catch (err: any) {
    console.error(err);
    res.status(500).json(err);
  }
};

export const loginUser = async (req: Request, res: Response) => {
  const { username, password } = req.body;
  const deviceType = getDeviceType(req);
  console.log(deviceType);

  if (!username || username === "")
    return res.status(400).json({ message: "Username is required" });
  if (!password || password === "")
    return res.status(400).json({ message: "Password is required" });

  try {
    const [user] = await sql<
      dbUser[]
    >`SELECT * FROM "User" WHERE username = ${username}`;
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

    await sql`
      UPDATE "User"
      SET refresh_token = ${refreshToken}
      WHERE id = ${user.id}
    `;

    const response: any = {
      id: user.id,
      display_name: user.display_name,
      username: user.username,
      accessToken,
      profile_picture: user?.profile_picture,
    };

    // Add refresh token to response body for mobile devices
    if (deviceType === "mobile") {
      response.refreshToken = refreshToken;
    }

    // Set httpOnly cookie only for web clients
    if (deviceType === "web") {
      res.cookie("jwt", refreshToken, {
        httpOnly: true,
        sameSite: "none",
        secure: true,
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });
    }

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
    const [user] = await sql<
      dbUser[]
    >`SELECT * FROM "User" WHERE refresh_token = ${refreshToken}`;
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
  const deviceType = getDeviceType(req);
  try {
    let refreshToken;
    if (deviceType === "mobile") {
      let authHeader = req.headers["authorization"] as string;
      refreshToken = authHeader.split(" ")[1];
    } else {
      const cookies = req.cookies;
      console.log(cookies);
      if (!cookies?.jwt)
        return res.status(401).json({ message: "Unauthorized" });
      refreshToken = cookies.jwt as string;
    }
    console.log(refreshToken);

    const [user] = await sql<
      dbUser[]
    >`SELECT * FROM "User" WHERE refresh_token = ${refreshToken}`;
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
          display_name: user.display_name,
          username: user.username,
          accessToken,
          profile_picture: user?.profile_picture,
        };

        res.status(200).json(response);
      }
    );
  } catch (err) {
    console.error(err);
  }
};

export const handleLogout = async (req: Request, res: Response) => {
  try {
    const cookies = req.cookies;
    if (!cookies?.jwt) return res.sendStatus(204);

    const refreshToken = cookies.jwt;
    const [user] = await sql<
      dbUser[]
    >`SELECT * FROM "User" WHERE refresh_token = ${refreshToken}`;
    if (!user) {
      res.clearCookie("jwt", {
        httpOnly: true,
        sameSite: "none",
        secure: true,
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });
      return res.status(204);
    }

    // Delete refresh token from db
    await sql`
      UPDATE "User"
      SET refresh_token = ''
      WHERE id = ${user.id}
    `;

    res.clearCookie("jwt", {
      httpOnly: true,
      sameSite: "none",
      secure: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    res.sendStatus(204);
  } catch (err) {
    console.error(err);
  }
};
