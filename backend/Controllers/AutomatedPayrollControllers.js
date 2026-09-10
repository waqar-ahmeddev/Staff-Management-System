import Payroll from "../models/AutomatedPayrollModel.js";
import User from "../models/UserModel.js";

// 1. Generate Payroll (Admin Only)
const generatePayroll = async (req, res) => {
  try {
    const { employeeId, month, year, baseSalary, allowances = {}, deductions = {} } = req.body;

    if (!employeeId || !month || !year || !baseSalary) {
      return res.status(400).json({ message: "Employee, month, year, and base salary are required" });
    }

    // Check if employee exists
    const employeeExists = await User.findById(employeeId);
    if (!employeeExists) {
      return res.status(404).json({ message: "Employee not found" });
    }

    // Calculate Allowances & Deductions
    const totalAllowances =
      (allowances.medical || 0) + (allowances.conveyance || 0) + (allowances.other || 0);
    const totalDeductions =
      (deductions.tax || 0) + (deductions.unpaidLeaves || 0) + (deductions.other || 0);

    // Automated Net Salary Calculation
    const netSalary = Number(baseSalary) + totalAllowances - totalDeductions;

    const payroll = await Payroll.create({
      employee: employeeId,
      month,
      year,
      baseSalary,
      allowances,
      deductions,
      netSalary,
      generatedBy: req.user._id,
    });

    return res.status(201).json({ message: "Payroll generated successfully", payroll });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: "Payroll already generated for this employee for given month & year" });
    }
    return res.status(500).json({ message: "Error generating payroll", error: error.message });
  }
};

// 2. Get All Payrolls (Admin View)
const getAllPayrolls = async (req, res) => {
  try {
    const payrolls = await Payroll.find()
      .populate("employee", "name email department position")
      .populate("generatedBy", "name email")
      .sort({ createdAt: -1 });

    return res.status(200).json({ message: "All payrolls retrieved", payrolls });
  } catch (error) {
    return res.status(500).json({ message: "Error fetching payrolls", error: error.message });
  }
};

// 3. Get Logged-in Employee Payslips (Staff View)
const getMyPayslips = async (req, res) => {
  try {
    const payslips = await Payroll.find({ employee: req.user._id })
      .populate("generatedBy", "name email")
      .sort({ createdAt: -1 });

    return res.status(200).json({ message: "My payslips retrieved", payslips });
  } catch (error) {
    return res.status(500).json({ message: "Error fetching payslips", error: error.message });
  }
};

// 4. Mark Salary as Paid (Admin Only)
const markAsPaid = async (req, res) => {
  try {
    const { payrollId } = req.params;

    const payroll = await Payroll.findById(payrollId);
    if (!payroll) {
      return res.status(404).json({ message: "Payroll record not found" });
    }

    payroll.status = "paid";
    payroll.paymentDate = new Date();
    await payroll.save();

    return res.status(200).json({ message: "Payroll status updated to PAID", payroll });
  } catch (error) {
    return res.status(500).json({ message: "Error updating payment status", error: error.message });
  }
};

export { generatePayroll, getAllPayrolls, getMyPayslips, markAsPaid };