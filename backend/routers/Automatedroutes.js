import express from "express";
import {
  generatePayroll,
  getAllPayrolls,
  getMyPayslips,
  markAsPaid,
} from "../Controllers/AutomatedPayrollControllers.js";
import authmiddleware from "../middleware/authmiddleware.js";
import adminmiddleware from "../middleware/adminmiddleware.js";

const router = express.Router();

// Admin: Generate Payslip
router.post("/generate", authmiddleware, adminmiddleware, generatePayroll);

// Admin: Get All Staff Payrolls
router.get("/all", authmiddleware, adminmiddleware, getAllPayrolls);

// Staff: Get Personal Payslips
router.get("/my-payslips", authmiddleware, getMyPayslips);

// Admin: Mark Salary Status as Paid
router.put("/:payrollId/pay", authmiddleware, adminmiddleware, markAsPaid);

export default router;