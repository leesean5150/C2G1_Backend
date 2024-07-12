import express from "express";
import WorkshopController from "../controllers/WorkshopController.js";
import verifyAdmin from "../../middlewares/verifyAdmin.js";
import {
  updateMultipleTrainersUnavailableTimeslots,
  updateMultipleTrainersUnavailableTimeslotsTerminal,
} from "../../middlewares/updateUnavailableTimeslots.js";

const router = express.Router();

router.post("/", WorkshopController.createWorkshop);
router.get("/", WorkshopController.getAllWorkshops);
router.get("/get/:id", WorkshopController.getOneWorkshop);
router.get("/search", WorkshopController.searchWorkshops);
router.patch(
  "/add-trainer",
  verifyAdmin,
  WorkshopController.addTrainers,
  updateMultipleTrainersUnavailableTimeslotsTerminal
);
router.patch("/approve/:id", verifyAdmin, WorkshopController.approveRequest);
router.patch("/reject/:id", verifyAdmin, WorkshopController.rejectRequest);
router.delete("/del/:id", verifyAdmin, WorkshopController.deleteWorkshop);

export { router as WorkshopRouter };
