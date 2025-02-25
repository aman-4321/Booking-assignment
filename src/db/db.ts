import { configDotenv } from "dotenv";
import mongoose from "mongoose";

configDotenv();

const DbConnection = process.env.MONGODB_URL || "";

if (!DbConnection) {
  console.error("Mongo db url not present");
}

export async function ConnectToDb() {
  try {
    await mongoose.connect(DbConnection);
    console.log("Connected to DB");
  } catch (err) {
    console.error("database connection error", err);
  }
}
