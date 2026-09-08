import userModel from "../models/UserModel.js";
import jwt from "jsonwebtoken";

// Generate JWT Token
const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || "7d",
  });
};

// ================= REGISTER =================

const registerUser = async (req, res) => {
  try {
    const { name, email, password, department, position } = req.body;

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

    // Create user
    const newUser = new userModel({
      name,
      email,
      password,
      department,
      position,

      // role frontend se nahi aa raha
      // Model ka default "staff" automatically hoga
    });

    // Save user
    // Password pre-save hook ki wajah se hash hoga
    await newUser.save();

    return res.status(201).json({
      message: "User registered successfully",
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        department: newUser.department,
        position: newUser.position,
        role: newUser.role,
      },
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      message: "Server error",
    });
  }
};

// ================= LOGIN =================

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check fields
    if (!email || !password) {
      return res.status(400).json({
        message: "Please fill all the fields",
      });
    }

    // Find user
    const existingUser = await userModel.findOne({ email });

    if (!existingUser) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    // Compare password
    // Model ke matchPassword method ko use karega
    const isMatch = await existingUser.matchPassword(password);

    if (!isMatch) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    // Generate JWT token
    const token = generateToken(existingUser._id);

    // Store token in HTTP-only cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      message: "User logged in successfully",

      user: {
        id: existingUser._id,
        name: existingUser.name,
        email: existingUser.email,
        department: existingUser.department,
        position: existingUser.position,
        role: existingUser.role,
      },
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      message: "Server error",
    });
  }
};

// ================= LOGOUT =================

const logoutUser = async (req, res) => {
  try {
    // Remove JWT cookie
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    return res.status(200).json({
      message: "User logged out successfully",
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      message: "Server error",
    });
  }
};

// ================= EXPORT =================

export { registerUser, loginUser, logoutUser };
