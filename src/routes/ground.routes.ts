import express from "express";
import { authMiddleware } from "../middleware/middleware";
import { getAllGrounds } from "../controller/ground.controller";

export const GroundRouter = express.Router();

GroundRouter.get("/", authMiddleware, getAllGrounds);
