const Coupon = require("../models/Coupon");

// @desc    Get all coupons
// @route   GET /api/coupons
// @access  Private/Admin
const getCoupons = async (req, res) => {
  try {
    const coupons = await Coupon.find({}).sort({ createdAt: -1 });
    res.json(coupons);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch coupons" });
  }
};

// @desc    Create a coupon
// @route   POST /api/coupons
// @access  Private/Admin
const createCoupon = async (req, res) => {
  const { code, discountType, discountValue, expiryDate, usageLimit } = req.body;

  try {
    const couponExists = await Coupon.findOne({ code: code.toUpperCase() });

    if (couponExists) {
      return res.status(400).json({ message: "Coupon already exists" });
    }

    const coupon = await Coupon.create({
      code: code.toUpperCase(),
      discountType,
      discountValue,
      expiryDate,
      usageLimit,
    });

    res.status(201).json(coupon);
  } catch (error) {
    res.status(500).json({ message: "Failed to create coupon", error: error.message });
  }
};

// @desc    Delete a coupon
// @route   DELETE /api/coupons/:id
// @access  Private/Admin
const deleteCoupon = async (req, res) => {
  try {
    const coupon = await Coupon.findById(req.params.id);

    if (coupon) {
      await coupon.deleteOne();
      res.json({ message: "Coupon removed" });
    } else {
      res.status(404).json({ message: "Coupon not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Failed to delete coupon" });
  }
};

// @desc    Validate a coupon code
// @route   POST /api/coupons/validate
// @access  Private
const validateCoupon = async (req, res) => {
  const { code } = req.body;

  try {
    const coupon = await Coupon.findOne({ code: code.toUpperCase(), isActive: true });

    if (!coupon) {
      return res.status(404).json({ message: "Invalid or inactive coupon" });
    }

    if (new Date(coupon.expiryDate) < new Date()) {
      return res.status(400).json({ message: "Coupon has expired" });
    }

    if (coupon.usageLimit !== null && coupon.usedCount >= coupon.usageLimit) {
      return res.status(400).json({ message: "Coupon usage limit reached" });
    }

    res.json({
      code: coupon.code,
      discountType: coupon.discountType,
      discountValue: coupon.discountValue,
    });
  } catch (error) {
    res.status(500).json({ message: "Validation error" });
  }
};

module.exports = {
  getCoupons,
  createCoupon,
  deleteCoupon,
  validateCoupon,
};