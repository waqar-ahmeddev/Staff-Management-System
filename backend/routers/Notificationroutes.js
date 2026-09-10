import express from "express";
import {
  createNotice,
  getAllNotices,
  getMyDepartmentNotices,
  deleteNotice,
} from "../Controllers/NotificationBoardControllers.js";

import authmiddleware from "../middleware/authmiddleware.js";
import adminmiddleware from "../middleware/adminmiddleware.js";

const router = express.Router();

// 1. All Logged-in Users (Admin & Staff) can view all notices
router.get("/", authmiddleware, getAllNotices);

// 2. Staff specific filtered notices (Department based)
router.get("/my-department", authmiddleware, getMyDepartmentNotices);

// 3. Admin Only: Create new notice
router.post("/", authmiddleware, adminmiddleware, createNotice);

// 4. Admin Only: Delete notice by ID
router.delete("/:id", authmiddleware, adminmiddleware, deleteNotice);

export default router;
