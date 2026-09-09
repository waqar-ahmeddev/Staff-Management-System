import leavecontrollers from "../Controllers/LeaveControllers.js";
import express from "express";
import authMiddleware from "../middleware/authmiddleware.js";
import adminMiddleware from "../middleware/adminmiddleware.js";

const router = express.Router();
router.post("/apply", authMiddleware, leavecontrollers.applyLeave);
router.get("/my-leaves", authMiddleware, leavecontrollers.getMyLeaves);
router.get("/all-leaves", authMiddleware, adminMiddleware, leavecontrollers.getAllLeaves);
router.put("/update-status/:id", authMiddleware, adminMiddleware, leavecontrollers.updateLeaveStatus);
export default router;