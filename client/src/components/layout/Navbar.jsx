import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { getTotals, clearCart } from "../../features/cart/cartSlice";
import { logout, reset } from "../../features/auth/authSlice";

function Navbar() {
  const { cartItems, cartTotalQuantity } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(getTotals());
  }, [cartItems, dispatch]);

  const logoutHandler = () => {
    dispatch(logout());
    dispatch(clearCart());
    dispatch(reset());
    navigate("/login");
  };

  return (
    <header className="navbar-header">
      <nav className="container navbar-container">
        <div className="navbar-left">
          <Link to="/" className="navbar-logo">MUREX</Link>
          <div className="navbar-links">
            <Link to="/shop" className="navbar-link">Shop</Link>
            <Link to="/cart" className="navbar-link cart-link">
              Cart
              {cartTotalQuantity > 0 && (
                <span className="cart-badge">{cartTotalQuantity}</span>
              )}
            </Link>
          </div>
        </div>

        <div className="navbar-right">
          {user ? (

            <>
              <Link to={user.isAdmin ? "/admin/orders" : "/orders"} className="navbar-link">Orders</Link>
              {user.isAdmin && (
                <div className="admin-menu" style={{ display: "inline-flex", gap: "1rem", marginLeft: "1rem", borderLeft: "1px solid #eee", paddingLeft: "1rem" }}>
                  <Link to="/admin" className="navbar-link" style={{ color: "var(--color-gold)", fontWeight: "bold" }}>Admin</Link>
                </div>
              )}              <span style={{ fontWeight: "bold" }}>{user.name}</span>
              <button 
                onClick={logoutHandler}
                style={{ background: "none", border: "1px solid #000", padding: "5px 10px", cursor: "pointer" }}
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" style={{ textDecoration: "none", color: "#000" }}>Login</Link>
              <Link to="/register" style={{ textDecoration: "none", color: "#000" }}>Register</Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}

export default Navbar;