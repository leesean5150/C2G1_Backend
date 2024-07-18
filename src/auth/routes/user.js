import express from "express";

import UserController from "../controllers/UserController.js";
import AdminController from "../controllers/AdminController.js";

import verifyAdmin from "../../middlewares/verifyAdmin.js";
import verifyLoggedIn from "../../middlewares/verifyLoggedIn.js";

const router = express.Router();

router.post("/signup", UserController.signup);
router.post("/login/:loginType", UserController.login);
router.post("/forgot-password", UserController.forgotpassword);
router.post("/reset-password/:token", UserController.resetpassword);

router.get("/verify", verifyLoggedIn, async (req, res) => {
  return res.json({
    status: true,
    message: "Authorized",
    role: req.user.role,
    id: req.user.id,
  });
});
router.get("/logout", UserController.logout);
router.patch(
  "/trainers/Activate/:id",
  verifyAdmin,
  AdminController.adminActivateTrainer
);
router.patch(
  "/trainers/Deactivate/:id",
  verifyAdmin,
  AdminController.adminDeactivateTrainer
);
router.delete(
  "/trainers/delete/:id",
  verifyAdmin,
  AdminController.adminDeleteTrainer
);
router.get("/trainers/list", verifyAdmin, AdminController.getAllTrainers);
router.patch(
  "/trainers/update/:id",
  verifyAdmin,
  AdminController.adminUpdateTrainer
);

router.post("/trainers", verifyAdmin, AdminController.adminCreateTrainer);

router.get(
  "/trainers/available",
  verifyAdmin,
  AdminController.getAllAvailableTrainers
);

export { router as UserRouter };
