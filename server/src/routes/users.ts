import express, { Router } from "express";
import { getAllConversations, getAllUsers } from "../controllers/usersController";
import { verifyJWT } from "../middleware/verifyJWT";

const usersRouter: Router = express.Router();

usersRouter.get("/", verifyJWT, getAllUsers);

usersRouter.get("/:userId/conversations", verifyJWT, getAllConversations)

export default usersRouter;
