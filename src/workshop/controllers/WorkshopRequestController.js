import { Client } from "../../auth/models/Client.js";
import { Trainer } from "../../auth/models/Trainer.js";
import { updateMultipleTrainersUnavailableTimeslots } from "../../middlewares/updateUnavailableTimeslots.js";
import { WorkshopData } from "../models/WorkshopData.js";
import { WorkshopRequest } from "../models/WorkshopRequest.js";

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
        const workshops = await WorkshopRequest.find({ status: "submitted" }).populate("workshop_data");
        return res.status(200).json(workshops);
    } catch (error) {
        console.log(error);
        return res
            .status(500)
            .json({ message: "Failed to retrieve workshops", error });
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

        return res
            .status(201)
            .json({ message: "Workshop request created successfully", workshopRequest: savedWorkshopRequest });
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
            updateFields, { new: true }
        );

        if (!updatedWorkshopRequest) {
            return res.status(404).json({ message: "Workshop request not found" });
        }

        console.log("Updated WorkshopRequest:", updatedWorkshopRequest);

        return res
            .status(200)
            .json(updatedWorkshopRequest);
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
            const trainer = await Trainer.findById({ _id: trainerId });
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

        const updatedWorkshop = await WorkshopRequest.findByIdAndUpdate(
            id, { $addToSet: { trainers: { $each: activeTrainers } } }, { new: true }
        );

        if (!updatedWorkshop) {
            return res.status(404).json({ message: "Workshop not found" });
        }

        await Promise.all(
            activeTrainers.map((trainerId) =>
                Trainer.findByIdAndUpdate(
                    trainerId, { $addToSet: { workshops: id } }, { new: true }
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
        const workshopRequest = await WorkshopRequest.findById(id);
        if (!workshopRequest) {
            return res.status(404).json({ message: "Workshop request not found" });
        }
        const workshop = await WorkshopData.findById(
            workshopRequest.workshop_data._id
        );
        await workshopRequest.deleteOne();
        const requestIndex = workshop.workshop_request.indexOf(id);
        if (requestIndex === -1) {
            throw new Error(`Request with ID ${id} not found in the workshop.`);
        }
        workshop.workshop_request.splice(requestIndex, 1);
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
            return res.status(404).json({ message: "No workshop requests found to delete" });
        }

        return res.status(200).json({ message: "All workshop requests deleted successfully" });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Failed to delete workshop requests", error });
    }
}


export default {
    getAllWorkshopRequests,
    getAllSubmittedWorkshops,
    createWorkshopRequest,
    updatedWorkshopRequest,
    deleteWorkshopRequest,
    deleteAllWorkshopRequests,
    addTrainers,
    approveRequest,
    rejectRequest,
};