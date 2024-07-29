import cron from "node-cron";
import mongoose from "mongoose";
import dotenv from "dotenv";
import { Trainer } from "../auth/models/Trainer.js";
import { WorkshopRequest } from "../workshop/models/WorkshopRequest.js";

cron.schedule("*/1 * * * *", async () => {
  try {
    console.log("Running scheduled task to update trainers");

    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    const completedWorkshops = await WorkshopRequest.find({
      end_date: { $gte: startOfMonth, $lt: endOfMonth },
    }).populate("trainers");

    const trainersToUpdate = completedWorkshops.reduce((acc, workshop) => {
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
          $set: { workshops_completed_this_month: trainersToUpdate[trainerId] },
        })
      )
    );

    console.log("Trainers workshops_completed_this_month updated");
  } catch (error) {
    console.error(
      "Error updating trainers workshops_completed_this_month",
      error
    );
  }
});
