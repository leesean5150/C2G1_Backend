import express from "express";
import notifController from "../controllers/notifController";

const router = express.Router();

router.post(
  "/adminReadNotification/:id",
  notifController.adminReadNotification
);
router.post(
  "/clientReadNotification/:id",
  notifController.clientReadNotification
);

router.get(
  "/getAllClientNotification",
  notifController.getAllClientUnreadNotifications
);
router.get(
  "/getAllAdminNotification",
  notifController.getAllAdminUnreadNotifications
);

export { router as notifRouter };
