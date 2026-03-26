import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { getOrderDetails, resetOrder, payOrder, deliverOrder } from "../../features/orders/orderSlice";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import api from "../../services/api/axios";

// Placeholder keys - ensure you update these in your .env for production
const stripePromise = loadStripe("pk_test_your_publishable_key");
const PAYPAL_CLIENT_ID = "your_paypal_client_id";

function CheckoutForm({ orderId, amount }) {
  const stripe = useStripe();
  const elements = useElements();
  const dispatch = useDispatch();
  
  const [error, setError] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [succeeded, setSucceeded] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setProcessing(true);
    if (!stripe || !elements) return;

    try {
      const { data: { clientSecret } } = await api.post("/payments/create-payment-intent", { amount });
      const payload = await stripe.confirmCardPayment(clientSecret, {
        payment_method: { card: elements.getElement(CardElement) },
      });

      if (payload.error) {
        setError(`Payment failed: ${payload.error.message}`);
        setProcessing(false);
      } else {
        setError(null);
        setProcessing(false);
        setSucceeded(true);
        dispatch(payOrder({
          orderId,
          paymentResult: {
            id: payload.paymentIntent.id,
            status: payload.paymentIntent.status,
            update_time: new Date().toISOString(),
            email_address: payload.paymentIntent.receipt_email || "customer@example.com",
          }
        }));
      }
    } catch (err) {
      setError("Payment processing error");
      setProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div style={{ padding: "1rem", border: "1px solid #eee", marginBottom: "1rem" }}>
        <CardElement options={{ style: { base: { fontSize: "16px", fontFamily: "var(--font-sans)" } } }} />
      </div>
      <button disabled={processing || succeeded || !stripe} className="btn-luxury" style={{ width: "100%", padding: "1rem" }}>
        {processing ? "Authenticating..." : "Authorize Payment"}
      </button>
      {error && <div style={{ color: "#d00", marginTop: "1rem", fontSize: "0.8rem" }}>{error}</div>}
    </form>
  );
}

function OrderDetails() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const [paymentMethod, setPaymentMethod] = useState("stripe");
  const { order, isLoading, isError, message } = useSelector((state) => state.order);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(getOrderDetails(id));
    return () => dispatch(resetOrder());
  }, [id, dispatch]);

  const deliverHandler = () => dispatch(deliverOrder(id));

  const API_BASE_URL = process.env.REACT_APP_API_URL ? process.env.REACT_APP_API_URL.replace("/api", "") : "http://localhost:5000";

  const getImagePath = (image) => {
    if (!image) return "https://via.placeholder.com/200";
    return image.startsWith("http") ? image : `${API_BASE_URL}${image}`;
  };

  if (isLoading) return (
    <div className="container" style={{ padding: "10rem", textAlign: "center" }}>
      <p className="hero-subtitle">Generating Statement...</p>
    </div>
  );

  if (isError) return <div className="container" style={{ padding: "5rem", textAlign: "center" }}>{message}</div>;
  if (!order) return null;

  return (
    <div className="container" style={{ padding: "5rem 2rem" }}>
      <div style={{ marginBottom: "4rem" }}>
        <span className="hero-subtitle">Order Statement</span>
        <h1 style={{ fontSize: "2.5rem", marginTop: "1rem" }}>Reference: #{order._id.substring(order._id.length-8).toUpperCase()}</h1>
        <p style={{ color: "var(--color-grey-medium)", marginTop: "0.5rem" }}>Placed on {new Date(order.createdAt).toLocaleDateString('en-US', { dateStyle: 'full' })}</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 400px", gap: "5rem" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "3rem" }}>
          {/* Status Cards */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem" }}>
            <div style={{ padding: "2rem", background: order.isPaid ? "var(--color-cream)" : "#fffaf0", border: "1px solid #eee" }}>
              <h4 style={{ fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.15em", marginBottom: "1rem" }}>Payment Status</h4>
              <p style={{ fontSize: "1.1rem", fontWeight: "700" }}>{order.isPaid ? "Paid in Full" : "Awaiting Settlement"}</p>
              <p style={{ fontSize: "0.8rem", color: "var(--color-grey-medium)", marginTop: "5px" }}>
                {order.isPaid ? `Processed on ${new Date(order.paidAt).toLocaleDateString()}` : `Method: ${order.paymentMethod}`}
              </p>
            </div>
            <div style={{ padding: "2rem", background: order.isDelivered ? "var(--color-cream)" : "#f9f9f9", border: "1px solid #eee" }}>
              <h4 style={{ fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.15em", marginBottom: "1rem" }}>Delivery Status</h4>
              <p style={{ fontSize: "1.1rem", fontWeight: "700" }}>{order.isDelivered ? "Delivered" : "In Transit"}</p>
              <p style={{ fontSize: "0.8rem", color: "var(--color-grey-medium)", marginTop: "5px" }}>
                {order.isDelivered ? `Arrived on ${new Date(order.deliveredAt).toLocaleDateString()}` : "Estimated 3-5 Business Days"}
              </p>
            </div>
          </div>

          {/* Shipping Address */}
          <section style={{ padding: "0" }}>
            <h3 style={{ fontSize: "0.8rem", textTransform: "uppercase", letterSpacing: "0.2em", marginBottom: "1.5rem", borderBottom: "1px solid #eee", paddingBottom: "1rem" }}>Shipping Destination</h3>
            <div style={{ fontSize: "1rem", lineHeight: "1.8", color: "var(--color-grey-dark)" }}>
              <p style={{ fontWeight: "700", color: "var(--color-black)" }}>{order.shippingAddress.fullName}</p>
              <p>{order.shippingAddress.address}</p>
              <p>{order.shippingAddress.city}</p>
              <p>{order.shippingAddress.country}</p>
              <p style={{ marginTop: "1rem" }}>Contact: {order.shippingAddress.phone}</p>
            </div>
          </section>

          {/* Order Items */}
          <section style={{ padding: "0" }}>
            <h3 style={{ fontSize: "0.8rem", textTransform: "uppercase", letterSpacing: "0.2em", marginBottom: "1.5rem", borderBottom: "1px solid #eee", paddingBottom: "1rem" }}>Selected Pieces</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
              {order.orderItems.map((item, index) => (
                <div key={index} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div style={{ display: "flex", gap: "2rem", alignItems: "center" }}>
                    <img src={getImagePath(item.image)} alt={item.name} style={{ width: "80px", height: "100px", objectFit: "cover", background: "var(--color-grey-light)" }} />
                    <div>
                      <Link to={`/product/${item.product}`} style={{ fontWeight: "700", fontSize: "1rem" }}>{item.name}</Link>
                      <p style={{ fontSize: "0.8rem", color: "var(--color-grey-medium)", marginTop: "5px" }}>Size: {item.size} | Color: {item.color}</p>
                      <p style={{ fontSize: "0.85rem", marginTop: "5px" }}>{item.quantity} x ${item.price.toLocaleString()}</p>
                    </div>
                  </div>
                  <p style={{ fontWeight: "700" }}>${(item.quantity * item.price).toLocaleString()}</p>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Financial Summary Sidebar */}
        <div style={{ position: "sticky", top: "120px", height: "fit-content" }}>
          <div style={{ background: "var(--color-cream)", padding: "2.5rem" }}>
            <h3 style={{ fontSize: "0.8rem", textTransform: "uppercase", letterSpacing: "0.2em", marginBottom: "2rem" }}>Order Summary</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "1.2rem", borderBottom: "1px solid #e0d8c8", paddingBottom: "1.5rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.9rem" }}>
                <span style={{ color: "var(--color-grey-medium)" }}>Subtotal</span>
                <span>${order.itemsPrice.toLocaleString()}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.9rem" }}>
                <span style={{ color: "var(--color-grey-medium)" }}>Shipping</span>
                <span style={{ color: "var(--color-gold)" }}>Complimentary</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "1.2rem", fontWeight: "700", marginTop: "0.5rem" }}>
                <span>Total</span>
                <span>${order.totalPrice.toLocaleString()}</span>
              </div>
            </div>

            {/* Admin Action */}
            {user && user.isAdmin && (
              <button 
                onClick={deliverHandler} 
                className="btn-luxury" 
                style={{ 
                  width: "100%", 
                  marginTop: "2rem",
                  background: order.isDelivered ? "var(--color-black)" : "var(--color-gold)",
                  color: "#fff",
                  border: "none"
                }}
              >
                {order.isDelivered ? "Reset to Transit" : "Mark as Dispatched"}
              </button>
            )}

            {/* Payment Interaction */}
            {!order.isPaid && !user.isAdmin && (
               <div style={{ marginTop: "2rem" }}>
                 {order.paymentMethod === "Cash on Delivery" ? (
                   <div style={{ padding: "1.5rem", background: "#fff", border: "1px solid var(--color-gold)", fontSize: "0.85rem", lineHeight: "1.6" }}>
                     <p style={{ fontWeight: "700", marginBottom: "10px", color: "var(--color-gold)" }}>Whish Money / WhatsApp Payment</p>
                     Please transfer the total amount to our business line. Contact us on WhatsApp with your Order Ref for instant confirmation:
                     <p style={{ fontWeight: "700", marginTop: "10px", fontSize: "1rem" }}>+961 XX XXX XXX</p>
                   </div>
                 ) : (
                   <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                     <div style={{ display: "flex", gap: "1rem" }}>
                        <button onClick={() => setPaymentMethod("stripe")} style={{ flex: 1, padding: "0.5rem", borderBottom: paymentMethod === "stripe" ? "2px solid #000" : "none", fontWeight: paymentMethod === "stripe" ? "700" : "400" }}>Stripe</button>
                        <button onClick={() => setPaymentMethod("paypal")} style={{ flex: 1, padding: "0.5rem", borderBottom: paymentMethod === "paypal" ? "2px solid #000" : "none", fontWeight: paymentMethod === "paypal" ? "700" : "400" }}>PayPal</button>
                     </div>
                     {paymentMethod === "stripe" ? (
                       <Elements stripe={stripePromise}><CheckoutForm orderId={order._id} amount={order.totalPrice} /></Elements>
                     ) : (
                       <PayPalScriptProvider options={{ "client-id": PAYPAL_CLIENT_ID }}>
                         <PayPalButtons style={{ layout: "vertical" }} />
                       </PayPalScriptProvider>
                     )}
                   </div>
                 )}
               </div>
            )}
          </div>
          <Link to={user.isAdmin ? "/admin/orders" : "/orders"} style={{ display: "block", textAlign: "center", marginTop: "2rem", fontSize: "0.8rem", textTransform: "uppercase", letterSpacing: "0.1em", borderBottom: "1px solid #000", width: "fit-content", margin: "2rem auto 0 auto" }}>Back to Archive</Link>
        </div>
      </div>
    </div>
  );
}

export default OrderDetails;
