import NotificationBoard from "../models/NotificationBoardModel.js";

// 1. CREATE NOTICE (Sirf Admin post kar sakta hai)
const createNotice = async (req, res) => {
  try {
    const { title, description, targetDepartment, priority } = req.body;

    // Basic validation
    if (!title || !description) {
      return res
        .status(400)
        .json({ message: "Title and description are required" });
    }

    // Naya notice create kar rahe hain
    const newNotice = new NotificationBoard({
      title,
      description,
      targetDepartment: targetDepartment || "All", // default All agar target department pass na ho
      priority: priority || "Normal",
      postedBy: req.user._id, // Auth middleware se Admin ki ID auto mil jayegi
    });

    await newNotice.save();

    res.status(201).json({
      message: "Notice created successfully",
      notice: newNotice,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// 2. GET ALL NOTICES (Admin & Staff dono dekh sakte hain)
const getAllNotices = async (req, res) => {
  try {
    // .populate("postedBy", "name email role") se postedBy ki ID ki jagah Admin ka Name aur Role aa jaye ga
    // .sort({ createdAt: -1 }) se sab se latest notice sab se uper aayega
    const notices = await NotificationBoard.find()
      .populate("postedBy", "name email role")
      .sort({ createdAt: -1 });

    res.status(200).json(notices);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// 3. GET NOTICES BY DEPARTMENT (Staff ke dashboard ke liye filter)
const getMyDepartmentNotices = async (req, res) => {
  try {
    const userDepartment = req.user.department; // Auth Middleware se User ka department

   
    const notices = await NotificationBoard.find({
      $or: [{ targetDepartment: "All" }, { targetDepartment: userDepartment }],
    })
      .populate("postedBy", "name role")
      .sort({ createdAt: -1 });

    res.status(200).json(notices);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// 4. DELETE NOTICE (Sirf Admin delete kar sakta hai)
const deleteNotice = async (req, res) => {
  try {
    const { id } = req.params;

    const notice = await NotificationBoard.findByIdAndDelete(id);

    if (!notice) {
      return res.status(404).json({ message: "Notice not found" });
    }

    res.status(200).json({ message: "Notice deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
export {
  createNotice,
  getAllNotices,
  getMyDepartmentNotices,
  deleteNotice,
};
