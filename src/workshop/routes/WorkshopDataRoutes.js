import express from "express";
import verifyAdmin from "../../middlewares/verifyAdmin.js";
import WorkshopDataController from "../controllers/WorkshopDataController.js";

const router = express.Router();

router.get("/", WorkshopDataController.getAllWorkshopDatas);
router.get("/:id", verifyAdmin, WorkshopDataController.getSingleWorkshopData);
router.post("/", verifyAdmin, WorkshopDataController.createWorkshopData);
router.patch("/:id", verifyAdmin, WorkshopDataController.updateWorkshopData);
router.delete("/:id", verifyAdmin, WorkshopDataController.deleteWorkshopData);

export { router as WorkshopDataRouter };
