import express from "express";
import { Login, Signup } from "../controller/user.controller";

export const UserRouter = express.Router();

UserRouter.post("/signup", Signup);
UserRouter.post("/login", Login);
