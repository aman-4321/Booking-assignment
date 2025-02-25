import express from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import { ConnectToDb } from "./db/db";
import dotenv from "dotenv";
import { UserRouter } from "./routes/user.routes";
import { GroundRouter } from "./routes/ground.routes";
import { BookingRouter } from "./routes/booking.routes";
import cookieParser from "cookie-parser";

const app = express();

dotenv.config();

const port = process.env.PORT || "8080";

ConnectToDb();

app.use(
  cors({
    credentials: true,
  })
);
app.use(express.json());
app.use(helmet());
app.use(compression());
app.use(cookieParser());

app.use("/api/v1/user", UserRouter);
app.use("/api/v1/grounds", GroundRouter);
app.use("/api/v1/bookings", BookingRouter);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
