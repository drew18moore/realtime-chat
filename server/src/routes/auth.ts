import express, { Router } from "express";
import { registerNewUser } from "../controllers/authController";

const authRouter: Router = express.Router();

authRouter.post("/signup", registerNewUser);



export default authRouter;
