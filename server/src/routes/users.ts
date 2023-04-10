import express, { Router } from "express";
import { getAllUsers } from "../controllers/usersController";

const usersRouter: Router = express.Router();

usersRouter.get("/all", getAllUsers);

export default usersRouter;
