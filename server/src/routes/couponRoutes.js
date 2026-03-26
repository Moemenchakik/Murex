const express = require("express");
const {
  getCoupons,
  createCoupon,
  deleteCoupon,
  validateCoupon,
} = require("../controllers/couponController");
const { protect, admin } = require("../middlewares/authMiddleware");

const router = express.Router();

router.get("/", protect, admin, getCoupons);
router.post("/", protect, admin, createCoupon);
router.delete("/:id", protect, admin, deleteCoupon);
router.post("/validate", protect, validateCoupon);

module.exports = router;