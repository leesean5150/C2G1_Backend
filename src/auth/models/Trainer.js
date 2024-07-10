import mongoose from "mongoose";

const timeslotSchema = new mongoose.Schema({
  start: Date,
  end: Date,
});

const trainerSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: "trainer" },
  active: { type: Boolean, default: true },
  workshopId: { type: Number, default: "" },
  startTime: { type: String, default: "" },
  endTime: { type: String, default: "" },
  workshopDescription: { type: String, default: "" },
  workshops: [{ type: mongoose.Schema.Types.ObjectId, ref: "Workshop" }],
  unavailableTimeslots: [timeslotSchema],
});

const TrainerModel = mongoose.model("Trainer", trainerSchema);
const TimeslotModel = mongoose.model("Timeslot", timeslotSchema);

export { TrainerModel as Trainer };
export { TimeslotModel as Timeslot };
