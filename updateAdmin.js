const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const dotenv = require("dotenv");
const User = require("./models/User");

dotenv.config();

const updateAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB...");
    
    const newEmail = "skayavan7@gmail.com";
    const newPassword = "kayavanshah10112006";
    
    // Securely hash the new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);
    
    // Find the exact user and update them, or create if they don't exist
    const result = await User.updateOne(
      { email: newEmail }, 
      { 
        $set: { 
          password: hashedPassword,
          role: "admin",
          name: "Kayavan Shah"
        } 
      },
      { upsert: true }
    );
    
    console.log(`Successfully updated the Admin account!`);
    
    process.exit(0);
  } catch (error) {
    console.error("Error updating admin:", error);
    process.exit(1);
  }
};

updateAdmin();
