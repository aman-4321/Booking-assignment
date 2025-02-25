import express from "express";
import { authMiddleware } from "../middleware/middleware";
import {
  cancelBooking,
  createBooking,
  getUserBookings,
} from "../controller/booking.controller";

export const BookingRouter = express.Router();

BookingRouter.post("/", authMiddleware, createBooking);
BookingRouter.get("/:userId", authMiddleware, getUserBookings);
BookingRouter.delete("/:bookingId", authMiddleware, cancelBooking);
