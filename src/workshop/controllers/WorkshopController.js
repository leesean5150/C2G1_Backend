import { Workshop } from '../models/Workshop.js';

async function createWorkshop(req, res, next) {
    try {
        const { workshopId, trainer, startDate, endDate, availability, description } = req.body;
        const newWorkshop = new Workshop({ workshopId, trainer, startDate, endDate, availability, description });
        const savedWorkshop = await newWorkshop.save();
        return res.status(201).json(savedWorkshop);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Failed to create workshop', error });
    }
}

async function getAllWorkshops(req, res, next) {
    try {
        const workshops = await Workshop.find();
        return res.status(200).json(workshops);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Failed to retrieve workshops', error });
    }
}

async function getWorkshop(req, res) {
    try {
        const { attributeName, attributeContent } = req.body;
        const filter = {};
        filter[attributeName] = attributeContent;

        const workshop = await Workshop.findOne(filter);
        if (!workshop) {
            return res.status(404).json({ message: 'Workshop not found' });
        }
        return res.status(200).json(workshop);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Failed to retrieve workshop', error });
    }
}

async function deleteWorkshop(req, res) {
    try {
        const { attributeName, attributeContent } = req.body;
        const filter = {};
        filter[attributeName] = attributeContent;

        const workshop = await Workshop.findOneAndDelete(filter);
        if (!workshop) {
            return res.status(404).json({ message: 'Workshop not found' });
        }
        return res.status(204).send();
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Failed to delete workshop', error });
    }
}

async function searchByAttribute(req, res) {
    try {
        const { attributeName, attributeContent } = req.body;
        const filter = {};
        filter[attributeName] = attributeContent;

        const workshop = await Workshop.findOne(filter);
        if (!workshop) {
            return res.status(404).json({ message: 'No workshop found with the given attribute' });
        }
        return res.status(200).json({ id: workshop._id });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Failed to search workshop', error });
    }
}

export default {
    createWorkshop: createWorkshop,
    getAllWorkshops: getAllWorkshops,
    getWorkshop: getWorkshop,
    deleteWorkshop: deleteWorkshop,
    searchByAttribute: searchByAttribute
};