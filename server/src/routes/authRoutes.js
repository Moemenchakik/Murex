const express = require("express");
const {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  addToWishlist,
  removeFromWishlist,
  getWishlist,
} = require("../controllers/authController");
const { protect } = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/profile", protect, getUserProfile);
router.put("/profile", protect, updateUserProfile);

// Wishlist routes
router.get("/wishlist", protect, getWishlist);
router.post("/wishlist", protect, addToWishlist);
router.delete("/wishlist/:id", protect, removeFromWishlist);

module.exports = router;