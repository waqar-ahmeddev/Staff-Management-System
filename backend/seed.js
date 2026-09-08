import mongoose from "mongoose";
import dotenv from "dotenv";
import userModel from "./models/UserModel.js";

// Load environment variables
dotenv.config();

const seedAdmin = async () => {
  try {
    // 1. Database Connect Karein
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Database Connected for Seeding...");

    // 2. Check Karein Agar Admin Pehle Se Exist Karta Hai
    const adminExists = await userModel.findOne({ role: "admin" });

    if (adminExists) {
      console.log("⚠️ Admin user pehle se exist karta hai!");
      process.exit();
    }

    // 3. New Admin Create Karein
    const adminUser = new userModel({
      name: "Super Admin",
      email: "admin@gmail.com",
      password: "AdminPassword123!", // UserModel ka pre-save hook isey khud hash kar dega
      department: "Management",
      position: "System Administrator",
      role: "admin",
    });

    await adminUser.save();
    console.log("✅ Admin User Successfully Created!");
    console.log("Email: admin@gmail.com");
    console.log("Password: AdminPassword123!");

    process.exit();
  } catch (error) {
    console.error("❌ Error while seeding admin:", error.message);
    process.exit(1);
  }
};

seedAdmin();