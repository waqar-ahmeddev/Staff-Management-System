import mongoose from "mongoose";

const attendanceSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    checkIn: {
      type: Date,
    },
    status: {
      type: String,
      required: true,
    },
    checkOut: {
      type: Date,
    },
    reason:{
      type: String,
      required: false,
    }
  },
  { timestamps: true },
);

const Attendance = mongoose.model("Attendance", attendanceSchema);
export default Attendance;
