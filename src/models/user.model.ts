import mongoose, { Schema } from "mongoose";

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },

  email: {
    type: String,
    required: true,
    trim: true,
    unique: true,
  },

  password: {
    type: String,
    required: true,
    minLength: 5,
    maxLength: 100,
    trim: true,
  },
});

export const User = mongoose.model("User", userSchema);
