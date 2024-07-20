import { notification } from "../notif/model/notif.js";
import { WorkshopRequest } from "../workshop/models/WorkshopRequest.js";
import { Admin } from "../auth/models/Admin.js";
import { Client } from "../auth/models/Client.js";

const clientSendNotification = async (req, res, next) => {
  const client_id = req.client_id;
  const workshop_id = req.workshop_id;

  try {
    const admins = await Admin.find({ role: "admin" }).exec();
    const reqClient = await Client.findById(client_id);
    if (!reqClient) {
      return res.status(404).json({ message: "Client not found" });
    }

    const newNotification = new notification({
      client: reqClient._id,
      admin: admins.map((admin) => admin._id),
      workshop: workshop_id,
      message: "A new workshop request has been submitted",
    });

    await newNotification.save();
    console.log("notification object", newNotification);
  } catch (error) {
    console.error(error);
  }
};

const adminSendNotification = async (req, res, next) => {
  const workshop_id = req.workshop_id;

  try {
    const notificationDetails = await notification.find({
      workshop: workshop_id,
    });
    const workshopDetails = await WorkshopRequest.findById(workshop_id);
    if (!notificationDetails) {
      return res.status(404).json({ message: "Notification not found" });
    }
    if (workshopDetails.status === "approved") {
      notificationDetails.message = "Workshop request has been approved";
    }
    if (workshopDetails.status === "rejected") {
      notificationDetails.message = "Workshop request has been rejected";
    }

    await notificationDetails.save();
    console.log("notification updated", notificationDetails);
  } catch (error) {
    console.error(error);
  }
};

export { clientSendNotification, adminSendNotification };
