import express from "express";
import AdminController from "../Controllers/AdminControllers.js";
import authMiddleware from "../middleware/authMiddleware.js";
import adminMiddleware from "../middleware/adminMiddleware.js";
const router = express.Router();

router.get("/all-staff", authMiddleware, adminMiddleware, AdminController.getAllStaff);
router.get("/staff/:id", authMiddleware, adminMiddleware, AdminController.getStaffById);
router.post("/add-staff", authMiddleware, adminMiddleware, AdminController.addStaff);
router.put("/staff/:id", authMiddleware, adminMiddleware, AdminController.updateStaff);
router.delete("/staff/:id", authMiddleware, adminMiddleware, AdminController.deleteStaff);
export default router;