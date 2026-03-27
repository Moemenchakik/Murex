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

// Security Middlewares
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");

app.use(helmet()); // Set security HTTP headers

// Data sanitization against NoSQL query injection (Express 5 compatible)
const sanitize = (obj) => {
  if (obj instanceof Object) {
    for (let key in obj) {
      if (key.startsWith("$") || key.includes(".")) {
        delete obj[key];
      } else {
        sanitize(obj[key]);
      }
    }
  }
  return obj;
};

app.use((req, res, next) => {
  req.body = sanitize(req.body || {});
  req.params = sanitize(req.params || {});
  // Note: in Express 5 req.query is a getter/setter, we sanitize its contents instead of replacing it
  sanitize(req.query || {});
  next();
});

// Limit requests from same API
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: "Too many requests from this IP, please try again in an hour!",
});
app.use("/api", limiter);

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

const { notFound, errorHandler } = require("./middlewares/errorMiddleware");
app.use(notFound);
app.use(errorHandler);

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