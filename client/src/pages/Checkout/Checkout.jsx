import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getTotals, clearCart, applyCoupon, removeCoupon } from "../../features/cart/cartSlice";
import { createOrder, resetOrder } from "../../features/orders/orderSlice";
import { validateCoupon } from "../../services/couponService";
import api from "../../services/api/axios";

function Checkout() {
  const { cartItems, cartTotalAmount, coupon, discountAmount, finalAmount } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.auth);
  const { order, isSuccess, isError, message, isLoading: orderLoading } = useSelector((state) => state.order);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [shippingInfo, setShippingInfo] = useState({
    fullName: user ? user.name : "",
    address: "",
    city: "",
    country: "",
    phone: "",
  });

  const [paymentMethod, setPaymentMethod] = useState("Card");
  const [cardInfo, setCardInfo] = useState({
    cardNumber: "",
    expiryDate: "",
    cvc: "",
  });

  const [couponInput, setCouponInput] = useState("");
  const [couponError, setCouponError] = useState("");
  const [paymentError, setPaymentError] = useState("");
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  useEffect(() => {
    if (!user) navigate("/login");
    dispatch(getTotals());
    if (cartItems.length === 0 && !isSuccess) navigate("/cart");

    if (isSuccess && order) {
      const orderId = order._id;
      dispatch(clearCart());
      dispatch(resetOrder());
      navigate(`/orders/${orderId}`);
    }

  }, [user, cartItems, navigate, dispatch, isSuccess, order]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setShippingInfo({ ...shippingInfo, [name]: value });
    if (isError) dispatch(resetOrder());
  };

  const handleCardChange = (e) => {
    const { name, value } = e.target;
    // Basic formatting for card number
    if (name === "cardNumber") {
      const formattedValue = value.replace(/\D/g, '').substring(0, 16);
      setCardInfo({ ...cardInfo, [name]: formattedValue });
    } else if (name === "expiryDate") {
      const formattedValue = value.replace(/[^\d/]/g, '').substring(0, 5);
      setCardInfo({ ...cardInfo, [name]: formattedValue });
    } else if (name === "cvc") {
      const formattedValue = value.replace(/\D/g, '').substring(0, 4);
      setCardInfo({ ...cardInfo, [name]: formattedValue });
    }
  };

  const handleApplyCoupon = async () => {
    try {
      setCouponError("");
      const data = await validateCoupon(couponInput);
      dispatch(applyCoupon(data));
      dispatch(getTotals());
      setCouponInput("");
    } catch (err) {
      setCouponError(err.response?.data?.message || "Invalid coupon");
      dispatch(removeCoupon());
      dispatch(getTotals());
    }
  };

  const API_BASE_URL = process.env.REACT_APP_API_URL ? process.env.REACT_APP_API_URL.replace("/api", "") : "http://localhost:5000";

  const getImagePath = (image) => {
    if (!image) return "https://via.placeholder.com/200";
    return image.startsWith("http") ? image : `${API_BASE_URL}${image}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setPaymentError("");
    
    let paymentResult = null;

    if (paymentMethod === "Card") {
      setIsProcessingPayment(true);
      try {
        const { data } = await api.post("/payments/mock-card", {
          cardInfo,
          amount: finalAmount,
        });
        paymentResult = {
          id: data.transactionId,
          status: data.status,
          update_time: new Date().toISOString(),
        };
      } catch (err) {
        setPaymentError(err.response?.data?.message || "Payment processing failed. Please check your card details.");
        setIsProcessingPayment(false);
        return;
      }
      setIsProcessingPayment(false);
    }

    dispatch(createOrder({
      orderItems: cartItems.map(item => ({
        ...item,
        productId: item.productId // Ensure it's passed correctly
      })),
      shippingAddress: shippingInfo,
      paymentMethod: paymentMethod,
      itemsPrice: cartTotalAmount,
      shippingPrice: 0,
      taxPrice: 0,
      totalPrice: finalAmount,
      coupon: coupon ? { code: coupon.code, discountAmount: discountAmount } : null,
      paymentResult: paymentResult,
    }));
  };

  if (cartItems.length === 0 && !isSuccess) return null;

  return (
    <div className="container" style={{ padding: "5rem 2rem" }}>
      <div style={{ textAlign: "center", marginBottom: "4rem" }}>
        <span className="hero-subtitle">Final Step</span>
        <h1 style={{ fontSize: "3rem", marginTop: "1rem" }}>Checkout</h1>
      </div>

      {(isError || paymentError) && (
        <div style={{ 
          padding: "1rem 2rem", background: "#fee", color: "#d00",
          marginBottom: "2rem", borderLeft: "4px solid #d00", fontSize: "0.9rem"
        }}>
          {paymentError || message || "We encountered an issue while processing your order. Please verify your details."}
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "1fr 400px", gap: "5rem" }}>
        {/* Left Side: Shipping & Payment */}
        <div>
          <form onSubmit={handleSubmit}>
            <section style={{ padding: "0", marginBottom: "4rem" }}>
              <h3 style={{ fontSize: "0.8rem", textTransform: "uppercase", letterSpacing: "0.2em", marginBottom: "2rem", borderBottom: "1px solid #eee", paddingBottom: "1rem" }}>
                Shipping Details
              </h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                <div>
                  <label style={{ display: "block", fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "0.5rem", fontWeight: "600" }}>Full Name</label>
                  <input type="text" name="fullName" required value={shippingInfo.fullName} onChange={handleInputChange} style={{ width: "100%", padding: "1rem", border: "1px solid #eee", background: "var(--color-grey-light)", outline: "none" }} />
                </div>
                
                <div>
                  <label style={{ display: "block", fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "0.5rem", fontWeight: "600" }}>Address</label>
                  <input type="text" name="address" required value={shippingInfo.address} onChange={handleInputChange} style={{ width: "100%", padding: "1rem", border: "1px solid #eee", background: "var(--color-grey-light)", outline: "none" }} />
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
                  <div>
                    <label style={{ display: "block", fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "0.5rem", fontWeight: "600" }}>City</label>
                    <input type="text" name="city" required value={shippingInfo.city} onChange={handleInputChange} style={{ width: "100%", padding: "1rem", border: "1px solid #eee", background: "var(--color-grey-light)", outline: "none" }} />
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "0.5rem", fontWeight: "600" }}>Country</label>
                    <input type="text" name="country" required value={shippingInfo.country} onChange={handleInputChange} style={{ width: "100%", padding: "1rem", border: "1px solid #eee", background: "var(--color-grey-light)", outline: "none" }} />
                  </div>
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "0.5rem", fontWeight: "600" }}>Phone Number</label>
                  <input type="tel" name="phone" required value={shippingInfo.phone} onChange={handleInputChange} style={{ width: "100%", padding: "1rem", border: "1px solid #eee", background: "var(--color-grey-light)", outline: "none" }} />
                </div>
              </div>
            </section>

            <section style={{ padding: "0", marginBottom: "4rem" }}>
              <h3 style={{ fontSize: "0.8rem", textTransform: "uppercase", letterSpacing: "0.2em", marginBottom: "2rem", borderBottom: "1px solid #eee", paddingBottom: "1rem" }}>
                Payment Method
              </h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                <label style={{ 
                  display: "flex", 
                  alignItems: "center", 
                  gap: "1rem", 
                  padding: "1.5rem", 
                  background: paymentMethod === "Card" ? "var(--color-cream)" : "#fff",
                  border: `1px solid ${paymentMethod === "Card" ? "var(--color-gold)" : "#eee"}`,
                  cursor: "pointer"
                }}>
                  <input type="radio" name="payment" value="Card" checked={paymentMethod === "Card"} onChange={(e) => setPaymentMethod(e.target.value)} />
                  <div style={{ flex: 1 }}>
                    <span style={{ display: "block", fontWeight: "600", fontSize: "0.9rem" }}>Visa / Mastercard</span>
                    <span style={{ fontSize: "0.75rem", color: "var(--color-grey-medium)" }}>Secure simulated transaction (Mock)</span>
                  </div>
                  <div style={{ display: "flex", gap: "0.5rem" }}>
                    <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" alt="Visa" style={{ height: "15px" }} />
                    <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="MC" style={{ height: "15px" }} />
                  </div>
                </label>

                {paymentMethod === "Card" && (
                  <div style={{ padding: "1.5rem", background: "#fcfcfc", border: "1px solid #eee", marginTop: "-1rem", display: "flex", flexDirection: "column", gap: "1.2rem" }}>
                    <div>
                      <label style={{ display: "block", fontSize: "0.65rem", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "0.4rem" }}>Card Number</label>
                      <input type="text" name="cardNumber" placeholder="0000 0000 0000 0000" required={paymentMethod === "Card"} value={cardInfo.cardNumber} onChange={handleCardChange} style={{ width: "100%", padding: "0.8rem", border: "1px solid #eee", outline: "none" }} />
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                      <div>
                        <label style={{ display: "block", fontSize: "0.65rem", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "0.4rem" }}>Expiry Date</label>
                        <input type="text" name="expiryDate" placeholder="MM/YY" required={paymentMethod === "Card"} value={cardInfo.expiryDate} onChange={handleCardChange} style={{ width: "100%", padding: "0.8rem", border: "1px solid #eee", outline: "none" }} />
                      </div>
                      <div>
                        <label style={{ display: "block", fontSize: "0.65rem", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "0.4rem" }}>CVC</label>
                        <input type="text" name="cvc" placeholder="123" required={paymentMethod === "Card"} value={cardInfo.cvc} onChange={handleCardChange} style={{ width: "100%", padding: "0.8rem", border: "1px solid #eee", outline: "none" }} />
                      </div>
                    </div>
                  </div>
                )}

                <label style={{ 
                  display: "flex", 
                  alignItems: "center", 
                  gap: "1rem", 
                  padding: "1.5rem", 
                  background: paymentMethod === "Cash on Delivery" ? "var(--color-cream)" : "#fff",
                  border: `1px solid ${paymentMethod === "Cash on Delivery" ? "var(--color-gold)" : "#eee"}`,
                  cursor: "pointer"
                }}>
                  <input type="radio" name="payment" value="Cash on Delivery" checked={paymentMethod === "Cash on Delivery"} onChange={(e) => setPaymentMethod(e.target.value)} />
                  <div>
                    <span style={{ display: "block", fontWeight: "600", fontSize: "0.9rem" }}>Cash on Delivery</span>
                    <span style={{ fontSize: "0.75rem", color: "var(--color-grey-medium)" }}>Pay when your luxury pieces arrive.</span>
                  </div>
                </label>
              </div>
            </section>

            <button 
              type="submit" 
              className="btn-luxury" 
              disabled={orderLoading || isProcessingPayment}
              style={{ width: "100%", padding: "1.5rem", opacity: (orderLoading || isProcessingPayment) ? 0.7 : 1, cursor: (orderLoading || isProcessingPayment) ? "not-allowed" : "pointer" }}
            >
              {isProcessingPayment ? "Verifying Card..." : orderLoading ? "Processing Order..." : "Complete Order"}
            </button>
          </form>
        </div>

        {/* Right Side: Order Summary */}
        <div style={{ position: "sticky", top: "120px", height: "fit-content" }}>
          <div style={{ background: "#fafafa", padding: "2.5rem", border: "1px solid #eee" }}>
            <h3 style={{ fontSize: "0.8rem", textTransform: "uppercase", letterSpacing: "0.2em", marginBottom: "2rem" }}>Your Order</h3>
            
            <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem", marginBottom: "2rem" }}>
              {cartItems.map((item) => (
                <div key={`${item.productId}-${item.size}-${item.color}`} style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
                  <img src={getImagePath(item.image)} alt={item.name} style={{ width: "60px", height: "75px", objectFit: "cover" }} />
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: "0.85rem", fontWeight: "600", margin: "0" }}>{item.name}</p>
                    <p style={{ fontSize: "0.75rem", color: "var(--color-grey-medium)", margin: "3px 0" }}>Qty: {item.quantity} | {item.size}</p>
                  </div>
                  <p style={{ fontSize: "0.85rem", fontWeight: "600" }}>${(item.price * item.quantity).toLocaleString()}</p>
                </div>
              ))}
            </div>

            <div style={{ borderTop: "1px solid #eee", paddingTop: "1.5rem", marginBottom: "1.5rem" }}>
              <div style={{ display: "flex", gap: "0.5rem" }}>
                <input 
                  type="text" 
                  value={couponInput} 
                  onChange={(e) => setCouponInput(e.target.value)} 
                  placeholder="Promo Code" 
                  style={{ flex: 1, padding: "0.8rem", border: "1px solid #eee", fontSize: "0.8rem", outline: "none" }} 
                />
                <button type="button" onClick={handleApplyCoupon} style={{ padding: "0 1.5rem", background: "var(--color-black)", color: "#fff", fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.1em" }}>Apply</button>
              </div>
              {couponError && <p style={{ color: "#d00", fontSize: "0.7rem", marginTop: "0.5rem" }}>{couponError}</p>}
              {coupon && (
                <div style={{ marginTop: "1rem", padding: "0.8rem", background: "#f0f7f0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: "0.75rem", color: "#2e7d32" }}>Code <strong>{coupon.code}</strong> Applied</span>
                  <button type="button" onClick={() => dispatch(removeCoupon())} style={{ color: "#d00", fontSize: "0.7rem" }}>Remove</button>
                </div>
              )}
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "1rem", borderTop: "1px solid #eee", paddingTop: "1.5rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.85rem" }}>
                <span style={{ color: "var(--color-grey-medium)" }}>Subtotal</span>
                <span>${cartTotalAmount.toLocaleString()}</span>
              </div>
              {discountAmount > 0 && (
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.85rem", color: "#d00" }}>
                  <span>Discount</span>
                  <span>-${discountAmount.toLocaleString()}</span>
                </div>
              )}
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.85rem" }}>
                <span style={{ color: "var(--color-grey-medium)" }}>Shipping</span>
                <span style={{ color: "var(--color-gold)" }}>Free</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "1.2rem", fontWeight: "700", marginTop: "1rem", paddingTop: "1rem", borderTop: "2px solid var(--color-black)" }}>
                <span>Total</span>
                <span>${finalAmount.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Checkout;
