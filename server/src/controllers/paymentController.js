const axios = require("axios");
// Initialize Stripe safely
let stripe;
if (process.env.STRIPE_SECRET_KEY) {
  stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
}

// PayPal Token Generation
const generatePayPalToken = async () => {
  if (!process.env.PAYPAL_CLIENT_ID || !process.env.PAYPAL_CLIENT_SECRET) {
      throw new Error("PayPal credentials missing");
  }
  
  const auth = Buffer.from(
    `${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_CLIENT_SECRET}`
  ).toString("base64");

  const response = await axios({
    url: `${process.env.PAYPAL_API_URL || "https://api-m.sandbox.paypal.com"}/v1/oauth2/token`,
    method: "POST",
    data: "grant_type=client_credentials",
    headers: {
      Authorization: `Basic ${auth}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
  });

  return response.data.access_token;
};

// @desc    Create Stripe PaymentIntent
// @route   POST /api/payments/create-payment-intent
// @access  Private
const createPaymentIntent = async (req, res) => {
  const { amount } = req.body;

  if (!stripe) {
      return res.status(503).json({ message: "Stripe payment service unavailable (Missing Key)" });
  }

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Stripe expects amount in cents
      currency: "usd",
      automatic_payment_methods: {
        enabled: true,
      },
    });

    res.send({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    res.status(500).json({ message: "Stripe error", error: error.message });
  }
};

// @desc    Create PayPal Order
// @route   POST /api/payments/paypal/create-order
// @access  Private
const createPayPalOrder = async (req, res) => {
  const { amount } = req.body;

  try {
    const accessToken = await generatePayPalToken();
    const response = await axios({
      url: `${process.env.PAYPAL_API_URL || "https://api-m.sandbox.paypal.com"}/v2/checkout/orders`,
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      data: {
        intent: "CAPTURE",
        purchase_units: [
          {
            amount: {
              currency_code: "USD",
              value: amount,
            },
          },
        ],
      },
    });

    res.json(response.data);
  } catch (error) {
    res.status(500).json({ message: "PayPal creation error", error: error.response?.data || error.message });
  }
};

// @desc    Capture PayPal Order
// @route   POST /api/payments/paypal/capture-order/:orderID
// @access  Private
const capturePayPalOrder = async (req, res) => {
  const { orderID } = req.params;

  try {
    const accessToken = await generatePayPalToken();
    const response = await axios({
      url: `${process.env.PAYPAL_API_URL || "https://api-m.sandbox.paypal.com"}/v2/checkout/orders/${orderID}/capture`,
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    });

    res.json(response.data);
  } catch (error) {
    res.status(500).json({ message: "PayPal capture error", error: error.response?.data || error.message });
  }
};

module.exports = {
  createPaymentIntent,
  createPayPalOrder,
  capturePayPalOrder,
};