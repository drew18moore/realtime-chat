import express, { Router } from "express";
import { handleLogout, handlePersistentLogin, handleRefreshToken, loginUser, registerNewUser } from "../controllers/authController";

const authRouter: Router = express.Router();

authRouter.post("/signup", registerNewUser);

authRouter.post("/login", loginUser);

authRouter.get("/refresh", handleRefreshToken);

authRouter.get("/login/persist", handlePersistentLogin);

authRouter.post("/logout", handleLogout);

export default authRouter;
