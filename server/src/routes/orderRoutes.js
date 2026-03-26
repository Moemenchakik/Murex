const express = require("express");
const {
  addOrderItems,
  getOrderById,
  updateOrderToPaid,
  getMyOrders,
  getOrders,
  updateOrderToDelivered,
} = require("../controllers/orderController");
const { protect, admin } = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/", protect, addOrderItems);
router.get("/", protect, admin, getOrders);
router.get("/myorders", protect, getMyOrders);
router.get("/:id", protect, getOrderById);
router.put("/:id/pay", protect, updateOrderToPaid);
router.put("/:id/deliver", protect, admin, updateOrderToDelivered);

module.exports = router;