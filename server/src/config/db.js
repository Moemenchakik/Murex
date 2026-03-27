const mongoose = require("mongoose");

const connectDB = async (retries = 5) => {
  if (!process.env.MONGO_URI) {
    console.error("MongoDB Error: MONGO_URI is not defined in environment variables.");
    process.exit(1);
  }

  while (retries > 0) {
    try {
      const conn = await mongoose.connect(process.env.MONGO_URI.trim());
      console.log(`MongoDB Connected: ${conn.connection.host}`);
      return;
    } catch (error) {
      retries -= 1;
      console.error(`MongoDB Connection Error: ${error.message}`);
      if (retries === 0) {
        console.error("MongoDB Error: Max retries reached. Exiting...");
        process.exit(1);
      }
      console.log(`Retrying connection... (${retries} attempts left)`);
      await new Promise((resolve) => setTimeout(resolve, 5000));
    }
  }
};

module.exports = connectDB;