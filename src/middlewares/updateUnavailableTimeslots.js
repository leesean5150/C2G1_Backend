import { Trainer } from "../auth/models/Trainer.js";
import { Workshop } from "../workshop/models/Workshop.js";

/**
 * Middleware to update multiple trainers' unavailable timeslots.
 */
const updateMultipleTrainersUnavailableTimeslots = async (req, res, next) => {
  const trainerIds = req.body.trainerIds;

  try {
    for (const trainerId of trainerIds) {
      const trainer = await Trainer.findById(trainerId);
      if (!trainer) {
        console.log(`Trainer with ID ${trainerId} not found`);
        continue;
      }

      const workshops = await Workshop.find({ trainers: trainerId });

      const newUnavailableTimeslots = workshops.map((workshop) => ({
        start: workshop.startDate,
        end: workshop.endDate,
      }));

      trainer.unavailableTimeslots = newUnavailableTimeslots;
      await trainer.save();
    }

    return res
      .status(200)
      .json({ message: "Timeslots updated successfully for all trainers" });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Failed to update timeslots for trainers" });
  }
};

export { updateMultipleTrainersUnavailableTimeslots };
