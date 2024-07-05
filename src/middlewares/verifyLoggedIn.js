import jwt from "jsonwebtoken";

import { Admin } from "../auth/models/Admin.js";
import { Trainer } from "../auth/models/Trainer.js";
import { Client } from "../auth/models/Client.js";

async function verifyLoggedIn(req, res, next) {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({ status: false, message: "Unauthorized" });
    }

    const decoded = jwt.verify(token, process.env.KEY);
    const models = [Admin, Trainer, Client];
    let verifiedAccount = null;
    for (const model of models) {
      verifiedAccount = await model
        .findOne({
          username: decoded.username,
        })
        .exec();
      if (verifiedAccount) break;
    }
    if (!verifiedAccount) {
      return res.status(401).json({ status: false, message: "Unauthorized" });
    }

    req.user = {
      id: verifiedAccount.id,
      username: verifiedAccount.username,
      role: verifiedAccount.role,
    };
    next();
  } catch (err) {
    return res.status(401).json({ status: false, message: "Unauthorized" });
  }
}

export default verifyLoggedIn;
