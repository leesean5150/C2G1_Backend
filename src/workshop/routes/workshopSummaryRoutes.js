import express from "express";
import WorkshopSummaryController from "../controllers/WorkshopSummaryController.js";
import verifyAdmin from "../../middlewares/verifyAdmin.js";

const router = express.Router();

router.post("/create-default-workshop-summaries", WorkshopSummaryController.createWorkshopSummaries); //Added!
router.delete("/delete-all", WorkshopSummaryController.resetWorkshopSummary); //Added!
router.post("/", WorkshopSummaryController.createWorkshopSummary);
router.get("/", WorkshopSummaryController.getAllWorkshopSummary);
router.get("/get/:id", WorkshopSummaryController.getOneWorkshopSummary);
router.get("/search", WorkshopSummaryController.searchWorkshopSummary);
router.patch(
    "/add-workshop",
    verifyAdmin,
    WorkshopSummaryController.addWorkshop
);
router.delete(
    "/del/:id",
    verifyAdmin,
    WorkshopSummaryController.deleteWorkshopSummary
);

export { router as WorkshopSummaryRouter };