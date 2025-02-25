import { Request, Response } from "express";
import { Ground } from "../models/ground.model";

export const getAllGrounds = async (req: Request, res: Response) => {
  try {
    const grounds = await Ground.find();
    res.status(200).json({ grounds });
  } catch (error) {
    res.status(500).json({ message: "Error fetching grounds", error });
  }
};
