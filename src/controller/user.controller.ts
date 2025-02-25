import { Request, Response } from "express";
import { User } from "../models/user.model";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config";
import { signinBody, signupBody } from "../zod/UserValidation";

//signup
export const Signup = async (req: Request, res: Response) => {
  const { success, error, data } = signupBody.safeParse(req.body);

  if (!success) {
    res.status(400).json({
      message: "Invalid Input",
      error: error.errors,
    });
    return;
  }

  const existingUser = await User.findOne({
    email: data.email,
  });

  if (existingUser) {
    res.status(409).json({
      message: "Email already Exists",
    });
    return;
  }

  const { password, email, name } = data;

  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const user = await User.create({
      email,
      password: hashedPassword,
      name,
    });

    const userId = user._id;

    const token = jwt.sign({ userId }, JWT_SECRET, { expiresIn: "24h" });

    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "strict",
    });

    res.status(200).json({
      message: "User created successfully",
      userId,
      email,
    });
  } catch (err: any) {
    res.status(500).json({
      message: "Error creating User",
      error: err.message || err,
    });
  }
};

// signin
export const Login = async (req: Request, res: Response) => {
  const { success, error, data } = signinBody.safeParse(req.body);
  if (!success) {
    res.status(400).json({
      message: "Invalid input",
      error: error.errors,
    });
    return;
  }

  const { email, password } = data;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      res.status(401).json({
        message: "Invalid email or password",
      });
      return;
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      res.status(401).json({
        message: "Invalid email or password",
      });
      return;
    }

    const token = jwt.sign({ userId: user._id }, JWT_SECRET, {
      expiresIn: "24h",
    });

    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "strict",
      maxAge: 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      message: "Logged in successfully",
      token: token,
    });
  } catch (err) {
    res.status(500).json({
      message: "Error during signin",
      error: err,
    });
  }
};
