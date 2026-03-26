import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  cartItems: localStorage.getItem("cartItems")
    ? JSON.parse(localStorage.getItem("cartItems"))
    : [],
  cartTotalQuantity: 0,
  cartTotalAmount: 0,
  coupon: localStorage.getItem("coupon")
    ? JSON.parse(localStorage.getItem("coupon"))
    : null,
  discountAmount: 0,
  finalAmount: 0,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart(state, action) {
      const { productId, size, color, quantity } = action.payload;
      
      const itemIndex = state.cartItems.findIndex(
        (item) => 
          item.productId === productId && 
          item.size === size && 
          item.color === color
      );

      if (itemIndex >= 0) {
        state.cartItems[itemIndex].quantity += quantity;
      } else {
        state.cartItems.push(action.payload);
      }

      localStorage.setItem("cartItems", JSON.stringify(state.cartItems));
    },
    removeFromCart(state, action) {
      const { productId, size, color } = action.payload;
      state.cartItems = state.cartItems.filter(
        (item) => 
          !(item.productId === productId && item.size === size && item.color === color)
      );
      localStorage.setItem("cartItems", JSON.stringify(state.cartItems));
    },
    decreaseCart(state, action) {
      const { productId, size, color } = action.payload;
      const itemIndex = state.cartItems.findIndex(
        (item) => item.productId === productId && item.size === size && item.color === color
      );

      if (state.cartItems[itemIndex].quantity > 1) {
        state.cartItems[itemIndex].quantity -= 1;
      } else {
        state.cartItems = state.cartItems.filter(
          (item) => !(item.productId === productId && item.size === size && item.color === color)
        );
      }
      localStorage.setItem("cartItems", JSON.stringify(state.cartItems));
    },
    increaseCart(state, action) {
      const { productId, size, color } = action.payload;
      const itemIndex = state.cartItems.findIndex(
        (item) => item.productId === productId && item.size === size && item.color === color
      );
      
      if (state.cartItems[itemIndex].quantity < state.cartItems[itemIndex].stock) {
        state.cartItems[itemIndex].quantity += 1;
      }
      localStorage.setItem("cartItems", JSON.stringify(state.cartItems));
    },
    clearCart(state) {
      state.cartItems = [];
      state.coupon = null;
      localStorage.setItem("cartItems", JSON.stringify(state.cartItems));
      localStorage.removeItem("coupon");
    },
    applyCoupon(state, action) {
      state.coupon = action.payload;
      localStorage.setItem("coupon", JSON.stringify(state.coupon));
    },
    removeCoupon(state) {
      state.coupon = null;
      localStorage.removeItem("coupon");
    },
    getTotals(state) {
      let { total, quantity } = state.cartItems.reduce(
        (cartTotal, cartItem) => {
          const { price, quantity } = cartItem;
          const itemTotal = price * quantity;

          cartTotal.total += itemTotal;
          cartTotal.quantity += quantity;

          return cartTotal;
        },
        {
          total: 0,
          quantity: 0,
        }
      );
      state.cartTotalQuantity = quantity;
      state.cartTotalAmount = total;

      if (state.coupon) {
        if (state.coupon.discountType === "percentage") {
          state.discountAmount = (total * state.coupon.discountValue) / 100;
        } else {
          state.discountAmount = state.coupon.discountValue;
        }
      } else {
        state.discountAmount = 0;
      }

      state.finalAmount = state.cartTotalAmount - state.discountAmount;
    },
  },
});

export const { 
  addToCart, 
  removeFromCart, 
  decreaseCart, 
  increaseCart, 
  clearCart, 
  getTotals,
  applyCoupon,
  removeCoupon 
} = cartSlice.actions;

export default cartSlice.reducer;