const express = require("express");
const { createPaymentIntent, createPayPalOrder, capturePayPalOrder } = require("../controllers/paymentController");
const { protect } = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/create-payment-intent", protect, createPaymentIntent);
router.post("/paypal/create-order", protect, createPayPalOrder);
router.post("/paypal/capture-order/:orderID", protect, capturePayPalOrder);

module.exports = router;