import mongoose from "mongoose";
import dotenv from "dotenv";

import uri from "./util/uri.js";
import { createApp } from "./app.js";

dotenv.config();

export async function startServer({ port = 5500 } = {}) {
  const app = createApp();

  try {
    await mongoose.connect(uri);
    console.log("MongoDB connected successfully");
  } catch (err) {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  }

  const server = app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
  });

  return { app, server };
}

