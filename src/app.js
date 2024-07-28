import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import bcrypt from "bcryptjs";

import config from "../config.js";
import productRoutes from "./test/routes/products.js";
import { UserRouter } from "./auth/routes/user.js";
import { Admin } from "./auth/models/Admin.js";
import { WorkshopRouter } from "./workshop/routes/workshopRoutes.js";
import { WorkshopSummaryRouter } from "./workshop/routes/workshopSummaryRoutes.js";
import { graphRouter } from "./graphs/routes/graphRoutes.js";
import { WorkshopDataRouter } from "./workshop/routes/WorkshopDataRoutes.js";
import { WorkshopRequestRouter } from "./workshop/routes/WorkshopRequestRoutes.js";
import "./utils/montlyCompletedScheduler.js";
import "./utils/ongoingScheduler.js";
import "./utils/totalCompletedScheduler.js";

const connectToDB = async () => {
  try {
    await mongoose.connect(config.db_uri, {});
    const existingSuperUser = await Admin.findOne({
      username: process.env.SUPERUSER_USERNAME,
      email: process.env.SUPERUSER_EMAIL,
    });
    if (existingSuperUser) {
      console.log("Superuser already exists.");
    } else {
      const hashpassword_superuser = await bcrypt.hash(
        process.env.SUPERUSER_PASSWORD,
        10
      );
      const superAdmin = new Admin({
        username: process.env.SUPERUSER_USERNAME,
        email: process.env.SUPERUSER_EMAIL,
        password: hashpassword_superuser,
        superAdmin: true,
      });
      await superAdmin.save();
    }
    return;
  } catch (e) {
    console.log(e);
    process.exit(1);
  }
};

const initializeApp = async () => {
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
  app.use("/workshop", WorkshopRouter);
  app.use("/workshopdata", WorkshopDataRouter);
  app.use("/workshoprequest", WorkshopRequestRouter);
  app.use("/workshopsummary", WorkshopSummaryRouter);
  app.use("/graph", graphRouter);

  await connectToDB();
  return app;
};

export default initializeApp;
