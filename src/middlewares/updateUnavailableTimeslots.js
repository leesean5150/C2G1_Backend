import { Trainer, Timeslot } from "../auth/models/Trainer.js";
import { Workshop } from "../workshop/models/Workshop.js";

/**
 * Middleware to update a trainer's unavailable timeslots.
 */
const updateUnavailableTimeslotsMiddleware = async (req, res, next) => {
  const trainerId = req.body.trainerId;

  try {
    const trainer = await Trainer.findById(trainerId);
    if (!trainer) {
      return res.status(404).json({ message: "Trainer not found" });
    }

    const workshops = await Workshop.find({ trainers: trainerId });

    const newUnavailableTimeslots = [];

    workshops.forEach((workshop) => {
      const newTimeslot = {
        start: workshop.startDate,
        end: workshop.endDate,
      };
      newUnavailableTimeslots.push(newTimeslot);
    });

    trainer.unavailableTimeslots = newUnavailableTimeslots.map((timeslot) => ({
      start: timeslot.start,
      end: timeslot.end,
    }));

    await trainer.save();

    return res.status(200).json({ message: "Timeslots updated successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Failed to update timeslots" });
  }
};

export { updateUnavailableTimeslotsMiddleware };
