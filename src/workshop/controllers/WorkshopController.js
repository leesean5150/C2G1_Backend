import { Workshop } from "../models/Workshop.js";
import { Trainer } from "../../auth/models/Trainer.js";

/**
 * createWorkshop()
 * Input: json object for workshop by body (JSON body)
 * Output: None
 * Description: with provided JSON, query db to create a new workshop request.
 */
async function createWorkshop(req, res, next) {
  try {
    const { workshopId, startDate, endDate, availability, description } =
      req.body;
    const newWorkshop = new Workshop({
      workshopId,
      startDate,
      endDate,
      availability,
      description,
    });
    const savedWorkshop = await newWorkshop.save();
    return res.status(201).json(savedWorkshop);
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "Failed to create workshop", error });
  }
}

/**
 * getAllWorkshops()
 * Input: None
 * Output: workshops (json)
 * Description: return all workshop requests (as JSON) existing in db.
 */
async function getAllWorkshops(req, res, next) {
  try {
    const workshops = await Workshop.find();
    return res.status(200).json(workshops);
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "Failed to retrieve workshops", error });
  }
}

/**
 * getOneWorkshop()
 * Input: id_ by params (/get/:id)
 * Output: the workshop (json)
 * Description: with provided id parameter, find a certain workshop from the database and returns it.
 */

async function getOneWorkshop(req, res) {
  try {
    const { id } = req.params;

    const workshop = await Workshop.findOne({ _id: id });
    if (!workshop) {
      return res.status(404).json({ message: "Workshop not found" });
    }
    return res.status(200).json(workshop);
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "Failed to retrieve workshop", error });
  }
}

/**
 * deleteWorkshop()
 * Input: id_ by params (/get/:id)
 * Output: None
 * Description: with provided id parameter, find a certain workshop from the database and delete it.
 */
async function deleteWorkshop(req, res) {
  try {
    const { id } = req.params;

    const workshop = await Workshop.findOneAndDelete({ _id: id });
    if (!workshop) {
      return res.status(404).json({ message: "Workshop not found" });
    }
    return res.status(204).send();
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "Failed to delete workshop", error });
  }
}

/**
 * searchWorkshops()
 * Input: json object including {attributeName, attributeContent} by body (JSON body)
 * Output: the workshops (json)
 * Description: with provided info, find workshops that matches to the filter from the database and return them.
 */
async function searchWorkshops(req, res) {
  try {
    const { attributeName, attributeContent } = req.body;
    const filter = {};
    filter[attributeName] = attributeContent;

    const workshops = await Workshop.find(filter);
    if (workshops.length === 0) {
      return res
        .status(404)
        .json({ message: "No workshop found with the given attribute" });
    }
    return res.status(200).json(workshops);
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "Failed to search workshops", error });
  }
}

/**
 * addTrainers()
 * Input: Array of _id of trainers and workshop object
 * Output: None
 * Description: Updates both the trainers and workshop documents to establish a two-way link between them.
 */
async function addTrainers(req, res, next) {
  try {
    const { trainerIds, workshopId } = req.body; // Changed to accept an array of trainerIds

    // Validate each trainer and collect active ones
    const activeTrainers = [];
    for (const trainerId of trainerIds) {
      const trainer = await Trainer.findById(trainerId);
      if (!trainer || !trainer.active) continue; // Skip non-existent or inactive trainers
      activeTrainers.push(trainerId);
    }

    if (activeTrainers.length === 0) {
      return res.status(400).json({ message: "No active trainers found" });
    }

    // Update the workshop with all active trainers
    const updatedWorkshop = await Workshop.findByIdAndUpdate(
      workshopId,
      { $addToSet: { trainers: { $each: activeTrainers } } }, // Use $each to add multiple trainers
      { new: true }
    );

    if (!updatedWorkshop) {
      return res.status(404).json({ message: "Workshop not found" });
    }

    // Update each active trainer with the workshop
    await Promise.all(
      activeTrainers.map((trainerId) =>
        Trainer.findByIdAndUpdate(
          trainerId,
          { $addToSet: { workshops: workshopId } },
          { new: true }
        )
      )
    );

    next();
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Failed to add trainers", error });
  }
}

async function approveRequest(req, res) {
  try {
    const { id } = req.params;

    const workshop = await Workshop.findOne({ _id: id });
    if (!workshop) {
      return res.status(404).json({ message: "Workshop not found" });
    }
    if (workshop.status === "approved") {
      return res.status(200).json({ message: "Workshop is already approved" });
    }

    workshop.status = "approved";
    workshop.rejectReason = "N/A";

    await workshop.save();

    return res.status(200).json(workshop);
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "Failed to retrieve workshop", error });
  }
}

async function rejectRequest(req, res) {
  try {
    const { rejectReason } = req.body;
    const { id } = req.params;

    const workshop = await Workshop.findOne({ _id: id });
    if (!workshop) {
      return res.status(404).json({ message: "Workshop not found" });
    }
    if (workshop.status === "rejected") {
      return res.status(200).json({ message: "Workshop is already rejected" });
    }

    workshop.status = "rejected";
    workshop.rejectReason = rejectReason;

    await workshop.save();

    return res.status(200).json(workshop);
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "Failed to retrieve workshop", error });
  }
}

export default {
  createWorkshop: createWorkshop,
  getAllWorkshops: getAllWorkshops,
  getOneWorkshop: getOneWorkshop,
  deleteWorkshop: deleteWorkshop,
  searchWorkshops: searchWorkshops,
  addTrainers: addTrainers,
  approveRequest: approveRequest,
  rejectRequest: rejectRequest,
};
