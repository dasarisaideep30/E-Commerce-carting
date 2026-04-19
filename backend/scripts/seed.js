const mongoose = require("mongoose");
const User = require("../model/user");
const Product = require("../model/product");
const bcrypt = require("bcryptjs");
require("dotenv").config({ path: "./config/.env" });

const seed = async () => {
  try {
    console.log("Connecting to Database...");
    await mongoose.connect(process.env.DB_URL);
    console.log("Connected.");

    console.log("Clearing Users and Products...");
    await User.deleteMany({});
    await Product.deleteMany({});
    console.log("Cleared.");

    console.log("Creating Admin User...");
    const hashedPassword = await bcrypt.hash("Saideep*30", 10);
    const adminUser = await User.create({
      name: "Saideep Admin",
      email: "saideep@gmail.com",
      password: hashedPassword,
      avatar: {
        public_id: "admin_avatar",
        url: "https://ui-avatars.com/api/?name=Saideep+Admin&background=6366f1&color=fff",
      },
      role: "admin",
    });
    console.log("Admin User Created:", adminUser.email);

    console.log("Seeding Completed Successfully.");
    process.exit(0);
  } catch (error) {
    console.error("Seeding Failed:", error);
    process.exit(1);
  }
};

seed();
