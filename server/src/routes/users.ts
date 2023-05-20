import express, { Router } from "express";
import { editUser, getAllConversations, getAllUsers } from "../controllers/usersController";
import { verifyJWT } from "../middleware/verifyJWT";

const usersRouter: Router = express.Router();

usersRouter.get("/", verifyJWT, getAllUsers);

usersRouter.get("/:userId/conversations", verifyJWT, getAllConversations)

usersRouter.put("/:userId", verifyJWT, editUser)

export default usersRouter;
