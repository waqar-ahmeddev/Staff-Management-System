import Leave from "../models/LeaveModel.js";
// 1. User: Apply for Leave
const applyLeave = async (req, res) => {
  try {
    const { startDate, endDate, reason } = req.body;

    if (!startDate || !endDate || !reason) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const newLeave = new Leave({
      user: req.user._id, // authmiddleware se mili ID
      startDate,
      endDate,
      reason,
    });

    await newLeave.save();
    res.status(201).json({ message: "Leave applied successfully", leave: newLeave });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// 2. User: Get Own Leave History
const getMyLeaves = async (req, res) => {
  try {
    const leaves = await Leave.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json(leaves);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// 3. Admin: Get All Leaves
const getAllLeaves = async (req, res) => {
  try {
    const leaves = await Leave.find().populate("user", "name email").sort({ createdAt: -1 });
    res.status(200).json(leaves);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
// 3. Admin: Update Leave Status
const updateLeaveStatus = async (req, res) => {
  try {
    const { status } = req.body; // status should be 'approved' or 'rejected'

    if (!["approved", "rejected"].includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    const leave = await Leave.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!leave) {
      return res.status(404).json({ message: "Leave request not found" });
    }

    res.status(200).json({ message: `Leave ${status} successfully`, leave });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
export default {
  applyLeave,
  getMyLeaves,
    getAllLeaves,
    updateLeaveStatus,
};