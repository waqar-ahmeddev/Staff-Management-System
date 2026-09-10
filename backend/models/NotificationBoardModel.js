import mongoose from "mongoose";

const notificationBoardSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    targetDepartment: {
      type: String,
      required: true,
      default: "All",
    },
    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    priority: {
      type: String,
      enum: ["Normal", "Urgent"],
      default: "Normal",
    },
  },
  { timestamps: true } // Auto creates createdAt & updatedAt
);

const NotificationBoard = mongoose.model("NotificationBoard", notificationBoardSchema);
export default NotificationBoard;