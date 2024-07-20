import { notification } from "../model/notif";
import { Workshop } from "../../workshop/models/Workshop";
import { Admin } from "../../auth/models/Admin";
import { Client } from "../../auth/models/Client";

const adminReadNotification = async (req, res, next) => {
  const { id } = req.params;

  try {
    const notif = await notification.findById(id);
    if (!notif) {
      return res.status(404).json({ message: "Notification not found" });
    }

    notif.is_read_by_admin = true;
    notif.time_read_by_admin = new Date();
    await notif.save();

    return res.status(200).json(notif);
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Failed to update notification", error });
  }
};

const clientReadNotification = async (req, res, next) => {
  const { id } = req.params;

  try {
    const notif = await notification.findById(id);
    if (!notif) {
      return res.status(404).json({ message: "Notification not found" });
    }

    notif.is_read_by_client = true;
    notif.time_read_by_client = new Date();
    await notif.save();

    return res.status(200).json(notif);
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Failed to update notification", error });
  }
};

async function getAllClientUnreadNotifications(req, res, next) {
  try {
    const notifications = await notification.find({
      is_read_by_client: false,
      is_read_by_admin: true,
    });
    res.status(200).json(notifications);
    next();
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: "Failed to retrieve notifications", error });
  }
}

async function getAllAdminUnreadNotifications(req, res, next) {
  try {
    const notifications = await notification.find({ is_read_by_admin: false });
    res.status(200).json(notifications);
    next();
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: "Failed to retrieve notifications", error });
  }
}

export default {
  adminReadNotification: adminReadNotification,
  clientReadNotification: clientReadNotification,
  getAllClientUnreadNotifications: getAllClientUnreadNotifications,
  getAllAdminUnreadNotifications: getAllAdminUnreadNotifications,
};
