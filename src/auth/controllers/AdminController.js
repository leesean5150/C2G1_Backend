import bcrypt from "bcryptjs";

import { Admin } from "../models/Admin.js";
import { Trainer } from "../models/Trainer.js";

/**
 * getAllTrainers()
 * Input: None
 * Output: JSON trainers list
 * Description: return all trainer (as JSON) existing in db.
 */
async function getAllTrainers(req, res) {
    try {
        const trainers = await Trainer.find({ role: "trainer" }).exec();
        return res.json({ status: true, trainers });
    } catch (e) {
        console.log(e);
        return res.status(500).json({
            message: e,
        });
    }
}
/**
 * adminCreateTrainer
 * Input: json object for trainer by body (JSON body)
 * Output: None
 * Description: with provided JSON, query db to create a new trainer.
 */
async function adminCreateTrainer(req, res) {
    try {
        const {
            username,
            email,
            password,
            fullname,
            country,
            trainer_role,
            experience,
            gender
        } = req.body;

        const hashpassword = await bcrypt.hash(password, 10);

        const trainer = new Trainer({
            username: username,
            email: email,
            password: hashpassword,
            fullname: fullname,
            country: country,
            trainer_role: trainer_role,
            experience: experience,
            gender: gender
        });
        await trainer.save();

        return res.json({ status: true, message: "Trainer added successfully" });
    } catch (e) {
        console.log(e);
        return res.status(500).json({ message: e });
    }
}
/**
 * adminActivateTrainer()
 * Input: id_ by params (/get/:id)
 * Output: None
 * Description: with provided id parameter, find a certain trainer and update active status to true.
 */
async function adminActivateTrainer(req, res) {
    try {
        const { id } = req.params;
        const trainer = await Trainer.findOne({ _id: id }).exec();
        if (!trainer) {
            return res.status(404).json({ message: "Trainer not found" });
        }
        if (trainer.active === true) {
            return res.status(200).json({ message: "Trainer is already active" });
        }
        trainer.active = true;
        await trainer.save();
        return res.json({
            status: true,
            message: "Trainer activated successfully",
        });
    } catch (e) {
        console.log(e);
        return res.status(500).json({ message: e });
    }
}
/**
 * adminDeactivateTrainer()
 * Input: id_ by params (/get/:id)
 * Output: None
 * Description: with provided id parameter, find a certain trainer and update active status to false.
 */
async function adminDeactivateTrainer(req, res) {
    try {
        const { id } = req.params;
        const trainer = await Trainer.findOne({ _id: id }).exec();
        if (!trainer) {
            return res.status(404).json({ message: "Trainer not found" });
        }
        if (trainer.active === false) {
            return res
                .status(200)
                .json({ message: "Trainer is already deactivated" });
        }
        trainer.active = false;
        await trainer.save();
        return res.json({
            status: true,
            message: "Trainer successfully deactivated",
        });
    } catch (e) {
        console.log(e);
        return res.status(500).json({ message: e });
    }
}
/**
 * adminDeactivateTrainer()
 * Input: id_ by params (/get/:id) and json object for trainer by body (JSON body)
 * Output: None
 * Description: with provided id parameter, find a certain trainer and update the related fields.
 */
async function adminUpdateTrainer(req, res) {
    try {
        const { id } = req.params;
        const {
            username,
            email,
            fullname,
            country,
            trainer_role,
            experience,
            gender,
            workshops_completed_this_month,
            ongoing_workshops,
            workshops_completed_total,
            availability
        } = req.body;
        const trainer = await Trainer.findOne({ _id: id }).exec();
        if (!trainer) {
            return res.status(404).json({ message: "Trainer not found" });
        }
        if (username !== undefined) {
            trainer.username = username;
        }

        if (email !== undefined) {
            trainer.email = email;
        }

        if (fullname !== undefined) {
            trainer.fullname = fullname;
        }

        if (country !== undefined) {
            trainer.country = country;
        }

        if (trainer_role !== undefined) {
            trainer.trainer_role = trainer_role;
        }

        if (experience !== undefined) {
            trainer.experience = experience;
        }

        if (gender !== undefined) {
            trainer.gender = gender;
        }

        if (workshops_completed_this_month !== undefined) {
            trainer.workshops_completed_this_month = workshops_completed_this_month;
        }

        if (ongoing_workshops !== undefined) {
            trainer.ongoing_workshops = ongoing_workshops;
        }

        if (workshops_completed_total !== undefined) {
            trainer.workshops_completed_total = workshops_completed_total;
        }

        if (availability !== undefined) {
            trainer.availability = availability;
        }

        if (Object.keys(req.body).length === 0) {
            return res.status(400).json({ message: "No fields to update" });
        }
        await trainer.save();
        return res.json({ status: true, message: "Trainer updated successfully" });
    } catch (e) {
        console.log(e);
        return res.status(500).json({
            message: e,
        });
    }
}

export default {
    getAllTrainers,
    adminActivateTrainer,
    adminUpdateTrainer,
    adminDeactivateTrainer,
    adminCreateTrainer,
};