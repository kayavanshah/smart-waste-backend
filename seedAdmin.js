const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const dotenv = require("dotenv");
const User = require("./models/User");

dotenv.config();

const createAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    const adminEmail = "kayavanshah7@gmail.com";
    const adminPassword = "kayavanshah10112006";

    const userExists = await User.findOne({ email: adminEmail });
    if (userExists) {
      console.log("Admin user already exists!");
      console.log(`Email: ${adminEmail}`);
      console.log(`Password: ${adminPassword}`);
      
      // We should probably update the existing user to be an admin and update the password
      const salt = await bcrypt.genSalt(10);
      userExists.password = await bcrypt.hash(adminPassword, salt);
      userExists.role = "admin";
      await userExists.save();
      
      console.log("Existing user updated to admin with new password.");
      process.exit();
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(adminPassword, salt);

    await User.create({
      name: "System Admin",
      email: adminEmail,
      password: hashedPassword,
      role: "admin",
    });

    console.log(`Admin created successfully!`);
    console.log(`Email: ${adminEmail}`);
    console.log(`Password: ${adminPassword}`);
    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

createAdmin();
