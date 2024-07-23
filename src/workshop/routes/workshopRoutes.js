import express from "express";
import WorkshopController from "../controllers/WorkshopController.js";
import verifyAdmin from "../../middlewares/verifyAdmin.js";
import {
    updateMultipleTrainersUnavailableTimeslots,
    updateMultipleTrainersUnavailableTimeslotsTerminal,
} from "../../middlewares/updateUnavailableTimeslots.js";

const router = express.Router();

router.delete("/delete-all", WorkshopController.deleteAllWorkshops); //For testing

router.post("/", WorkshopController.createWorkshop);
router.get("/", WorkshopController.getAllWorkshops);
router.get("/get/:id", WorkshopController.getOneWorkshop);
router.get("/search", WorkshopController.searchWorkshops);
router.get(
    "/getRequest",
    verifyAdmin,
    WorkshopController.getAllSubmittedWorkshops
);
router.patch(
    "/add-trainer",
    verifyAdmin,
    WorkshopController.addTrainers,
    updateMultipleTrainersUnavailableTimeslotsTerminal
); // Should not be in use. Use /approve/:id instead.
router.patch(
    "/approve/:id",
    verifyAdmin,
    updateMultipleTrainersUnavailableTimeslots,
    WorkshopController.addTrainers,
    WorkshopController.approveRequest
);
router.patch("/reject/:id", verifyAdmin, WorkshopController.rejectRequest);
router.delete("/:id", verifyAdmin, WorkshopController.deleteWorkshop);


export { router as WorkshopRouter };