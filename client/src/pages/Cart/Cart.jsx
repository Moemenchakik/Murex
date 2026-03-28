import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { 
  removeFromCart, 
  increaseCart, 
  decreaseCart, 
  clearCart, 
  getTotals 
} from "../../features/cart/cartSlice";

function Cart() {
  const cart = useSelector((state) => state.cart);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(getTotals());
  }, [cart, dispatch]);

  const handleRemove = (item) => {
    dispatch(removeFromCart(item));
  };

  const handleDecrease = (item) => {
    dispatch(decreaseCart(item));
  };

  const handleIncrease = (item) => {
    dispatch(increaseCart(item));
  };

  return (
    <div className="container" style={{ padding: "5rem 2rem" }}>
      <div style={{ textAlign: "center", marginBottom: "4rem" }}>
        <span className="hero-subtitle">Your Selection</span>
        <h1 style={{ fontSize: "3rem", marginTop: "1rem" }}>Shopping Cart</h1>
      </div>

      {cart.cartItems.length === 0 ? (
        <div style={{ textAlign: "center", padding: "5rem 0" }}>
          <p style={{ color: "var(--color-grey-medium)", marginBottom: "2rem" }}>Your selection is currently empty.</p>
          <Link to="/shop" className="btn-luxury">Explore Collection</Link>
        </div>
      ) : (
        <div className="grid-2-cols" style={{ alignItems: "start" }}>
          {/* Cart Items List */}
          <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
            <div style={{ 
              display: "grid", 
              gridTemplateColumns: "1fr 120px 120px 100px", 
              paddingBottom: "1rem", 
              borderBottom: "1px solid #eee",
              fontSize: "0.75rem",
              textTransform: "uppercase",
              letterSpacing: "0.15em",
              color: "var(--color-grey-medium)",
              fontWeight: "600"
            }}>
              <span>Product</span>
              <span style={{ textAlign: "center" }}>Price</span>
              <span style={{ textAlign: "center" }}>Quantity</span>
              <span style={{ textAlign: "right" }}>Total</span>
            </div>

            {cart.cartItems.map((item) => (
              <div key={`${item.productId}-${item.size}-${item.color}`} style={{ 
                display: "grid", 
                gridTemplateColumns: "1fr 120px 120px 100px", 
                alignItems: "center",
                paddingBottom: "2rem",
                borderBottom: "1px solid #f9f9f9"
              }}>
                {/* Product Detail */}
                <div style={{ display: "flex", gap: "2rem" }}>
                  <img 
                    src={item.image || "https://via.placeholder.com/120"} 
                    alt={item.name} 
                    style={{ width: "120px", height: "150px", objectFit: "cover", background: "var(--color-grey-light)" }} 
                  />
                  <div style={{ display: "flex", flexDirection: "column", justifyContent: "center" }}>
                    <h4 style={{ fontSize: "1.1rem", marginBottom: "0.5rem", fontFamily: "var(--font-serif)" }}>{item.name}</h4>
                    <p style={{ fontSize: "0.85rem", color: "var(--color-grey-medium)", marginBottom: "1rem" }}>
                      Size: {item.size} <span style={{ margin: "0 10px", color: "#ddd" }}>|</span> Color: {item.color}
                    </p>
                    <button 
                      onClick={() => handleRemove(item)}
                      style={{ 
                        fontSize: "0.7rem", 
                        textTransform: "uppercase", 
                        letterSpacing: "0.1em", 
                        color: "#d00", 
                        textAlign: "left",
                        textDecoration: "underline"
                      }}
                    >
                      Remove Piece
                    </button>
                  </div>
                </div>

                {/* Price */}
                <div style={{ textAlign: "center", fontSize: "1rem" }}>
                  ${item.price.toLocaleString()}
                </div>

                {/* Quantity Control */}
                <div style={{ display: "flex", justifyContent: "center" }}>
                  <div style={{ 
                    display: "flex", 
                    alignItems: "center", 
                    border: "1px solid #eee", 
                    padding: "5px" 
                  }}>
                    <button 
                      onClick={() => handleDecrease(item)} 
                      style={{ padding: "5px 10px", fontSize: "1.2rem", color: "var(--color-grey-dark)" }}
                    >-</button>
                    <span style={{ padding: "0 15px", fontSize: "0.9rem", fontWeight: "600" }}>{item.quantity}</span>
                    <button 
                      onClick={() => handleIncrease(item)} 
                      style={{ padding: "5px 10px", fontSize: "1.2rem", color: "var(--color-grey-dark)" }}
                    >+</button>
                  </div>
                </div>

                {/* Total */}
                <div style={{ textAlign: "right", fontWeight: "700", fontSize: "1.1rem" }}>
                  ${(item.price * item.quantity).toLocaleString()}
                </div>
              </div>
            ))}

            <div style={{ marginTop: "1rem" }}>
              <Link to="/shop" style={{ 
                fontSize: "0.8rem", 
                textTransform: "uppercase", 
                letterSpacing: "0.1em", 
                color: "var(--color-black)",
                fontWeight: "600",
                borderBottom: "1px solid var(--color-black)",
                paddingBottom: "5px"
              }}>
                &larr; Continue Exploring
              </Link>
            </div>
          </div>

          {/* Order Summary Card */}
          <div style={{ 
            background: "var(--color-cream)", 
            padding: "2.5rem", 
            position: "sticky", 
            top: "120px" 
          }}>
            <h3 style={{ 
              fontSize: "0.85rem", 
              textTransform: "uppercase", 
              letterSpacing: "0.2em", 
              marginBottom: "2rem",
              borderBottom: "1px solid #e0d8c8",
              paddingBottom: "1rem"
            }}>Order Summary</h3>
            
            <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem", marginBottom: "2rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.9rem" }}>
                <span style={{ color: "var(--color-grey-medium)" }}>Subtotal</span>
                <span>${cart.cartTotalAmount.toLocaleString()}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.9rem" }}>
                <span style={{ color: "var(--color-grey-medium)" }}>Shipping</span>
                <span style={{ color: "var(--color-gold)", fontWeight: "500" }}>Complimentary</span>
              </div>
              <div style={{ 
                display: "flex", 
                justifyContent: "space-between", 
                fontSize: "1.2rem", 
                fontWeight: "700",
                marginTop: "1rem",
                paddingTop: "1.5rem",
                borderTop: "1px solid #e0d8c8"
              }}>
                <span>Total</span>
                <span>${cart.cartTotalAmount.toLocaleString()}</span>
              </div>
            </div>

            <button 
              onClick={() => navigate("/checkout")}
              className="btn-luxury"
              style={{ width: "100%", padding: "1.2rem" }}
            >
              Checkout Now
            </button>
            
            <p style={{ 
              fontSize: "0.75rem", 
              color: "var(--color-grey-medium)", 
              textAlign: "center", 
              marginTop: "1.5rem",
              lineHeight: "1.6"
            }}>
              Taxes and duties calculated at next step. 
              Secure checkout guaranteed.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default Cart;
