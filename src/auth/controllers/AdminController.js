import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

import { User } from "../models/User.js";

/*
async function verifyAdmin(req, res, next) {
    try {
        const token = req.cookies.token;
        if (!token) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        const decoded = jwt.verify(token, process.env.KEY);
        const user = await User.findOne({ username: decoded.username }).exec();
        if (user.role !== "admin") {
            return res.status(403).json({ message: "Forbidden" });
        }
        req.user = user;
        next();
    } catch (err) {
        return res.status(401).json({ status: false, message: "Unauthorized" });
    }
}
*/

async function getAllTrainers(req, res) {
    try {
        const trainers = await User.find({ role: "trainer" }).exec();
        return res.json({ status: true, trainers });
    } catch (e) {
        console.log(e);
        return res.status(500).json({
            message: e,
        });
    }
}

async function adminCreateTrainer(req, res) {
    try {
        const { username, email, password } = req.body;

        const hashpassword = await bcrypt.hash(password, 10);

        const trainer = new User({
            username: username,
            email: email,
            password: hashpassword,
            role: "trainer",
        });
        await trainer.save();

        return res.json({ status: true, message: "Trainer added successfully" });
    } catch (e) {
        console.log(e);
        return res.status(500).json({ message: e });
    }

}

async function adminActivateTrainer(req, res) {
    try {
        const { id } = req.params;
        const trainer = await User.findOne({ role: "trainer", _id: id }).exec();
        if (!trainer) {
            return res.status(404).json({ message: "Trainer not found" });
        }
        if (trainer.active === true) {
            return res.status(200).json({ message: "Trainer is already active" });
        }
        trainer.active = true;
        await trainer.save()
        return res.json({ status: true, message: "Trainer activated successfully" });
    } catch (e) {
        console.log(e);
        return res.status(500).json({ message: e });
    }
}

async function adminDeactivateTrainer(req, res) {
    try {
        const { id } = req.params;
        const trainer = await User.findOne({ role: "trainer", _id: id }).exec();
        if (!trainer) {
            return res.status(404).json({ message: "Trainer not found" });
        }
        if (trainer.active === false) {
            return res.status(200).json({ message: "Trainer is already deactivated" });
        }
        trainer.active = false;
        await trainer.save();
        return res.json({ status: true, message: "Trainer successfully deactivated" });

    } catch (e) {
        console.log(e);
        return res.status(500).json({ message: e });
    }
}

async function adminUpdateTrainer(req, res) {
    try {
        const { id } = req.params;
        const { username, email, password, active } = req.body;
        const trainer = await User.findOne({ role: "trainer", _id: id }).exec();
        if (!trainer) {
            return res.status(404).json({ message: "Trainer not found" });
        }
        if (active !== undefined) {
            trainer.active = active;
        }
        if (username !== undefined) {
            trainer.username = username;
        }
        if (email !== undefined) {
            trainer.email = email;
        }
        if (password !== undefined) {
            trainer.password = password;
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
    adminCreateTrainer
};