import jwt from "jsonwebtoken";
import { Trainer } from "../auth/models/Trainer.js";

async function verifyTrainer(req, res, next) {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.json({ status: false, message: "Unauthorized" });
    }

    const decoded = jwt.verify(token, process.env.KEY);
    const verifiedTrainer = await Trainer.findOne({
      username: decoded.username,
    }).exec();
    if (!verifiedTrainer) {
      return res.json({ status: false, message: "Unauthorized" });
    }

    if (verifiedTrainer.role !== "trainer") {
      return res.json({ status: false, message: "Forbidden" });
    }

    req.user = {
      id: verifiedTrainer.id,
      role: verifiedTrainer.role,
    };
    next();
  } catch (err) {
    return res.json({ status: false, message: "Unauthorized" });
  }
}

export default verifyTrainer;
