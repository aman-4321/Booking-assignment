import mongoose, { Schema } from "mongoose";

const groundSchema = new Schema({
  name: String,
  location: String,
  sport: String,
  capacity: Number,
});

export const Ground = mongoose.model("Ground", groundSchema);
