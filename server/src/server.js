const dotenv = require("dotenv");
const path = require("path");
const connectDB = require("./config/db");

// Load env vars
dotenv.config({ path: path.join(__dirname, "../.env") });

const app = require("./app");

// Initialize database connection
// In a serverless environment, we initiate the connection but don't strictly need to await it here
// as Mongoose buffers commands until the connection is established.
connectDB().catch((err) => {
  console.error(`MongoDB connection failed: ${err.message}`);
});

// For local development and traditional server environments
if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

// Export the app for Vercel's serverless functions
module.exports = app;