import { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { getOrderDetails, resetOrder, deliverOrder } from "../../features/orders/orderSlice";
import api from "../../services/api/axios";

function OrderDetails() {
  const { id } = useParams();
  const dispatch = useDispatch();
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
    if (image.startsWith("http") || image.startsWith("data:")) return image;
    return image.startsWith("/") ? image : `/${image}`;
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

      <div className="grid-2-cols">
        <div style={{ display: "flex", flexDirection: "column", gap: "3rem" }}>
          {/* Status Cards */}
          <div className="status-grid">
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
                   <div style={{ padding: "1.5rem", background: "#fff", border: "1px solid var(--color-gold)", fontSize: "0.85rem", lineHeight: "1.6" }}>
                     <p style={{ fontWeight: "700", marginBottom: "10px", color: "var(--color-gold)" }}>Settlement Instructions</p>
                     Please settle the total amount via Whish Money or Cash on Delivery. Contact us on WhatsApp with your Order Ref for instant confirmation:
                     <p style={{ fontWeight: "700", marginTop: "10px", fontSize: "1rem" }}>+961 XX XXX XXX</p>
                   </div>
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
