import { Client } from "../../auth/models/Client.js";
import { Trainer } from "../../auth/models/Trainer.js";
import { updateMultipleTrainersUnavailableTimeslots } from "../../middlewares/updateUnavailableTimeslots.js";
import { WorkshopData } from "../models/WorkshopData.js";
import { WorkshopRequest } from "../models/WorkshopRequest.js";
import { checkTimeslotOverlap } from "../../utils/dateUtils.js";

async function getAllWorkshopRequests(req, res, next) {
  try {
    const workshops = await WorkshopRequest.find()
      .populate("workshop_data")
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

async function getAllSubmittedWorkshops(req, res, next) {
  try {
    const workshops = await WorkshopRequest.find({
      status: "submitted",
    })
      .sort({ updatedAt: -1 })
      .populate("workshop_data");
    return res.status(200).json(workshops);
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "Failed to retrieve workshops", error });
  }
}

async function getAllApprovedWorkshops(req, res) {
  try {
    const data = [];
    const aggregatePipeline = [
      { $match: { status: "approved" } },
      {
        $lookup: {
          from: "workshopdatas",
          localField: "workshop_data",
          foreignField: "_id",
          as: "workshop_data_details",
        },
      },
      {
        $unwind: {
          path: "$workshop_data_details",
          preserveNullAndEmptyArrays: true,
        },
      },
    ];

    const workshops = await WorkshopRequest.aggregate(aggregatePipeline);

    data.push(workshops);
    console.log(`data:`, data);
    return res.status(200).json(data);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error });
  }
}

async function getNonSubmittedWorkshops(req, res, next) {
  try {
    const workshops = await WorkshopRequest.find({
      status: { $ne: "submitted" },
    })
      .sort({ updatedAt: -1 })
      .populate("trainers")
      .populate("workshop_data");
    return res.status(200).json(workshops);
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "Failed to retrieve workshops", error });
  }
}

async function getWorkshopRequest(req, res, next) {
  try {
    const { id } = req.params;
    const workshop = await WorkshopRequest.findById(id);
    if (!workshop) {
      return res.status(404).json({ message: "Workshop not found" });
    }
    return res.json(workshop);
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "Failed to retrieve workshop", error });
  }
}

async function createWorkshopRequest(req, res, next) {
  try {
    const {
      company_role,
      company,
      name,
      email,
      phone_number,
      pax,
      deal_potential,
      country,
      venue,
      start_date,
      end_date,
      request_message,
      workshop_data_id,
      client_id,
    } = req.body;

    const workshopData = await WorkshopData.findOne({
      workshop_ID: workshop_data_id,
    });
    if (!workshopData) {
      return res.status(404).json({ message: "Workshop data not found" });
    }

    const clientData = await Client.findById(client_id);
    if (!clientData) {
      return res.status(404).json({ message: "Client not found" });
    }

    const newWorkshopRequest = new WorkshopRequest({
      company_role,
      company,
      name,
      email,
      phone_number,
      pax,
      deal_potential,
      country,
      venue,
      start_date,
      end_date,
      request_message,
      workshop_data: workshopData._id,
      client: client_id,
    });
    const savedWorkshopRequest = await newWorkshopRequest.save();

    workshopData.workshop_request.push(savedWorkshopRequest._id);
    await workshopData.save();

    clientData.workshop_request.push(savedWorkshopRequest._id);
    await clientData.save();

    return res.status(201).json({
      message: "Workshop request created successfully",
      workshopRequest: savedWorkshopRequest,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "Failed to create workshop request", error });
  }
}

async function updatedWorkshopRequest(req, res, next) {
  try {
    const { id } = req.params;
    const {
      company_role,
      company,
      name,
      email,
      phone_number,
      pax,
      deal_potential,
      country,
      venue,
      start_date,
      end_date,
      request_message,
      workshop_id,
    } = req.body;

    const workshopData = await WorkshopData.findOne({
      workshop_ID: workshop_id,
    });

    const updateFields = {
      ...(company_role && { company_role }),
      ...(company && { company }),
      ...(name && { name }),
      ...(email && { email }),
      ...(phone_number && { phone_number }),
      ...(pax && { pax }),
      ...(deal_potential && { deal_potential }),
      ...(country && { country }),
      ...(venue && { venue }),
      ...(start_date && { start_date }),
      ...(end_date && { end_date }),
      ...(request_message && { request_message }),
      ...(workshop_id && { workshop_data: workshopData._id }),
    };

    const updatedWorkshopRequest = await WorkshopRequest.findByIdAndUpdate(
      id,
      updateFields,
      { new: true }
    );

    if (!updatedWorkshopRequest) {
      return res.status(404).json({ message: "Workshop request not found" });
    }
    return res.status(200).json(updatedWorkshopRequest);
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "Failed to update workshop request", error });
  }
}

async function addTrainers(req, res, next) {
  try {
    const { trainerIds } = req.body;
    const { id } = req.params;

    const workshop = await WorkshopRequest.findById(id);
    if (!workshop) {
      return res.status(404).json({ message: "Workshop not found" });
    }
    const { start_date, end_date } = workshop;

    const activeTrainers = [];
    for (const trainerId of trainerIds) {
      const trainer = await Trainer.findById(trainerId);
      if (!trainer || !trainer.availability) continue;
      const isTrainerUnavailable = trainer.unavailableTimeslots.some(
        (timeslot) => {
          return checkTimeslotOverlap(
            start_date,
            end_date,
            timeslot.start,
            timeslot.end
          );
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

    const updatedWorkshop = await WorkshopRequest.findByIdAndUpdate(
      id,
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
          { $addToSet: { workshop_request: id } },
          { new: true }
        )
      )
    );

    await updateMultipleTrainersUnavailableTimeslots(req, res, next);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Failed to add trainers", error });
  }
}

async function approveRequest(req, res) {
  try {
    const { id } = req.params;

    const workshop = await WorkshopRequest.findOne({ _id: id });
    if (!workshop) {
      return res.status(404).json({ message: "Workshop not found" });
    }
    if (workshop.status === "approved") {
      return res.status(200).json({ message: "Workshop is already approved" });
    }

    workshop.status = "approved";
    workshop.reject_reason = "N/A";

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

    const workshop = await WorkshopRequest.findOne({ _id: id });
    if (!workshop) {
      return res.status(404).json({ message: "Workshop not found" });
    }
    if (workshop.status === "rejected") {
      return res.status(200).json({ message: "Workshop is already rejected" });
    }

    workshop.status = "rejected";
    workshop.reject_reason = rejectReason;

    await workshop.save();

    return res.status(200).json(workshop);
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "Failed to retrieve workshop", error });
  }
}

async function deleteWorkshopRequest(req, res, next) {
  try {
    const { id } = req.params;
    const workshopRequest = await WorkshopRequest.findOne({ _id: id });
    if (!workshopRequest) {
      return res.status(404).json({ message: "Workshop request not found" });
    }
    const workshop = await WorkshopData.findById(
      workshopRequest.workshop_data._id
    );
    await workshopRequest.deleteOne();
    /*
            const requestIndex = workshop.workshop_request.indexOf(id);
            if (requestIndex === -1) {
                throw new Error(`Request with ID ${id} not found in the workshop.`);
            }
            workshop.workshop_request.splice(requestIndex, 1);
            */
    await workshop.save();
    const client = await Client.findById(workshopRequest.client._id);
    const clientRequestIndex = client.workshop_request.indexOf(id);
    if (clientRequestIndex === -1) {
      throw new Error(`Request with ID ${id} not found in the client.`);
    }
    client.workshop_request.splice(clientRequestIndex, 1);
    await client.save();
    return res
      .status(200)
      .json({ message: "Workshop request deleted successfully" });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "Failed to delete workshop request", error });
  }
}

async function deleteAllWorkshopRequests(req, res, next) {
  try {
    const result = await WorkshopRequest.deleteMany({});
    if (result.deletedCount === 0) {
      return res
        .status(404)
        .json({ message: "No workshop requests found to delete" });
    }

    return res
      .status(200)
      .json({ message: "All workshop requests deleted successfully" });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "Failed to delete workshop requests", error });
  }
}

async function modifyAllocatedWorkshopsTrainers(req, res, next) {
  try {
    const { trainerIds } = req.body;
    const { id } = req.params;

    if (trainerIds.length === 0) {
      return res.status(400).json({ message: "No trainers provided" });
    }

    const workshop = await WorkshopRequest.findById(id);
    if (!workshop) {
      return res.status(404).json({ message: "Workshop not found" });
    }

    const workshop_start_date = new Date(workshop.start_date);
    const workshop_end_date = new Date(workshop.end_date);

    const allocatedTrainers = workshop.trainers.filter(
      (trainer) => !trainerIds.includes(trainer.toString())
    );

    await Promise.all(
      allocatedTrainers.map(async (trainerId) => {
        const trainer = await Trainer.findById(trainerId);
        if (!trainer) {
          return; // Do nothing, or handle this case separately
        }
        const workshopIndex = trainer.workshop_request.indexOf(id);
        if (workshopIndex !== -1) {
          trainer.workshop_request.splice(workshopIndex, 1);
        }
        const unavailableIndex = trainer.unavailableTimeslots.findIndex(
          (timeslot) =>
            timeslot.start.getTime() === workshop_start_date.getTime() &&
            timeslot.end.getTime() === workshop_end_date.getTime()
        );
        if (unavailableIndex !== -1) {
          trainer.unavailableTimeslots.splice(unavailableIndex, 1);
        }
        await trainer.save();

        const trainerIndex = workshop.trainers.indexOf(trainerId);
        if (trainerIndex !== -1) {
          workshop.trainers.splice(trainerIndex, 1);
        }
      })
    );
    await workshop.save();

    const activeTrainers = [];
    for (const trainerId of trainerIds) {
      const trainer = await Trainer.findById(trainerId);
      if (!trainer || !trainer.availability) continue;
      const isTrainerUnavailable = trainer.unavailableTimeslots.some(
        (timeslot) => {
          return checkTimeslotOverlap(
            workshop_start_date,
            workshop_end_date,
            timeslot.start,
            timeslot.end
          );
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

    const updatedWorkshop = await WorkshopRequest.findByIdAndUpdate(
      id,
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
          { $addToSet: { workshop_request: id } },
          { new: true }
        )
      )
    );

    await updateMultipleTrainersUnavailableTimeslots(req, res, next);

    return res.json(updatedWorkshop);
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Failed to modify trainers in the allocated workshops",
    });
  }
}

export default {
  getAllWorkshopRequests,
  getAllSubmittedWorkshops,
  getAllApprovedWorkshops,
  getNonSubmittedWorkshops,
  getWorkshopRequest,
  createWorkshopRequest,
  updatedWorkshopRequest,
  deleteWorkshopRequest,
  deleteAllWorkshopRequests,
  addTrainers,
  approveRequest,
  rejectRequest,
  modifyAllocatedWorkshopsTrainers,
};
