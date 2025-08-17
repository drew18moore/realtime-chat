import express, { Router } from "express";
import {
  getAllConversations,
  newConversation,
  readConversation,
  updateConversation,
  deleteConversation,
} from "../controllers/conversationsController";
import { verifyJWT } from "../middleware/verifyJWT";

const conversationsRouter: Router = express.Router();

conversationsRouter.post("/new", verifyJWT, newConversation);

conversationsRouter.get("/:userId", verifyJWT, getAllConversations);

conversationsRouter.put("/:conversationId/read", verifyJWT, readConversation);

conversationsRouter.patch("/:conversationId", verifyJWT, updateConversation);

conversationsRouter.delete("/:conversationId", verifyJWT, deleteConversation);

export default conversationsRouter;
