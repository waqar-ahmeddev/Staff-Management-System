import Attendance from "../models/AttendanceModel.js";

// ================= MARK ATTENDANCE =================

const markAttendance = async (req, res) => {
  try {
    const userId = req.user._id;

    const { status } = req.body;
    const { reason } = req.body;

    if (!status) {
      return res.status(400).json({
        message: "Status is required",
      });
    }

    // Current date
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Check if attendance already exists today
    const existingAttendance = await Attendance.findOne({
      user: userId,
      date: today,
    });

    if (existingAttendance) {
      return res.status(400).json({
        message: "Attendance already marked for today",
      });
    }

    const attendance = new Attendance({
      user: userId,
      date: today,
      checkIn: new Date(),
      status,
    });

    await attendance.save();

    return res.status(201).json({
      message: "Attendance marked successfully",
      attendance,
    });

  } catch (error) {
    console.log(error);

    return res.status(500).json({
      message: "Server error",
    });
  }
};


// ================= MY ATTENDANCE =================

const getMyAttendance = async (req, res) => {
  try {
    const userId = req.user._id;

    const attendance = await Attendance.find({
      user: userId,
    }).sort({ date: -1 });

    return res.status(200).json({
      message: "Attendance fetched successfully",
      attendance,
    });

  } catch (error) {
    console.log(error);

    return res.status(500).json({
      message: "Server error",
    });
  }
};


// ================= ALL ATTENDANCE =================

const getAllAttendance = async (req, res) => {
  try {
    const attendance = await Attendance.find()
      .populate("user", "name email department position")
      .sort({ date: -1 });

    return res.status(200).json({
      message: "All attendance fetched successfully",
      attendance,
    });

  } catch (error) {
    console.log(error);

    return res.status(500).json({
      message: "Server error",
    });
  }
};


// ================= GET ATTENDANCE BY ID =================

const getAttendanceById = async (req, res) => {
  try {
    const { id } = req.params;

    const attendance = await Attendance.findById(id)
      .populate("user", "name email department position");

    if (!attendance) {
      return res.status(404).json({
        message: "Attendance not found",
      });
    }

    return res.status(200).json({
      message: "Attendance fetched successfully",
      attendance,
    });

  } catch (error) {
    console.log(error);

    return res.status(500).json({
      message: "Server error",
    });
  }
};


// ================= UPDATE ATTENDANCE =================

const updateAttendance = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      status,
      checkIn,
      checkOut,
      reason,
    } = req.body;

    const attendance = await Attendance.findById(id);

    if (!attendance) {
      return res.status(404).json({
        message: "Attendance not found",
      });
    }

    if (status) attendance.status = status;
    if (checkIn) attendance.checkIn = checkIn;
    if (checkOut) attendance.checkOut = checkOut;
    if (reason) attendance.reason = reason;

    await attendance.save();

    return res.status(200).json({
      message: "Attendance updated successfully",
      attendance,
    });

  } catch (error) {
    console.log(error);

    return res.status(500).json({
      message: "Server error",
    });
  }
};


// ================= EXPORT =================

export default {
  markAttendance,
  getMyAttendance,
  getAllAttendance,
  getAttendanceById,
  updateAttendance,
};