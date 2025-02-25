import mongoose from "mongoose";
import { Ground } from "../models/ground.model";

const seedGrounds = async () => {
  await mongoose.connect("mongodb://localhost:27017/test");

  const existing = await Ground.countDocuments();
  if (existing > 0) {
    console.log("Grounds already seeded");
    return;
  }

  await Ground.insertMany([
    {
      name: "City Stadium",
      location: "Downtown",
      sport: "Football",
      capacity: 5000,
    },
    {
      name: "Greenfield Arena",
      location: "Suburbs",
      sport: "Cricket",
      capacity: 10000,
    },
    {
      name: "Skyline Court",
      location: "Uptown",
      sport: "Basketball",
      capacity: 2000,
    },
    {
      name: "Riverpark Field",
      location: "Near River",
      sport: "Tennis",
      capacity: 500,
    },
  ]);

  console.log("Mock grounds seeded");
  mongoose.connection.close();
};

seedGrounds();
