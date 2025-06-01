#!/usr/bin/env node

/**
 * Seed Admin User Script
 * Creates a default admin user for the system
 */

const mongoose = require("mongoose");
const User = require("../src/models/User");
require("dotenv").config();

// Admin user data
const adminData = {
  username: "admin",
  email: "admin@hack-the-world.com",
  password: "admin123",
  profile: {
    firstName: "System",
    lastName: "Administrator",
    displayName: "Admin",
  },
  role: "admin",
  adminStatus: "active", // Directly activate the default admin
  experienceLevel: "expert",
};

const createAdmin = async () => {
  try {
    // Connect to MongoDB
    console.log("🔌 Connecting to MongoDB...");
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ Connected to MongoDB");

    // Check if admin already exists
    const existingAdmin = await User.findOne({
      $or: [{ email: adminData.email }, { username: adminData.username }],
    });

    if (existingAdmin) {
      console.log("⚠️  Admin user already exists:");
      console.log(`   Username: ${existingAdmin.username}`);
      console.log(`   Email: ${existingAdmin.email}`);
      console.log(`   Role: ${existingAdmin.role}`);
      console.log(`   Status: ${existingAdmin.adminStatus}`);

      if (
        existingAdmin.role === "admin" &&
        existingAdmin.adminStatus !== "active"
      ) {
        console.log("🔄 Activating existing admin...");
        existingAdmin.adminStatus = "active";
        await existingAdmin.save();
        console.log("✅ Admin user activated!");
      }

      process.exit(0);
    }

    // Create new admin user
    console.log("👤 Creating admin user...");
    const admin = new User(adminData);
    await admin.save();

    console.log("✅ Admin user created successfully!");
    console.log("📋 Admin credentials:");
    console.log(`   Email: ${adminData.email}`);
    console.log(`   Password: ${adminData.password}`);
    console.log(`   Username: ${adminData.username}`);
    console.log(`   Role: ${adminData.role}`);
    console.log(`   Status: ${adminData.adminStatus}`);

    console.log("\n🎉 Admin user is ready to use!");
    console.log(
      "🔐 You can now log in to the admin panel with these credentials."
    );
  } catch (error) {
    console.error("❌ Error creating admin user:", error.message);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log("🔌 Disconnected from MongoDB");
  }
};

// Handle script execution
if (require.main === module) {
  createAdmin();
}

module.exports = createAdmin;
