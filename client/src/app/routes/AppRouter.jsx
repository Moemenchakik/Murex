import { Routes, Route, Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import MainLayout from "../../components/layout/MainLayout";

import Home from "../../pages/Home/Home";
import Shop from "../../pages/Shop/Shop";
import ProductDetails from "../../pages/ProductDetails/ProductDetails";
import Cart from "../../pages/Cart/Cart";
import Checkout from "../../pages/Checkout/Checkout";
import Login from "../../pages/Login/Login";
import Register from "../../pages/Register/Register";
import Profile from "../../pages/Profile/Profile";
import Orders from "../../pages/Orders/Orders";
import OrderDetails from "../../pages/Orders/OrderDetails";
import Wishlist from "../../pages/Wishlist/Wishlist";
import Admin from "../../pages/Admin/Admin";
import ProductList from "../../pages/Admin/ProductList";
import OrderList from "../../pages/Admin/OrderList";
import ProductEdit from "../../pages/Admin/ProductEdit";
import CouponList from "../../pages/Admin/CouponList";
import NotFound from "../../pages/NotFound/NotFound";

const ProtectedRoute = () => {
  const { user } = useSelector((state) => state.auth);
  return user ? <Outlet /> : <Navigate to="/login" replace />;
};

const AdminRoute = () => {
  const { user } = useSelector((state) => state.auth);
  return user && user.isAdmin ? <Outlet /> : <Navigate to="/" replace />;
};

function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route index element={<Home />} />
        <Route path="shop" element={<Shop />} />
        <Route path="product/:id" element={<ProductDetails />} />
        <Route path="cart" element={<Cart />} />
        <Route path="wishlist" element={<Wishlist />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />

        {/* User Routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="checkout" element={<Checkout />} />
          <Route path="profile" element={<Profile />} />
          <Route path="orders" element={<Orders />} />
          <Route path="orders/:id" element={<OrderDetails />} />
        </Route>

        {/* Admin Routes */}
        <Route element={<AdminRoute />}>
          <Route path="admin" element={<Admin />} />
          <Route path="admin/products" element={<ProductList />} />
          <Route path="admin/orders" element={<OrderList />} />
          <Route path="admin/product/create" element={<ProductEdit />} />
          <Route path="admin/product/:id/edit" element={<ProductEdit />} />
          <Route path="admin/coupons" element={<CouponList />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}

export default AppRouter;
