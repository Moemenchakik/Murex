const express = require("express");
const cors = require("cors");
const path = require("path");
const productRoutes = require("./routes/productRoutes");
const authRoutes = require("./routes/authRoutes");
const orderRoutes = require("./routes/orderRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const uploadRoutes = require("./routes/uploadRoutes");
const couponRoutes = require("./routes/couponRoutes");

const app = express();

app.use(cors());
app.use(express.json());

// Serve uploads folder
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

app.use("/api/products", productRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/coupons", couponRoutes);

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../../client/build")));

  app.get("*", (req, res) =>
    res.sendFile(path.resolve(__dirname, "../../client", "build", "index.html"))
  );
} else {
  app.get("/", (req, res) => {
    res.send("API running...");
  });
}

module.exports = app;