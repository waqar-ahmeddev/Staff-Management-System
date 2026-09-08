import userModel from "../models/UserModel.js";
// ================= ADD STAFF =================

const addStaff = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      department,
      position,
    } = req.body;

    // Check all fields
    if (!name || !email || !password || !department || !position) {
      return res.status(400).json({
        message: "Please fill all the fields",
      });
    }

    // Check if user already exists
    const existingUser = await userModel.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    // Create staff
    const newStaff = new userModel({
      name,
      email,
      password,
      department,
      position,
      role: "staff",
    });

    // Password pre-save hook ki wajah se hash hoga
    await newStaff.save();

    return res.status(201).json({
      message: "Staff added successfully",
      staff: {
        id: newStaff._id,
        name: newStaff.name,
        email: newStaff.email,
        department: newStaff.department,
        position: newStaff.position,
        role: newStaff.role,
      },
    });

  } catch (error) {
    console.log(error);


    return res.status(500).json({
      message: "Server error",
    });
  }
};


// ================= GET ALL STAFF =================

const getAllStaff = async (req, res) => {
  try {
    const staff = await userModel
      .find({ role: "staff" })
      .select("-password");

    return res.status(200).json({
      message: "Staff fetched successfully",
      staff,
    });

  } catch (error) {
    console.log(error);

    return res.status(500).json({
      message: "Server error",
    });
  }
};


// ================= GET SINGLE STAFF =================

const getStaffById = async (req, res) => {
  try {
    const { id } = req.params;

    const staff = await userModel
      .findOne({
        _id: id,
        role: "staff",
      })
      .select("-password");

    if (!staff) {
      return res.status(404).json({
        message: "Staff not found",
      });
    }

    return res.status(200).json({
      message: "Staff fetched successfully",
      staff,
    });

  } catch (error) {
    console.log(error);

    return res.status(500).json({
      message: "Server error",
    });
  }
};


// ================= UPDATE STAFF =================

const updateStaff = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      name,
      email,
      department,
      position,
    } = req.body;

    const staff = await userModel.findOne({
      _id: id,
      role: "staff",
    });

    if (!staff) {
      return res.status(404).json({
        message: "Staff not found",
      });
    }

    // Update only provided fields
    if (name) staff.name = name;
    if (email) staff.email = email;
    if (department) staff.department = department;
    if (position) staff.position = position;

    await staff.save();

    return res.status(200).json({
      message: "Staff updated successfully",
      staff: {
        id: staff._id,
        name: staff.name,
        email: staff.email,
        department: staff.department,
        position: staff.position,
        role: staff.role,
      },
    });

  } catch (error) {
    console.log(error);

    return res.status(500).json({
      message: "Server error",
    });
  }
};


// ================= DELETE STAFF =================

const deleteStaff = async (req, res) => {
  try {
    const { id } = req.params;

    const staff = await userModel.findOne({
      _id: id,
      role: "staff",
    });

    if (!staff) {
      return res.status(404).json({
        message: "Staff not found",
      });
    }

    await userModel.findByIdAndDelete(id);

    return res.status(200).json({
      message: "Staff deleted successfully",
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
  addStaff,
  getAllStaff,
  getStaffById,
  updateStaff,
  deleteStaff,
};