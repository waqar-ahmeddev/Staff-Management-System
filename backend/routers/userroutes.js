import express from "express";

import {
  registerUser,
  loginUser,
  logoutUser,
} from "../Controllers/UserControllers.js";

import authMiddleware from "../middleware/authmiddleware.js";

const router = express.Router();

// ================= PUBLIC ROUTES =================

// Register
router.post("/register", registerUser);

// Login
router.post("/login", loginUser);

// ================= AUTHENTICATED ROUTES =================

// Logout
router.post("/logout", authMiddleware, logoutUser);

export default router;
