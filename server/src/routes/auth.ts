import express, { Router } from "express";
import { loginUser, registerNewUser } from "../controllers/authController";

const authRouter: Router = express.Router();

authRouter.post("/signup", registerNewUser);

authRouter.post("/login", loginUser)

export default authRouter;
