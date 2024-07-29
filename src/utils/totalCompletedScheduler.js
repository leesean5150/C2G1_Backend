import cron from "node-cron";
import mongoose from "mongoose";
import dotenv from "dotenv";
import { Trainer } from "../auth/models/Trainer.js";
import { WorkshopRequest } from "../workshop/models/WorkshopRequest.js";

cron.schedule("*/1 * * * *", async () => {
  try {
    console.log(
      "Running scheduled task to update total wokrshops for trainers"
    );

    const now = new Date();
    const totalcompletedWorkshops = await WorkshopRequest.find({
      end_date: { $lt: now },
    }).populate("trainers");

    const trainersToUpdate = totalcompletedWorkshops.reduce((acc, workshop) => {
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
          $set: {
            workshops_completed_total: trainersToUpdate[trainerId],
          },
        })
      )
    );

    console.log("Trainers total_workshops updated");
  } catch (error) {
    console.error("Error updating trainers ongoing_workshops", error);
  }
});
