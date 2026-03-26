import { configureStore } from "@reduxjs/toolkit";
import cartReducer from "../features/cart/cartSlice";
import authReducer from "../features/auth/authSlice";
import orderReducer from "../features/orders/orderSlice";
import productReducer from "../features/products/productSlice";
import wishlistReducer from "../features/wishlist/wishlistSlice";

export const store = configureStore({
  reducer: {
    cart: cartReducer,
    auth: authReducer,
    order: orderReducer,
    product: productReducer,
    wishlist: wishlistReducer,
  },
});

export default store;