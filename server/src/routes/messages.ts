import express, { Router } from "express";
import { getMessagesInConversation, newMessage } from "../controllers/messagesController";
import { verifyJWT } from "../middleware/verifyJWT";

const messagesRouter: Router = express.Router();

messagesRouter.post("/new", verifyJWT, newMessage);
messagesRouter.get("/", verifyJWT, getMessagesInConversation)

export default messagesRouter;