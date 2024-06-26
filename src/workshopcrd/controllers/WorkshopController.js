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

async function getWorkshops(req, res, next) {
    try {
        const workshops = await Workshop.find();
        return res.status(200).json(workshops);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Failed to retrieve workshops', error });
    }
}

async function getWorkshopById(req, res, next) {
    try {
        const { workshopId } = req.body;
        const workshop = await Workshop.findOne({ workshopId });
        if (!workshop) {
            return res.status(404).json({ message: 'Workshop not found' });
        }
        return res.status(200).json(workshop);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Failed to retrieve workshop', error });
    }
}

async function deleteWorkshop(req, res, next) {
    try {
        const { workshopId } = req.body;
        const deletedWorkshop = await Workshop.findOneAndDelete({ workshopId });
        if (!deletedWorkshop) {
            return res.status(404).json({ message: 'Workshop not found' });
        }
        return res.status(204).send();
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Failed to delete workshop', error });
    }
}

export default {
    createWorkshop: createWorkshop,
    getWorkshops: getWorkshops,
    getWorkshopById: getWorkshopById,
    deleteWorkshop: deleteWorkshop
};