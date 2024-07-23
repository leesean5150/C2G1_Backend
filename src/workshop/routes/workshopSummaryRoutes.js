import express from "express";
import WorkshopSummaryController from "../controllers/WorkshopSummaryController.js";
import verifyAdmin from "../../middlewares/verifyAdmin.js";

const router = express.Router();

router.delete("/delete-all", WorkshopSummaryController.resetWorkshopSummary); //For testing

router.post("/create-default-workshop-summaries", WorkshopSummaryController.createWorkshopSummaries);
router.post("/", WorkshopSummaryController.createWorkshopSummary);
router.get("/", WorkshopSummaryController.getAllWorkshopSummary);
router.get("/get/:id", WorkshopSummaryController.getOneWorkshopSummary);
router.get("/search", WorkshopSummaryController.searchWorkshopSummary);
router.patch(
    "/add-workshop-request",
    verifyAdmin,
    WorkshopSummaryController.addWorkshopRequest
);
router.delete(
    "/:id",
    verifyAdmin,
    WorkshopSummaryController.deleteWorkshopSummary
);

export { router as WorkshopSummaryRouter };