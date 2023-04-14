import express, { Router } from "express";
import { getAllConversations, getAllUsers } from "../controllers/usersController";

const usersRouter: Router = express.Router();

usersRouter.get("/", getAllUsers);

usersRouter.get("/:userId/conversations", getAllConversations)

export default usersRouter;
