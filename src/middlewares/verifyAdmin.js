import jwt from "jsonwebtoken";
import { Admin } from "../auth/models/Admin.js";

async function verifyAdmin(req, res, next) {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.json({ status: false, message: "Unauthorized" });
    }

    const decoded = jwt.verify(token, process.env.KEY);
    const verifiedAdmin = await Admin.findOne({
      username: decoded.username,
    }).exec();
    if (!verifiedAdmin) {
      return res.json({ status: false, message: "Unauthorized" });
    }

    if (verifiedAdmin.role !== "admin") {
      return res.json({ status: false, message: "Forbidden" });
    }

    req.user = {
      id: verifiedAdmin.id,
      role: verifiedAdmin.role,
    };
    next();
  } catch (err) {
    return res.json({ status: false, message: "Unauthorized" });
  }
}

export default verifyAdmin;
