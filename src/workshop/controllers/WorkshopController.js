import { Workshop } from "../models/Workshop.js";
import { Trainer } from "../../auth/models/Trainer.js";
import { Client } from "../../auth/models/Client.js";
import { updateMultipleTrainersUnavailableTimeslots } from "../../middlewares/updateUnavailableTimeslots.js";

/**
 * createWorkshop()
 * Input: json object for workshop by body (JSON body)
 * Output: None
 * Description: with provided JSON, query db to create a new workshop request.
 */
async function createWorkshop(req, res, next) {
  try {
    const {
      workshop_ID,
      workshop_name,
      start_date,
      end_date,
      availability,
      description,
      deal_potential,
      pax,
      venue,
      country,
      client_ID,
      workshop_type,
    } = req.body;

    const client = await Client.findById(client_ID);
    if (!client) {
      return res.status(404).json({ message: "Client not found" });
    }

    const newWorkshop = new Workshop({
      workshop_ID,
      workshop_name,
      start_date,
      end_date,
      availability,
      description,
      deal_potential,
      pax,
      venue,
      country,
      workshop_type,
      client: client._id,
    });

    const savedWorkshop = await newWorkshop.save();

    client.workshop = savedWorkshop._id;
    await client.save();

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
    const workshops = await Workshop.find()
      .populate("client")
      .populate("trainers");
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
 * Input: Request body containing an array of trainer IDs and a workshop ID
 * Output: Response object with status and message
 * Description: This function checks the availability of trainers based on their unavailableTimeslots against the workshop's start and end time. Only trainers who are active and available during the workshop's time are added to the workshop. It updates both the trainers and workshop documents to establish a two-way link between them, ensuring that only available and active trainers are linked to the workshop.
 */

async function addTrainers(req, res, next) {
  try {
    const { trainerIds } = req.body;
    const workshopId = req.params.id;

    const workshop = await Workshop.findById(workshopId);
    if (!workshop) {
      return res.status(404).json({ message: "Workshop not found" });
    }
    const { start_date, end_date } = workshop;
    console.log(start_date, end_date);

    const activeTrainers = [];
    for (const trainerId of trainerIds) {
      const trainer = await Trainer.findById(trainerId);
      if (!trainer || !trainer.availability) continue;

      const isTrainerUnavailable = trainer.unavailableTimeslots.some(
        (timeslot) => {
          const timeslotStart = new Date(timeslot.start);
          const timeslotEnd = new Date(timeslot.end);
          const workshopStart = new Date(start_date);
          const workshopEnd = new Date(end_date);
          console.log(
            workshopStart <= timeslotEnd && workshopEnd >= timeslotStart
          );
          return workshopStart <= timeslotEnd && workshopEnd >= timeslotStart;
        }
      );

      if (!isTrainerUnavailable) {
        activeTrainers.push(trainerId);
      }
    }

    if (activeTrainers.length === 0) {
      return res
        .status(400)
        .json({ message: "No active and available trainers found" });
    }

    const updatedWorkshop = await Workshop.findByIdAndUpdate(
      workshopId,
      { $addToSet: { trainers: { $each: activeTrainers } } },
      { new: true }
    );

    if (!updatedWorkshop) {
      return res.status(404).json({ message: "Workshop not found" });
    }

    await Promise.all(
      activeTrainers.map((trainerId) =>
        Trainer.findByIdAndUpdate(
          trainerId,
          { $addToSet: { workshops: workshopId } },
          { new: true }
        )
      )
    );

    updateMultipleTrainersUnavailableTimeslots(req, res, next);
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
