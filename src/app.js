import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

import config from "../config.js";
import productRoutes from "./routes/products.js";
import { UserRouter } from "./routes/user.js";

const connectToDB = async () => {
  try {
    await mongoose.connect(config.db_uri, {});
  } catch (e) {
    console.log(e);
    process.exit(1);
  }
};

dotenv.config();
const app = express();

app.use(express.json());
app.use(
  cors({
    origin: [process.env.FRONT_END_URL],
    credentials: true,
  })
);
app.use(cookieParser());

app.use("/products", productRoutes);
app.use("/auth", UserRouter);

await connectToDB();

export default app;
