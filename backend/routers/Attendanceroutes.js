import attendanceController from "../Controllers/AttendanceControllers.js";
import express from "express";
import authmiddleware from "../middleware/authmiddleware.js";
import authAdmin from "../middleware/adminmiddleware.js";

const router = express.Router();    
router.post("/mark", authmiddleware, attendanceController.markAttendance);
router.get("/myattendance", authmiddleware, attendanceController.getMyAttendance);
router.get("/all", authmiddleware, authAdmin, attendanceController.getAllAttendance);
router.get("/:id", authmiddleware,authAdmin, attendanceController.getAttendanceById);
router.put("/:id", authmiddleware,authAdmin, attendanceController.updateAttendance);
export default router;