import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

interface Token {
  userId: string;
}

declare global {
  namespace Express {
    interface Request {
      userId: string;
    }
  }
}

export const verifyJWT = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers["authorization"];
  if (!authHeader) return res.status(401).json({ message: "Unauthorized" });
  const token = authHeader.split(" ")[1];
  jwt.verify(
    token,
    process.env.ACCESS_TOKEN_SECRET as string,
    (err, decoded) => {
      if (err) return res.status(403).json({ message: "Invalid token" });
      const { userId } = decoded as Token;
      req.userId = userId;
      next();
    }
  );
};
