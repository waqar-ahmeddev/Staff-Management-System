import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import ConnectDb from "./utils/db.js";

// Routes Import
import userRoutes from "./routers/userroutes.js";
import AdminRoutes from "./routers/Adminroutes.js";
import AttendanceRoutes from "./routers/Attendanceroutes.js";
import LeaveRoutes from "./routers/leaveroutes.js";
import NotificationRoutes from "./routers/Notificationroutes.js";
import TaskRoutes from "./routers/Taskroutes.js";
import AutomatedPayrollRoutes from "./routers/Automatedroutes.js";

dotenv.config();

// Connect Database
ConnectDb();

const port = process.env.PORT || 5000;
const app = express();

// 1. CORS Setup (Yeh har Route aur Body Parser se PEHLE aana zaroori hai)
app.use(
  cors({
    origin: [
      process.env.CLIENT_URL,
      "http://localhost:5173",
      "http://localhost:3000",
    ].filter(Boolean), // Vite + CRA dono ports allow hain
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// 2. Middlewares
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

// 3. API Routes
app.use("/api/users", userRoutes);
app.use("/api/admin", AdminRoutes);
app.use("/api/attendance", AttendanceRoutes);
app.use("/api/leave", LeaveRoutes);
app.use("/api/notifications", NotificationRoutes);
app.use("/api/tasks", TaskRoutes);
app.use("/api/payroll", AutomatedPayrollRoutes);

// 4. Server Listen
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});