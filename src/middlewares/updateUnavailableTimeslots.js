import { Trainer } from "../auth/models/Trainer.js";
import { WorkshopRequest } from "../workshop/models/WorkshopRequest.js";

/**
 * Middleware to mark the current middleware as final and proceed to update trainers' unavailable timeslots.
 * This approach abstracts the logic for setting the final middleware flag, making the route definition cleaner.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 */
function updateMultipleTrainersUnavailableTimeslotsTerminal(req, res, next) {
  req.isFinalMiddleware = true;
  updateMultipleTrainersUnavailableTimeslots(req, res, next);
}

/**
 * Middleware to update multiple trainers' unavailable timeslots.
 */
const updateMultipleTrainersUnavailableTimeslots = async (req, res, next) => {
  const { trainerIds } = req.body;

  try {
    await Promise.all(trainerIds.map(updateTrainerUnavailableTimeslots));

    if (!req.isFinalMiddleware) {
      next();
    } else {
      res
        .status(200)
        .json({ message: "Timeslots updated successfully for all trainers" });
    }
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Failed to update timeslots for trainers" });
  }
};

/**
 * Updates unavailable timeslots for a single trainer.
 * @param {string} trainerId - The ID of the trainer to update.
 */
const updateTrainerUnavailableTimeslots = async (trainerId) => {
  const trainer = await Trainer.findById(trainerId);
  if (!trainer) {
    console.log(`Trainer with ID ${trainerId} not found`);
    return;
  }

  const workshops = await WorkshopRequest.find({ trainers: trainerId });
  const newUnavailableTimeslots = workshops.map((workshop) => ({
    start: workshop.start_date,
    end: workshop.end_date,
  }));

  trainer.unavailableTimeslots = newUnavailableTimeslots;
  await trainer.save();
};

export {
  updateMultipleTrainersUnavailableTimeslots,
  updateMultipleTrainersUnavailableTimeslotsTerminal,
};
