import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    department: {
      type: String,
      required: true,
    },
    position: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["admin", "staff"],
      default: "staff",
    },
  },
  { timestamps: true }
);

// 🔒 Password Hash karne ke liye Pre-Save Hook (Async Without 'next')
userSchema.pre("save", async function () {
  // Agar password modify nahi hua, toh skip karein
  if (!this.isModified("password")) {
    return;
  }

  // Salt generate karein aur password hash karein
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// 🔑 Password compare method
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.models.User || mongoose.model("User", userSchema);
export default User;