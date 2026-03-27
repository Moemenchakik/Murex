const mongoose = require("mongoose");
const User = require("../models/User");
const dotenv = require("dotenv");
const path = require("path");

// Load env vars
dotenv.config({ path: path.join(__dirname, "../../.env") });

const makeAdmin = async (email) => {
  try {
    if (!process.env.MONGO_URI) {
      console.error("MONGO_URI not found in environment variables.");
      process.exit(1);
    }

    await mongoose.connect(process.env.MONGO_URI.trim());
    console.log("Connected to Database...");

    const user = await User.findOne({ email });
    if (!user) {
      console.log(`User with email ${email} not found.`);
      process.exit(1);
    }

    user.isAdmin = true;
    await user.save();

    console.log(`Success! ${email} is now an Admin.`);
    process.exit(0);
  } catch (error) {
    console.error("Error:", error.message);
    process.exit(1);
  }
};

const email = process.argv[2];
if (!email) {
  console.log("Please provide an email: node server/src/utils/makeAdmin.js your@email.com");
  process.exit(1);
}

makeAdmin(email);
