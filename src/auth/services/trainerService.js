import { Trainer } from "./Trainer.js";
import { Workshop } from "./../../workshop/models/Workshop.js";
import { Timeslot } from "./Trainer.js";

/**
 * Updates a trainer's unavailable timeslots.
 * @param {String} trainerId - The ID of the trainer to update.
 */

async function updateUnavailableTimeslots(trainerId) {
  try {
    const trainer = await Trainer.findById(trainerId);
    if (!trainer) {
      return { status: 404, message: "Trainer not found" };
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
    return { status: 204, message: "Timeslots updated successfully" };
  } catch (error) {
    console.log(error);
    return { status: 500, message: "Failed to update timeslots" };
  }
}

export { updateUnavailableTimeslots };
