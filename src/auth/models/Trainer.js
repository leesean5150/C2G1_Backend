import mongoose from "mongoose";

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
<<<<<<< HEAD
=======
  unavailableTimeslots: [{ start: Date, end: Date }],
>>>>>>> parent of 53c7190 (Merge pull request #20 from leesean5150/Schema-Update)
});

const TrainerModel = mongoose.model("Trainer", trainerSchema);

export { TrainerModel as Trainer };
