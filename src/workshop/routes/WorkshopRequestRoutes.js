import express from "express";
import WorkshopRequestController from "../controllers/WorkshopRequestController.js";
import verifyAdmin from "../../middlewares/verifyAdmin.js";
import { updateMultipleTrainersUnavailableTimeslots } from "../../middlewares/updateUnavailableTimeslots.js";

const router = express.Router();

router.delete(
  "/delete-all",
  WorkshopRequestController.deleteAllWorkshopRequests
); //For testing

router.get("/", WorkshopRequestController.getAllWorkshopRequests);
router.get(
  "/getSubmitted",
  verifyAdmin,
  WorkshopRequestController.getAllSubmittedWorkshops
);
router.get("/:id", WorkshopRequestController.getWorkshopRequest);
router.post("/", WorkshopRequestController.createWorkshopRequest);
router.patch(
  "/approve/:id",
  verifyAdmin,
  updateMultipleTrainersUnavailableTimeslots,
  WorkshopRequestController.addTrainers,
  WorkshopRequestController.approveRequest
);
router.patch(
  "/reject/:id",
  verifyAdmin,
  WorkshopRequestController.rejectRequest
);
router.patch("/:id", WorkshopRequestController.updatedWorkshopRequest);

router.delete("/:id", WorkshopRequestController.deleteWorkshopRequest);
export { router as WorkshopRequestRouter };
