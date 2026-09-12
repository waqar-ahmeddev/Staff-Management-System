import jwt from "jsonwebtoken";
import userModel from "../models/UserModel.js";

const authMiddleware = async (req, res, next) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({
        message: "Not authenticated",
      });
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    // JWT mein "id" save ki gayi hai
    // isliye yahan decoded.id use hoga
    const user = await userModel.findById(decoded.id)
      .select("-password");

    if (!user) {
      return res.status(401).json({
        message: "User not found",
      });
    }

    req.user = user;
    next();

  } catch (error) {
    console.error("Auth Middleware Error:", error);

    return res.status(401).json({
      message: "Invalid or expired token",
    });
  }
};

export default authMiddleware;