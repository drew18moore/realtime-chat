import express, { Router } from "express";
import { newConversation } from "../controllers/conversationsController";

const conversationsRouter: Router = express.Router();

conversationsRouter.post("/new", newConversation);

export default conversationsRouter;