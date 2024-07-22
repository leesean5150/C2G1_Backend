import { WorkshopData } from "../models/WorkshopData.js";

async function getAllWorkshopDatas(req, res, next) {
  try {
    const workshops = await WorkshopData.find();
    return res.json(workshops);
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "Failed to retrieve workshops", error });
  }
}

async function getAvailableWorkshopDatas(req, res, next) {
  try {
    const workshops = await WorkshopData.find({ availability: "Available" });
    return res.json(workshops);
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "Failed to retrieve workshops", error });
  }
}

async function getSingleWorkshopData(req, res, next) {
  try {
    const workshopId = req.params.id;
    const workshop = await WorkshopData.findById(workshopId);
    return res.json(workshop);
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "Failed to create workshop", error });
  }
}

async function createWorkshopData(req, res, next) {
  try {
    const { workshop_ID, workshop_name, workshop_type, workshop_details } =
      req.body;

    const newWorkshopData = new WorkshopData({
      workshop_ID,
      workshop_name,
      workshop_type,
      workshop_details,
    });
    const savedWorkshopData = await newWorkshopData.save();

    return res.status(201).json({ message: "Workshop created successfully" });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "Failed to create workshop", error });
  }
}

async function updateWorkshopData(req, res, next) {
  try {
    const { id } = req.params;
    const {
      workshop_ID,
      workshop_name,
      workshop_type,
      workshop_details,
      availability,
    } = req.body;

    const workshopData = await WorkshopData.findOne({ _id: id });
    if (!workshopData) {
      return res.status(404).json({ message: "Workshop not found" });
    }

    if (workshop_ID) {
      workshopData.workshop_ID = workshop_ID;
    }
    if (workshop_name) {
      workshopData.workshop_name = workshop_name;
    }
    if (workshop_type) {
      workshopData.workshop_type = workshop_type;
    }
    if (workshop_details) {
      workshopData.workshop_details = workshop_details;
    }
    if (availability) {
      workshopData.availability = availability;
    }

    await workshopData.save();

    return res.status(200).json({ message: "Workshop updated successfully" });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "Failed to update workshop", error });
  }
}

async function deleteWorkshopData(req, res, next) {
  try {
    const { id } = req.params;

    const workshopData = await WorkshopData.findOneAndDelete({ _id: id });
    if (!workshopData) {
      return res.status(404).json({ message: "Workshop not found" });
    }

    return res.status(200).json({ message: "Workshop deleted successfully" });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "Failed to delete workshop", error });
  }
}

export default {
  getAllWorkshopDatas,
  getAvailableWorkshopDatas,
  getSingleWorkshopData,
  createWorkshopData,
  updateWorkshopData,
  deleteWorkshopData,
};
