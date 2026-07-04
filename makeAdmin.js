const mongoose = require("mongoose");
const dotenv = require("dotenv");
const User = require("./models/User");

dotenv.config();

const makeAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB...");
    
    const result = await User.updateMany({}, { $set: { role: "admin" } });
    console.log(`Successfully upgraded ${result.modifiedCount} user(s) to Admin!`);
    
    process.exit(0);
  } catch (error) {
    console.error("Error updating users:", error);
    process.exit(1);
  }
};

makeAdmin();
