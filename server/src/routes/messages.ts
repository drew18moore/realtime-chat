import express, { Router } from "express";
import { getMessagesInConversation, newMessage } from "../controllers/messagesController";

const messagesRouter: Router = express.Router();

messagesRouter.post("/new", newMessage);
messagesRouter.get("/", getMessagesInConversation)

export default messagesRouter;