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

router.get("/verify", verifyLoggedIn, async(req, res) => {
    return res.json({ status: true, message: "Authorized", role: req.user.role });
});

router.get("/logout", UserController.logout);

router.patch(
    "/trainers/activate/:id",
    verifyAdmin,
    AdminController.adminActivateTrainer
);

router.patch(
    "/trainers/deactivate/:id",
    verifyAdmin,
    AdminController.adminDeactivateTrainer
);

router.get("/trainers/list", verifyAdmin, AdminController.getAllTrainers);

router.patch(
    "/trainers/update/:id",
    verifyAdmin,
    AdminController.adminUpdateTrainer
);

/* NEED TO IMPLEMENT DELETE!
router.delete(
    "/trainers/delete/:id",
    verifyAdmin,
    AdminController.admin
);

*/

router.post("/trainers", verifyAdmin, AdminController.adminCreateTrainer);

router.get(
  "/trainers/available",
  verifyAdmin,
  AdminController.getAllAvailableTrainers
);

export { router as UserRouter };