import mongoose from "mongoose";
import dotenv from "dotenv";
import userModel from "./models/UserModel.js";

// Load environment variables
dotenv.config();

const staffUsersData = [
  {
    name: "Ahmad Khan",
    email: "ahmad@gmail.com",
    password: "StaffPassword123!",
    department: "Engineering",
    position: "Frontend Developer",
    role: "staff",
  },
  {
    name: "Ali Raza",
    email: "ali@gmail.com",
    password: "StaffPassword123!",
    department: "Engineering",
    position: "Backend Developer",
    role: "staff",
  },
  {
    name: "Usman Tariq",
    email: "usman@gmail.com",
    password: "StaffPassword123!",
    department: "HR",
    position: "HR Executive",
    role: "staff",
  },
  {
    name: "Sara Ahmed",
    email: "sara@gmail.com",
    password: "StaffPassword123!",
    department: "Finance",
    position: "Accountant",
    role: "staff",
  },
  {
    name: "Hamza Malik",
    email: "hamza@gmail.com",
    password: "StaffPassword123!",
    department: "Operations",
    position: "Support Specialist",
    role: "staff",
  },
];

const seedDatabase = async () => {
  try {
    // 1. Connect DB
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Database Connected for Seeding...\n");

    // 2. Admin User Check / Create
    const adminExists = await userModel.findOne({ email: "admin@gmail.com" });
    if (!adminExists) {
      await userModel.create({
        name: "Super Admin",
        email: "admin@gmail.com",
        password: "AdminPassword123!",
        department: "Management",
        position: "System Administrator",
        role: "admin",
      });
      console.log("✅ Admin Created -> Email: admin@gmail.com | Pass: AdminPassword123!");
    } else {
      console.log("⚠️ Admin (admin@gmail.com) pehle se exist karta hai.");
    }

    // 3. Loop through Staff Users
    for (const staff of staffUsersData) {
      const exists = await userModel.findOne({ email: staff.email });
      if (!exists) {
        await userModel.create(staff);
        console.log(`✅ Staff Created -> ${staff.name} (${staff.email})`);
      } else {
        console.log(`⚠️ User (${staff.email}) pehle se exist karta hai.`);
      }
    }

    console.log("\n🎉 Seeding Finished Successfully!");
    process.exit();
  } catch (error) {
    console.error("❌ Seeding Error:", error.message);
    process.exit(1);
  }
};

seedDatabase();