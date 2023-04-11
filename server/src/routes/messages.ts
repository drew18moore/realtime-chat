import express, { Router } from "express";
import { getMessages, newMessage } from "../controllers/messagesController";

const messagesRouter: Router = express.Router();

messagesRouter.post("/new", newMessage);
messagesRouter.get("/", getMessages)

export default messagesRouter;