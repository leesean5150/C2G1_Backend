import { Client } from "../models/Client.js";

async function getPendingWorkshops(req, res) {
  try {
    const client = await Client.findById(req.user.id)
      .populate("workshop_request")
      .exec();
    if (!client) {
      return res
        .status(404)
        .json({ status: false, message: "Trainer not found" });
    }

    return res.json({ client });
  } catch (error) {
    return res.status(500).json({ status: false, message: error.message });
  }
}

export default { getPendingWorkshops };
