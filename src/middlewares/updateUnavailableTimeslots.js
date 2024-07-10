import { Trainer, Timeslot } from "../auth/models/Trainer.js";
import { Workshop } from "../workshop/models/Workshop.js";

/**
 * Middleware to update a trainer's unavailable timeslots.
 */
const updateUnavailableTimeslotsMiddleware = async (req, res, next) => {
  const trainerId = req.body.trainerId; // Accessing trainerId from the request body

  try {
    const trainer = await Trainer.findById(trainerId);
    if (!trainer) {
      return res.status(404).json({ message: "Trainer not found" });
    }

    // Fetch all workshops the trainer is assigned to
    const workshops = await Workshop.find({ trainerId: trainerId });

    // Create new array to store unavailable timeslots
    const newUnavailableTimeslots = [];

    // Loop through all workshops the trainer is assigned to
    workshops.forEach((workshop) => {
      // Assuming workshop model has startDate, endDate, startTime, and endTime
      // Construct the timeslot object
      const newTimeslot = new Timeslot({
        start: workshop.startDate,
        end: workshop.endDate,
      });
      // Push the timeslot to the array
      newUnavailableTimeslots.push(newTimeslot);
    });

    // Update the trainer's unavailableTimeslots
    trainer.unavailableTimeslots = newUnavailableTimeslots;

    await trainer.save();

    // Optionally, attach updated trainer to the request object if needed downstream
    req.updatedTrainer = trainer;

    next(); // Proceed to next middleware or route handler
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Failed to update timeslots" });
  }
};

export { updateUnavailableTimeslotsMiddleware };
