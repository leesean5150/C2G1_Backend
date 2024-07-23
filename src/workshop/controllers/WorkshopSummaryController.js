import { WorkshopSummary } from "../models/WorkshopSummary.js";
import { WorkshopRequest } from "../models/WorkshopRequest.js";
import { Workshop } from "../models/Workshop.js";
import {get } from "mongoose";

/**
 * createWorkshopSummaries()
 * Input: None
 * Output: None
 * Description: This function creates default WorkshopSummary objects for the specified years and months, 
 * saves them to the database, and returns the created objects.
 */
const months = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
];
const years = [2021, 2022, 2023, 2024, 2025];

async function createWorkshopSummaries(req, res, next) {
    try {
        const summaries = [];

        for (const year of years) {
            for (const month of months) {
                const newWorkshopSummary = new WorkshopSummary({
                    year: year,
                    month: month,
                    actual_attendance: 0,
                    expected_attendance: 0,
                    workshopRequests: []
                });
                summaries.push(newWorkshopSummary.save());
            }
        }

        const savedSummaries = await Promise.all(summaries);

        return res.status(201).json({ message: "Workshop summaries created successfully", data: savedSummaries });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Failed to create workshop summaries", error });
    }
}

/**
 * createWorkshopSummary()
 * Input: json object for workshop summary by body (JSON body)
 * Output: None
 * Description: with provided JSON, query db to create a new workshop request.
 */
async function createWorkshopSummary(req, res, next) {
    try {
        const { year, month, actual_attendance, expected_attendance } = req.body;
        const newWorkshopSummary = new WorkshopSummary({
            year,
            month,
            actual_attendance,
            expected_attendance,
        });
        const savedWorkshopSummary = await newWorkshopSummary.save();
        return res.status(201).json(savedWorkshopSummary);
    } catch (error) {
        console.log(error);
        return res
            .status(500)
            .json({ message: "Failed to create workshopSummary", error });
    }
}

/**
 * getAllWorkshops()
 * Input: None
 * Output: workshopRequests (json)
 * Description: return all workshop requests (as JSON) existing in db.
 */
async function getAllWorkshopSummary(req, res, next) {
    try {
        const workshopSummaries = await WorkshopSummary.find();
        return res.status(200).json(workshopSummaries);
    } catch (error) {
        console.log(error);
        return res
            .status(500)
            .json({ message: "Failed to retrieve workshop summary data", error });
    }
}

/**
 * getOneWorkshop()
 * Input: id_ by params (/get/:id)
 * Output: the workshop (json)
 * Description: with provided id parameter, find a certain workshop from the database and returns it.
 */

async function getOneWorkshopSummary(req, res) {
    try {
        const { id } = req.params;

        const workshopSummary = await WorkshopSummary.findOne({ _id: id });
        if (!workshopSummary) {
            return res.status(404).json({ message: "Workshop summary not found" });
        }
        return res.status(200).json(workshopSummary);
    } catch (error) {
        console.log(error);
        return res
            .status(500)
            .json({ message: "Failed to retrieve workshop summary", error });
    }
}

/**
 * deleteWorkshop()
 * Input: id_ by params (/get/:id)
 * Output: None
 * Description: with provided id parameter, find a certain workshop from the database and delete it.
 */
async function deleteWorkshopSummary(req, res) {
    try {
        const { id } = req.params;

        const workshopSummary = await WorkshopSummary.findOneAndDelete({ _id: id });
        if (!workshopSummary) {
            return res.status(404).json({ message: "Workshop Summary not found" });
        }
        return res.status(204).send();
    } catch (error) {
        console.log(error);
        return res
            .status(500)
            .json({ message: "Failed to delete workshop summary", error });
    }
}

async function resetWorkshopSummary(req, res) {
    try {
        const result = await WorkshopSummary.deleteMany({});
        if (result.deletedCount === 0) {
            return res.status(404).json({ message: "No Workshop Summaries found to delete" });
        }
        return res.status(204).send();
    } catch (error) {
        console.error('Error deleting all WorkshopSummary documents:', error);
        return res
            .status(500)
            .json({ message: "Failed to delete all workshop summaries", error });
    }
}

/**
 * searchWorkshops()
 * Input: json object including {attributeName, attributeContent} by body (JSON body)
 * Output: the workshopRequests (json)
 * Description: with provided info, find workshopRequests that matches to the filter from the database and return them.
 */
async function searchWorkshopSummary(req, res) {
    try {
        const { attributeName, attributeContent } = req.body;
        const filter = {};
        filter[attributeName] = attributeContent;

        const workshopSummary = await WorkshopSummary.find(filter);
        if (workshopSummary.length === 0) {
            return res.status(404).json({
                message: "No workshop summary found with the given attribute",
            });
        }
        return res.status(200).json(workshopSummary);
    } catch (error) {
        console.log(error);
        return res
            .status(500)
            .json({ message: "Failed to search workshop summary", error });
    }
}

/**
 * addTrainer()
 * Input: _id of trainer and workshop object
 * Output: None
 * Description: Updates both the trainer and workshop documents to establish a two-way link between them.
 */
async function addWorkshopRequest(req, res) {
    try {
        const { workshopRequestId, workshopSummaryId } = req.body;

        // Fetch the Trainer document to check if the trainer is active
        const workshopRequest = await WorkshopRequest.findById(workshopRequestId);
        if (!workshopRequest) {
            return res.status(404).json({ message: "workshop request not found" });
        }

        // Check if the workshop request is approved
        if (workshopRequest.status !== "approved") {
            return res.status(400).json({ message: "workshop not approved" });
        }

        const updatedWorkshopSummary = await WorkshopSummary.findByIdAndUpdate(
            workshopSummaryId, { $addToSet: { workshopRequests: workshopRequestId } }, // Use $addToSet to avoid duplicates
            { new: true }
        );

        if (!updatedWorkshopSummary) {
            return res.status(404).json({ message: "Workshop summary not found" });
        }

        // Optionally, send back the updated documents or a success message
        return res.status(200).json({
            message: "Successfully added workshop to workshop summary",
            updatedWorkshopSummary: updatedWorkshopSummary,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Failed to add workshop", error });
    }
}

export default {
    createWorkshopSummaries: createWorkshopSummaries,
    createWorkshopSummary: createWorkshopSummary,
    getAllWorkshopSummary: getAllWorkshopSummary,
    getOneWorkshopSummary: getOneWorkshopSummary,
    deleteWorkshopSummary: deleteWorkshopSummary,
    searchWorkshopSummary: searchWorkshopSummary,
    resetWorkshopSummary: resetWorkshopSummary,
    addWorkshopRequest: addWorkshopRequest,
};