import { Trainer } from "../models/Trainer.js";
import { WorkshopRequest } from "../../workshop/models/WorkshopRequest.js";

async function getAllocatedWorkshops(req, res) {
  try {
    const trainer = await Trainer.findById(req.user.id)
      .populate({
        path: "workshop_request",
        populate: {
          path: "workshop_data",
        },
      })
      .exec();
    if (!trainer) {
      return res
        .status(404)
        .json({ status: false, message: "Trainer not found" });
    }
    const trainer_workshops = trainer.workshop_request;
    return res.json({ trainer_workshops });
  } catch (error) {
    return res.status(500).json({ status: false, message: error.message });
  }
}

async function getTeammates(req, res, next) {
  try {
    const trainer = await Trainer.findById(req.user.id)
      .populate({
        path: "workshop_request",
        populate: {
          path: "trainers",
        },
      })
      .exec();
    if (!trainer) {
      return res
        .status(404)
        .json({ status: false, message: "Trainer not found" });
    }
    const trainer_workshops = trainer.workshop_request;
    return res.json({ trainer_workshops });
  } catch (error) {
    return res.status(500).json({ status: false, message: error.message });
  }
}

async function getOthers(req, res, next) {
  try {
    const trainerList = await Trainer.find({ role: "trainer" })
      .populate({
        path: "workshop_request",
        populate: {
          path: "trainers",
        },
      })
      .exec();
    if (!trainerList) {
      return res
        .status(404)
        .json({ status: false, message: "Trainer not found" });
    }
    return res.status(200).json(trainerList);
  } catch (error) {
    return res.status(500).json({ status: false, message: error.message });
  }
}

async function updateUtilisation(req, res) {
  try {
    const workshop_request = await WorkshopRequest.findById(req.params.id);

    if (!workshop_request) {
      return res
        .status(404)
        .json({ status: false, message: "WorkshopRequest not found" });
    }

    const new_utilisation = req.body;

    if (!Array.isArray(new_utilisation)) {
      return res
        .status(400)
        .json({ status: false, message: "Invalid utilisation data" });
    }

    workshop_request.utilisation = new_utilisation;

    await workshop_request.save();

    return res
      .status(200)
      .json({ status: true, message: "Utilisation updated successfully" });
  } catch (error) {
    return res.status(500).json({ status: false, message: error.message });
  }
}

export default {
  getAllocatedWorkshops,
  getTeammates,
  getOthers,
  updateUtilisation,
};
