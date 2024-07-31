import { Client } from "../models/Client.js";

async function getPendingWorkshops(req, res) {
  try {
    const client = await Client.findById(req.user.id)
      .sort({ updatedAt: -1 })
      .populate("workshop_request")
      .exec();
    if (!client) {
      return res
        .status(404)
        .json({ status: false, message: "Trainer not found" });
    }

    const workshop_requests = client.workshop_request;
    return res.json({ workshop_requests });
  } catch (error) {
    return res.status(500).json({ status: false, message: error.message });
  }
}

export default { getPendingWorkshops };
