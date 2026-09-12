import express from "express";

// import {
//   registerUser,
//   loginUser,
//   logoutUser,
// } from "../Controllers/UserControllers.js";
import {
  registerUser,
  loginUser,
  logoutUser,
  getAllStaff,
} from "../Controllers/UserControllers.js";

import authMiddleware from "../middleware/authmiddleware.js";

const router = express.Router();

// ================= PUBLIC ROUTES =================

// Register
router.post("/register", registerUser);

// Login
router.post("/login", loginUser);
// Get all staff
router.get("/staff", authMiddleware, getAllStaff);
// ================= AUTHENTICATED ROUTES =================

// Logout
router.post("/logout", authMiddleware, logoutUser);

export default router;
