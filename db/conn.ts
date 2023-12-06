import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

async function main() {
  try {
    await mongoose.connect(process.env.MONGODB_CONNECTION || "");
    console.log("MongoDB connected");
  } catch (error) {
    console.log(`Connection error: ${error}`);
  }
}

export default main;
