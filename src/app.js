import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import bcrypt from "bcryptjs";

import config from "../config.js";
import productRoutes from "./test/routes/products.js";
import { UserRouter } from "./auth/routes/user.js";
import { User } from "./auth/models/User.js";
import { WorkshopRouter } from "./workshop/routes/workshopRoutes.js";
import { Workshop } from "./workshop/models/Workshop.js";

const connectToDB = async() => {
    try {
        await mongoose.connect(config.db_uri, {});
        const existingSuperUser = await User.findOne({ role: "admin" });
        const existingClient = await User.findOne({ role: "client" });
        if (existingSuperUser) {
            console.log("Superuser already exists.");
        } else {
            const hashpassword_superuser = await bcrypt.hash(process.env.SUPERUSER_PASSWORD, 10);
            const superUser = new User({
                username: process.env.SUPERUSER_USERNAME,
                email: process.env.SUPERUSER_EMAIL,
                password: hashpassword_superuser,
                role: "admin",
            });
            await superUser.save();
        }

        if (existingClient) {
            console.log("Client already exists.");
        } else {

            const hashpassword_client = await bcrypt.hash(process.env.CLIENT_PASSWORD, 10);
            const clientUser = new User({
                username: process.env.CLIENT_USERNAME,
                email: process.env.CLIENT_EMAIL,
                password: hashpassword_client,
                role: "client"
            });
            await clientUser.save();
        }

        return;
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
app.use("/workshop", WorkshopRouter);

await connectToDB();

export default app;