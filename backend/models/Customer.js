import mongoose from "mongoose";

const attendanceSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    phonenum: {
      type: Number,
      required: true,
    },
    CompanyName: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
  },
  { timestamps: true },
);
const customer = mongoose.model("Customer", attendanceSchema);
export default customer;
