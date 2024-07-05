import jwt from "jsonwebtoken";
import { Client } from "../auth/models/Client.js";

async function verifyClient(req, res, next) {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.json({ status: false, message: "Unauthorized" });
    }

    const decoded = jwt.verify(token, process.env.KEY);
    const verifiedClient = await Client.findOne({
      username: decoded.username,
    }).exec();
    if (!verifiedClient) {
      return res.json({ status: false, message: "Unauthorized" });
    }

    if (verifiedClient.role !== "client") {
      return res.json({ status: false, message: "Forbidden" });
    }

    req.user = {
      id: verifiedClient.id,
      role: verifiedClient.role,
    };
    next();
  } catch (err) {
    return res.json({ status: false, message: "Unauthorized" });
  }
}

export default verifyClient;
