import express, { Router } from "express";
import { deleteMessage, editMessage, getMessagesInConversation, newMessage, reactToMessage } from "../controllers/messagesController";
import { verifyJWT } from "../middleware/verifyJWT";

const messagesRouter: Router = express.Router();

messagesRouter.post("/new", verifyJWT, newMessage);
messagesRouter.get("/", verifyJWT, getMessagesInConversation)
messagesRouter.route("/:id")
  .delete(verifyJWT, deleteMessage)
  .put(verifyJWT, editMessage)
messagesRouter.put("/:id/react", verifyJWT, reactToMessage)

export default messagesRouter;