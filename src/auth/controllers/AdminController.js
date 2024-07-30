import bcrypt from "bcryptjs";
import mongoose from "mongoose";

import { Admin } from "../models/Admin.js";
import { Trainer } from "../models/Trainer.js";
import { WorkshopRequest } from "../../workshop/models/WorkshopRequest.js";

/**
 * getAllTrainers()
 * Input: None
 * Output: JSON trainers list
 * Description: return all trainer (as JSON) existing in db.
 */
async function getAllTrainers(req, res) {
  try {
    const trainers = await Trainer.find({ role: "trainer" }).exec();
    return res.status(200).json(trainers);
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      message: e.message,
    });
  }
}
/**
 * getAllAvailableTrainers()
 * Input: start time, end time from req.body
 * Output: JSON list of available trainers
 * Description: return all available trainers (as JSON) who do not have a clash in their unavailableTimeslots with the given start and end times.
 */
async function getAllAvailableTrainers(req, res) {
  const { startTime, endTime } = req.query;
  try {
    // Parse and validate date inputs
    const start = new Date(startTime);
    const end = new Date(endTime);
    const currentDate = new Date();

    if (isNaN(start) || isNaN(end)) {
      return res
        .status(400)
        .json({ message: "Invalid date format. Please use YYYY-MM-DD." });
    }

    if (start <= currentDate) {
      return res.status(200).json([]);
    }

    const trainers = await Trainer.find({
      availability: "Active",
      unavailableTimeslots: {
        $not: {
          $elemMatch: {
            $or: [
              { start: { $gte: start, $lt: end } },
              { end: { $gt: start, $lte: end } },
              { start: { $lte: start }, end: { $gte: end } },
            ],
          },
        },
      },
    });

    return res.status(200).json(trainers);
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      message: e.message,
    });
  }
}
/**
 * adminCreateTrainer
 * Input: json object for trainer by body (JSON body)
 * Output: None
 * Description: with provided JSON, query db to create a new trainer.
 */
async function adminCreateTrainer(req, res) {
  try {
    const { username, email, password, fullname, trainer_role } = req.body;

    const hashpassword = await bcrypt.hash(password, 10);

    const trainer = new Trainer({
      username: username,
      email: email,
      password: hashpassword,
      fullname: fullname,
      trainer_role: trainer_role,
    });
    const savedTrainer = await trainer.save();

    return res.json(savedTrainer);
  } catch (e) {
    console.log(e);
    return res.status(500).json({ message: e });
  }
}
/**
 * adminActivateTrainer()
 * Input: id_ by params (/get/:id)
 * Output: None
 * Description: with provided id parameter, find a certain trainer and update availability status to Available.
 */
async function adminActivateTrainer(req, res) {
  try {
    const { id } = req.params;
    const trainer = await Trainer.findOne({ _id: id }).exec();
    if (!trainer) {
      return res.status(404).json({ message: "Trainer not found" });
    }
    if (trainer.availability === "Active") {
      return res.status(200).json({ message: "Trainer is already active" });
    }
    trainer.availability = "Active";
    await trainer.save();
    return res.json({
      status: true,
      message: "Trainer activated successfully",
    });
  } catch (e) {
    console.log(e);
    return res.status(500).json({ message: e });
  }
}
/**
 * adminDeactivateTrainer()
 * Input: id_ by params (/get/:id)
 * Output: None
 * Description: with provided id parameter, find a certain trainer and update availability status to false.
 */
async function adminDeactivateTrainer(req, res) {
  try {
    const { id } = req.params;

    //validater id as mongoose id
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ message: "Invalid id" });
    }
    const trainer = await Trainer.findOne({ _id: id }).exec();
    if (!trainer) {
      return res.status(404).json({ message: "Trainer not found" });
    }
    if (trainer.availability === "Inactive") {
      return res
        .status(200)
        .json({ message: "Trainer is already deactivated" });
    }
    trainer.availability = "Inactive";
    await trainer.save();
    return res.json({
      status: true,
      message: "Trainer successfully deactivated",
    });
  } catch (e) {
    console.log(e);
    return res.status(500).json({ message: e });
  }
}

async function deleteAllTrainers(req, res) {
  try {
    const result = await Trainer.deleteMany({});
    if (result.deletedCount === 0) {
      return res.status(404).json({ message: "No trainers found to delete" });
    }
    return res
      .status(200)
      .json({ status: true, message: "All trainers deleted successfully" });
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      message: e.message,
    });
  }
}

async function adminDeleteTrainer(req, res) {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid id" });
    }
    const trainer = await Trainer.findOneAndDelete({ _id: id }).exec();
    if (!trainer) {
      return res.status(404).json({ message: "Trainer not found" });
    }
    return res.json({ status: true, message: "Trainer deleted successfully" });
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      message: e.message,
    });
  }
}

async function adminUpdateTrainer(req, res) {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ message: "Invalid id" });
    }

    const {
      username,
      email,
      fullname,
      country,
      trainer_role,
      experience,
      gender,
      workshops_completed_this_month,
      ongoing_workshops,
      workshops_completed_total,
      availability,
    } = req.body;
    const trainer = await Trainer.findOne({ _id: id }).exec();
    if (!trainer) {
      return res.status(404).json({ message: "Trainer not found" });
    }
    if (username !== undefined) {
      trainer.username = username;
    }

    if (email !== undefined) {
      trainer.email = email;
    }

    if (fullname !== undefined) {
      trainer.fullname = fullname;
    }

    if (country !== undefined) {
      trainer.country = country;
    }

    if (trainer_role !== undefined) {
      trainer.trainer_role = trainer_role;
    }

    if (experience !== undefined) {
      trainer.experience = experience;
    }

    if (gender !== undefined) {
      trainer.gender = gender;
    }

    if (workshops_completed_this_month !== undefined) {
      trainer.workshops_completed_this_month = workshops_completed_this_month;
    }

    if (ongoing_workshops !== undefined) {
      trainer.ongoing_workshops = ongoing_workshops;
    }

    if (workshops_completed_total !== undefined) {
      trainer.workshops_completed_total = workshops_completed_total;
    }

    if (availability !== undefined) {
      trainer.availability = availability;
    }

    if (Object.keys(req.body).length === 0) {
      return res.status(400).json({ message: "No fields to update" });
    }
    await trainer.save();
    return res.json({ status: true, message: "Trainer updated successfully" });
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      message: e,
    });
  }
}

export default {
  adminCreateTrainer,
  adminActivateTrainer,
  adminDeactivateTrainer,
  getAllTrainers,
  getAllAvailableTrainers,
  adminDeleteTrainer,

  adminUpdateTrainer,
  deleteAllTrainers,
};
