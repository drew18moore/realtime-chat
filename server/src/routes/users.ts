import express, { Router } from "express";
import { getAllConversations, getAllUsers } from "../controllers/usersController";

const usersRouter: Router = express.Router();

usersRouter.get("/all", getAllUsers);

usersRouter.get("/:userId/conversations", getAllConversations)

export default usersRouter;
