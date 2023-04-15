import { NextFunction, Request, Response } from "express";

const allowedOrigins = require("../config/allowedOrigins");

export const credentials = (req: Request, res: Response, next: NextFunction) => {
  const origin = req.headers.origin as string;
  if (allowedOrigins.includes(origin)) {
    res.header("Access-Control-Allow-Credentials", "true");
  }
  next();
};