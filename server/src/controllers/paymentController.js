const asyncHandler = require("../utils/asyncHandler");

// @desc    Mock Visa/Card Payment (for Lebanon/General use)
// @route   POST /api/payments/mock-card
// @access  Private
const processMockCardPayment = asyncHandler(async (req, res) => {
  const { cardInfo, amount } = req.body;

  // Real-world logic would involve a local bank API (e.g., Areeba)
  // For this project, we simulate the validation process
  const { cardNumber, expiryDate, cvc } = cardInfo;

  // Basic security check: mock validation
  if (!cardNumber || cardNumber.length < 16) {
    res.status(400);
    throw new Error("Invalid card number. Please provide a valid 16-digit card number.");
  }

  if (!expiryDate || !expiryDate.includes("/")) {
    res.status(400);
    throw new Error("Invalid expiry date. Format should be MM/YY.");
  }

  if (!cvc || cvc.length < 3) {
    res.status(400);
    throw new Error("Invalid CVC.");
  }

  // Simulate a 1-second bank verification delay
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // 95% success rate simulation
  const isSuccess = Math.random() < 0.95;

  if (isSuccess) {
    res.json({
      status: "COMPLETED",
      transactionId: `mock_tx_${Date.now()}`,
      message: "Payment successfully processed.",
      amount,
    });
  } else {
    res.status(400);
    throw new Error("Payment declined by the issuing bank. Please try again or use another card.");
  }
});

module.exports = {
  processMockCardPayment,
  // Stripe/PayPal logic below (optional/backup)
  createPaymentIntent: (req, res) => res.status(503).json({ message: "Stripe not supported in this region." }),
};
