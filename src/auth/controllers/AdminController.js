import bcrypt from "bcryptjs";

import { Admin } from "../models/Admin.js";
import { Trainer } from "../models/Trainer.js";

async function getAllTrainers(req, res) {
  try {
    const trainers = await Trainer.find({ role: "trainer" }).exec();
    return res.json({ status: true, trainers });
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      message: e,
    });
  }
}

async function adminCreateTrainer(req, res) {
  try {
    const { username, email, password } = req.body;

    const hashpassword = await bcrypt.hash(password, 10);

    const trainer = new Trainer({
      username: username,
      email: email,
      password: hashpassword,
    });
    await trainer.save();

    return res.json({ status: true, message: "Trainer added successfully" });
  } catch (e) {
    console.log(e);
    return res.status(500).json({ message: e });
  }
}

async function adminActivateTrainer(req, res) {
  try {
    const { id } = req.params;
    const trainer = await Trainer.findOne({ _id: id }).exec();
    if (!trainer) {
      return res.status(404).json({ message: "Trainer not found" });
    }
    if (trainer.active === true) {
      return res.status(200).json({ message: "Trainer is already active" });
    }
    trainer.active = true;
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

async function adminDeactivateTrainer(req, res) {
  try {
    const { id } = req.params;
    const trainer = await Trainer.findOne({ _id: id }).exec();
    if (!trainer) {
      return res.status(404).json({ message: "Trainer not found" });
    }
    if (trainer.active === false) {
      return res
        .status(200)
        .json({ message: "Trainer is already deactivated" });
    }
    trainer.active = false;
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

async function adminUpdateTrainer(req, res) {
  try {
    console.log("here1");
    const { id } = req.params;
    const {
      username,
      email,
      password,
      active,
      workshopId,
      startTime,
      endTime,
      workshopDescription,
    } = req.body;
    const trainer = await Trainer.findOne({ _id: id }).exec();
    console.log("found trainer" + trainer.username);
    if (!trainer) {
      return res.status(404).json({ message: "Trainer not found" });
    }
    if (active !== undefined) {
      trainer.active = active;
    }
    if (username !== undefined) {
      trainer.username = username;
    }
    if (email !== undefined) {
      trainer.email = email;
    }
    if (password !== undefined) {
      trainer.password = password;
    }
    if (workshopId !== undefined) {
      trainer.workshopId = workshopId;
    }
    if (startTime !== undefined) {
      trainer.startTime = startTime;
    }
    if (endTime !== undefined) {
      trainer.endTime = endTime;
    }
    if (workshopDescription !== undefined) {
      trainer.workshopDescription = workshopDescription;
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
  getAllTrainers,
  adminActivateTrainer,
  adminUpdateTrainer,
  adminDeactivateTrainer,
  adminCreateTrainer,
};
