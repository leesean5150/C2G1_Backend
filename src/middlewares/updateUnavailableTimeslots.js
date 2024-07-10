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

    console.log(trainerId);

    // Fetch all workshops the trainer is assigned to
    const workshops = await Workshop.find({ trainers: trainerId });
    console.log(workshops);

    // Create new array to store unavailable timeslots
    const newUnavailableTimeslots = [];

    // Loop through all workshops the trainer is assigned to
    workshops.forEach((workshop) => {
      // Construct the timeslot object
      const newTimeslot = {
        start: workshop.startDate,
        end: workshop.endDate,
      };
      // Push the timeslot to the array
      newUnavailableTimeslots.push(newTimeslot);
      console.log(newTimeslot);
    });

    console.log(newUnavailableTimeslots);

    // Update the trainer's unavailableTimeslots
    trainer.unavailableTimeslots = newUnavailableTimeslots.map((timeslot) => ({
      start: timeslot.start,
      end: timeslot.end,
    }));

    await trainer.save();

    // Send response to client
    return res.status(200).json({ message: "Timeslots updated successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Failed to update timeslots" });
  }
};

export { updateUnavailableTimeslotsMiddleware };
