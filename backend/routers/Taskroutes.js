import express from "express";
import {
  createTask,
  getAllTasks,
  getMyTasks,
  updateTaskStatus,
  deleteTask,
} from "../Controllers/TaskControllers.js"; // Path apne folder structure ke mutabiq adjust karein
import authmiddleware from "../middleware/authmiddleware.js";
import adminmiddleware from "../middleware/adminmiddleware.js"; // Apne auth middlewares import karein

const router = express.Router();

// 1. Admin Only: Naya Task Assign karna
router.post("/", authmiddleware, adminmiddleware, createTask);

// 2. Admin Only: Company ke Saare Tasks dekhna
router.get("/", authmiddleware, adminmiddleware, getAllTasks);

// 3. Staff Member: Apne Assigned Tasks dekhna
router.get("/my-tasks", authmiddleware, getMyTasks);

// 4. Staff / Admin: Task ka Status Update karna
router.put("/:taskId/status", authmiddleware, updateTaskStatus);

// 5. Admin Only: Task Delete karna
router.delete("/:taskId", authmiddleware, adminmiddleware, deleteTask);

export default router;
