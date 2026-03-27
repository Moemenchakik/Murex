const express = require("express");
const { processMockCardPayment } = require("../controllers/paymentController");
const { protect } = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/mock-card", protect, processMockCardPayment);

module.exports = router;
