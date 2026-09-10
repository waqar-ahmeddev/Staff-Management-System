import mongoose from "mongoose";

const payrollSchema = new mongoose.Schema(
  {
    employee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    month: {
      type: String, // e.g. "September"
      required: true,
    },
    year: {
      type: Number, // e.g. 2026
      required: true,
    },
    baseSalary: {
      type: Number,
      required: true,
    },
    allowances: {
      medical: { type: Number, default: 0 },
      conveyance: { type: Number, default: 0 },
      other: { type: Number, default: 0 },
    },
    deductions: {
      tax: { type: Number, default: 0 },
      unpaidLeaves: { type: Number, default: 0 },
      other: { type: Number, default: 0 },
    },
    netSalary: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "paid"],
      default: "pending",
    },
    paymentDate: {
      type: Date,
    },
    generatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

// Prevent duplicate payslip for same employee in same month & year
payrollSchema.index({ employee: 1, month: 1, year: 1 }, { unique: true });

const Payroll = mongoose.model("Payroll", payrollSchema);
export default Payroll;