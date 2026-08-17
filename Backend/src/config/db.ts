import mongoose from "mongoose";
import { env } from "./env";

export const connectDB = async (): Promise<void> => {
  if (!env.MONGO_URI) {
    throw new Error("MONGO_URI is missing");
  }

  try {
    await mongoose.connect(env.MONGO_URI);

    console.log("✅ MongoDB Connected");
  } catch (error) {
    console.error(`
====================================
❌ MongoDB CONNECTION FAILED
====================================
`);

    console.error(error);

    throw error;
  }
};
