import express from "express";
import WorkshopRequestController from "../controllers/WorkshopRequestController.js";
import verifyAdmin from "../../middlewares/verifyAdmin.js";
import { updateMultipleTrainersUnavailableTimeslots } from "../../middlewares/updateUnavailableTimeslots.js";

import {
  clientSendNotification,
  adminSendNotification,
} from "../../middlewares/notification.js";

const router = express.Router();

router.get("/", WorkshopRequestController.getAllWorkshopRequests);
router.get(
  "/getSubmitted",
  verifyAdmin,
  WorkshopRequestController.getAllSubmittedWorkshops
);
router.post(
  "/",
  WorkshopRequestController.createWorkshopRequest,
  clientSendNotification
);
router.patch("/:id", WorkshopRequestController.updatedWorkshopRequest);

router.patch(
  "/approve/:id",
  verifyAdmin,
  updateMultipleTrainersUnavailableTimeslots,
  WorkshopRequestController.addTrainers,
  WorkshopRequestController.approveRequest,
  adminSendNotification
);
router.patch(
  "/reject/:id",
  verifyAdmin,
  WorkshopRequestController.rejectRequest,
  adminSendNotification
);
router.delete("/:id", WorkshopRequestController.deleteWorkshopRequest);

export { router as WorkshopRequestRouter };
