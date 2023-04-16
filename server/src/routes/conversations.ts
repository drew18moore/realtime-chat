import express, { Router } from "express";
import { newConversation } from "../controllers/conversationsController";
import { verifyJWT } from "../middleware/verifyJWT";

const conversationsRouter: Router = express.Router();

conversationsRouter.post("/new", verifyJWT, newConversation);

export default conversationsRouter;