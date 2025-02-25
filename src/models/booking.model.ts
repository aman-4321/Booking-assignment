import mongoose, { Schema } from "mongoose";

const bookingSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  groundId: {
    type: Schema.Types.ObjectId,
    ref: "Ground",
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  timeSlot: {
    start: {
      type: String,
      required: true,
    },
    end: {
      type: String,
      required: true,
    },
  },
});

export const Booking = mongoose.model("Booking", bookingSchema);
