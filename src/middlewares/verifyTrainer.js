import jwt from "jsonwebtoken";
import { User } from "../auth/models/User.js";

async function verifyTrainer(req, res, next) {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.json({ status: false, message: "Unauthorized" });
    }

    const decoded = jwt.verify(token, process.env.KEY);
    const verifiedUser = await User.findOne({
      username: decoded.username,
    }).exec();
    if (!verifiedUser) {
      return res.json({ status: false, message: "Unauthorized" });
    }

    if (verifiedUser.role !== "trainer") {
      return res.json({ status: false, message: "Forbidden" });
    }

    req.user = {
      id: verifiedUser.id,
      role: verifiedUser.role,
    };
    next();
  } catch (err) {
    return res.json({ status: false, message: "Unauthorized" });
  }
}

export default verifyTrainer;
