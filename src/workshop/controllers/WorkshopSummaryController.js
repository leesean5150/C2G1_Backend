import { WorkshopSummary } from "../models/WorkshopSummary.js";
import { Workshop } from "../models/Workshop.js";
import {get } from "mongoose";

/**
 * createWorkshopSummary()
 * Input: json object for workshop summary by body (JSON body)
 * Output: None
 * Description: with provided JSON, query db to create a new workshop request.
 */
async function createWorkshopSummary(req, res, next) {
    try {
        const { year, month, actual_attendance, expected_attendance } =
        req.body;
        const newWorkshopSummary = new WorkshopSummary({
            year,
            month,
            actual_attendance,
            expected_attendance
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
 * Output: workshops (json)
 * Description: return all workshop requests (as JSON) existing in db.
 */
async function getAllWorkshopSummary(req, res, next) {
    try {
        const workshopSummary = await WorkshopSummary.find();
        return res.status(200).json(workshopSummary);
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

/**
 * searchWorkshops()
 * Input: json object including {attributeName, attributeContent} by body (JSON body)
 * Output: the workshops (json)
 * Description: with provided info, find workshops that matches to the filter from the database and return them.
 */
async function searchWorkshopSummary(req, res) {
    try {
        const { attributeName, attributeContent } = req.body;
        const filter = {};
        filter[attributeName] = attributeContent;

        const workshopSummary = await WorkshopSummary.find(filter);
        if (workshopSummary.length === 0) {
            return res
                .status(404)
                .json({ message: "No workshop summary found with the given attribute" });
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
async function addWorkshop(req, res) {
    try {
        const { workshopId, workshopSummaryId } = req.body;

        // Fetch the Trainer document to check if the trainer is active
        const workshop = await Workshop.findById(workshopId);
        if (!workshop) {
            return res.status(404).json({ message: "workshop not found" });
        }

        // Check if the trainer is active
        if (!workshop.availability) {
            return res.status(400).json({ message: "workshop not approved" });
        }

        // Update the Workshop document to include the trainerId in its trainers array
        const updatedWorkshopSummary = await WorkshopSummary.findByIdAndUpdate(
            workshopSummaryId, { $addToSet: { workshops: workshopId } }, // Use $addToSet to avoid duplicates
            { new: true }
        );

        if (!updatedWorkshopSummary) {
            return res.status(404).json({ message: "Workshop summary not found" });
        }

        // Optionally, send back the updated documents or a success message
        return res.status(200).json({
            message: "Successfully added workshop to workshop summary",
            updatedWorkshopSummary
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Failed to add workshop", error });
    }
}

export default {
    createWorkshopSummary: createWorkshopSummary,
    getAllWorkshopSummary: getAllWorkshopSummary,
    getOneWorkshopSummary: getOneWorkshopSummary,
    deleteWorkshopSummary: deleteWorkshopSummary,
    searchWorkshopSummary: searchWorkshopSummary,
    addWorkshop: addWorkshop
};