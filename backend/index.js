import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import ConnectDb from "./utils/db.js";
dotenv.config();
import userRoutes from "./routers/userroutes.js";
import AdminRoutes from "./routers/Adminroutes.js";
ConnectDb();

const port = process.env.PORT || 5000;
const app = express();

// Middlewares
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

// Use the user routes
app.use("/api/users", userRoutes);
app.use("/api/admin", AdminRoutes);

// CORS configuration (React app front-end URL)
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    credentials: true,
  }),
);

// Basic Route


// Server Listen
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
