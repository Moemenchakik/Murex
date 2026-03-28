const mongoose = require("mongoose");

const connectDB = async (retries = 5) => {
  if (!process.env.MONGO_URI) {
    const error = new Error("MongoDB Error: MONGO_URI is not defined in environment variables.");
    console.error(error.message);
    throw error;
  }

  // Log a masked version of the URI for debugging
  const maskedUri = process.env.MONGO_URI.replace(/:([^@]+)@/, ":****@");
  console.log(`Attempting to connect to MongoDB: ${maskedUri}`);

  while (retries > 0) {
    try {
      const conn = await mongoose.connect(process.env.MONGO_URI.trim());
      console.log(`MongoDB Connected: ${conn.connection.host}`);
      return conn;
    } catch (error) {
      retries -= 1;
      console.error(`MongoDB Connection Error: ${error.message}`);
      if (retries === 0) {
        console.error("MongoDB Error: Max retries reached. Database connection failed.");
        throw error; // Throw error instead of exiting process
      }
      console.log(`Retrying connection... (${retries} attempts left)`);
      await new Promise((resolve) => setTimeout(resolve, 5000));
    }
  }
};

module.exports = connectDB;