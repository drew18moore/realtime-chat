import express, { Router } from "express";
import { handleRefreshToken, loginUser, registerNewUser } from "../controllers/authController";

const authRouter: Router = express.Router();

authRouter.post("/signup", registerNewUser);

authRouter.post("/login", loginUser);

authRouter.get("/refresh", handleRefreshToken)

export default authRouter;
