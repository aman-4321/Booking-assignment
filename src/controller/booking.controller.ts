import { Request, Response } from "express";
import { Booking } from "../models/booking.model";
import { Ground } from "../models/ground.model";
import mongoose from "mongoose";
import { createBookingBody } from "../zod/ValidationSchemas";

export const createBooking = async (req: Request, res: Response) => {
  const { success, error, data } = createBookingBody.safeParse(req.body);

  if (!success) {
    res.status(400).json({
      message: "Invalid input",
      error: error.errors,
    });
    return;
  }

  try {
    const ground = await Ground.findById(data.groundId);
    if (!ground) {
      res.status(404).json({ message: "Ground not found" });
      return;
    }

    const bookingDate = new Date(data.date);
    bookingDate.setHours(0, 0, 0, 0);

    const existingBooking = await Booking.findOne({
      groundId: data.groundId,
      date: bookingDate,
      $or: [
        {
          "timeSlot.start": { $lte: data.timeSlot.start },
          "timeSlot.end": { $gt: data.timeSlot.start },
        },
        {
          "timeSlot.start": { $lt: data.timeSlot.end },
          "timeSlot.end": { $gte: data.timeSlot.end },
        },
        {
          "timeSlot.start": { $gte: data.timeSlot.start },
          "timeSlot.end": { $lte: data.timeSlot.end },
        },
      ],
    });

    if (existingBooking) {
      res.status(409).json({
        message: "Time slot already booked",
        existingBooking,
      });
      return;
    }

    const booking = await Booking.create({
      ...data,
      date: bookingDate,
      userId: req.userId,
    });

    res.status(201).json({
      message: "Booking created successfully",
      booking,
    });
  } catch (error) {
    console.error("Booking creation error:", error);
    res.status(500).json({
      message: "Error creating booking",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

export const getUserBookings = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      res.status(400).json({ message: "Invalid user ID format" });
      return;
    }

    const bookings = await Booking.find({ userId })
      .populate("groundId")
      .populate("userId", "name email")
      .sort({ date: -1 })
      .exec();

    if (!bookings || bookings.length === 0) {
      res.status(200).json({
        message: "No bookings found for this user",
        bookings: [],
      });
      return;
    }

    res.status(200).json({
      message: "Bookings fetched successfully",
      bookings,
    });
  } catch (error) {
    console.error("Error fetching bookings:", error);
    res.status(500).json({
      message: "Error fetching bookings",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

export const cancelBooking = async (req: Request, res: Response) => {
  try {
    const { bookingId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(bookingId)) {
      res.status(400).json({ message: "Invalid booking ID format" });
      return;
    }

    const booking = await Booking.findById(bookingId);

    if (!booking) {
      res.status(404).json({ message: "Booking not found" });
      return;
    }

    if (booking.userId.toString() !== req.userId) {
      res.status(403).json({
        message: "You are not authorized to cancel this booking",
      });
      return;
    }

    const bookingDate = new Date(booking.date);
    const now = new Date();

    if (bookingDate < now) {
      res.status(400).json({
        message: "Cannot cancel past bookings",
      });
      return;
    }

    await Booking.findByIdAndDelete(bookingId);

    res.status(200).json({
      message: "Booking cancelled successfully",
    });
  } catch (error) {
    console.error("Error cancelling booking:", error);
    res.status(500).json({
      message: "Error cancelling booking",
      error: error instanceof Error ? error.message : "Unknown error",
    });
    return;
  }
};
