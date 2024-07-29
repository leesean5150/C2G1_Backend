import cron from "node-cron";
import mongoose from "mongoose";
import dotenv from "dotenv";
import { Trainer } from "../auth/models/Trainer.js";
import { WorkshopRequest } from "../workshop/models/WorkshopRequest.js";

cron.schedule("*/1 * * * *", async () => {
  try {
    console.log(
      "Running scheduled task to update ongoing workshops for trainers"
    );

    const now = new Date();

    const ongoingWorkshops = await WorkshopRequest.find({
      start_date: { $lte: now },
      end_date: { $gte: now },
    }).populate("trainers");

    const trainersToUpdate = ongoingWorkshops.reduce((acc, workshop) => {
      workshop.trainers.forEach((trainer) => {
        const trainerId = trainer._id.toString();
        if (!acc[trainerId]) {
          acc[trainerId] = 0;
        }
        acc[trainerId]++;
      });
      return acc;
    }, {});

    await Promise.all(
      Object.keys(trainersToUpdate).map((trainerId) =>
        Trainer.findByIdAndUpdate(trainerId, {
          $set: { ongoing_workshops: trainersToUpdate[trainerId] },
        })
      )
    );

    console.log("Trainers ongoing_workshops updated");
  } catch (error) {
    console.error("Error updating trainers ongoing_workshops", error);
  }
});
