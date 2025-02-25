import mongoose from "mongoose";

const DbConnection =
  process.env.MONGODB_URL || "mongodb://localhost:27017/test";

export async function ConnectToDb() {
  try {
    await mongoose.connect(DbConnection);
    console.log("Connected to DB");
  } catch (err) {
    console.error("database connection error", err);
  }
}
