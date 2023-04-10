import express, { Router } from "express";
import { newMessage } from "../controllers/messagesController";

const messagesRouter: Router = express.Router();

messagesRouter.post("/new", newMessage);

export default messagesRouter;