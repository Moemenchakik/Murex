import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { listMyOrders } from "../../features/orders/orderSlice";

function Orders() {
  const dispatch = useDispatch();

  const { orders, isLoading, isError, message } = useSelector(
    (state) => state.order
  );

  useEffect(() => {
    dispatch(listMyOrders());
  }, [dispatch]);

  if (isLoading) return (
    <div className="container" style={{ padding: "10rem", textAlign: "center" }}>
      <p className="hero-subtitle">Retrieving History...</p>
    </div>
  );

  if (isError) return (
    <div className="container" style={{ padding: "10rem", textAlign: "center" }}>
      <h2 style={{ color: "#d00" }}>{message}</h2>
      <Link to="/" className="btn-luxury" style={{ marginTop: "2rem" }}>Return Home</Link>
    </div>
  );

  return (
    <div className="container" style={{ padding: "5rem 2rem" }}>
      <div style={{ textAlign: "center", marginBottom: "5rem" }}>
        <span className="hero-subtitle">Archive</span>
        <h1 style={{ fontSize: "3rem", marginTop: "1rem" }}>Purchase History</h1>
      </div>

      {orders.length === 0 ? (
        <div style={{ textAlign: "center", padding: "5rem 0" }}>
          <p style={{ color: "var(--color-grey-medium)", marginBottom: "2rem" }}>You haven't placed any orders yet.</p>
          <Link to="/shop" className="btn-luxury">Start Exploring</Link>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "2.5rem" }}>
          {orders.map((order) => (
            <div 
              key={order._id} 
              style={{ 
                border: "1px solid #eee", 
                padding: "2.5rem", 
                display: "grid", 
                gridTemplateColumns: "1.5fr 1fr 1fr 1fr 150px", 
                alignItems: "center",
                transition: "var(--transition-smooth)",
                background: "#fff"
              }}
              onMouseOver={(e) => e.currentTarget.style.borderColor = "var(--color-gold)"}
              onMouseOut={(e) => e.currentTarget.style.borderColor = "#eee"}
            >
              {/* Order ID & Date */}
              <div>
                <span style={{ fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.15em", color: "var(--color-grey-medium)" }}>Order Ref</span>
                <p style={{ fontWeight: "700", fontSize: "0.95rem", margin: "5px 0" }}>#{order._id.substring(order._id.length - 8).toUpperCase()}</p>
                <p style={{ fontSize: "0.85rem", color: "var(--color-grey-dark)" }}>{new Date(order.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
              </div>

              {/* Amount */}
              <div style={{ textAlign: "center" }}>
                <span style={{ fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.15em", color: "var(--color-grey-medium)" }}>Investment</span>
                <p style={{ fontWeight: "700", fontSize: "1.1rem", marginTop: "5px" }}>${order.totalPrice.toLocaleString()}</p>
              </div>

              {/* Payment Status */}
              <div style={{ textAlign: "center" }}>
                <span style={{ fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.15em", color: "var(--color-grey-medium)" }}>Payment</span>
                <div style={{ marginTop: "8px" }}>
                  {order.isPaid ? (
                    <span style={{ fontSize: "0.75rem", textTransform: "uppercase", color: "#2e7d32", fontWeight: "700", letterSpacing: "0.05em" }}>Confirmed</span>
                  ) : (
                    <span style={{ fontSize: "0.75rem", textTransform: "uppercase", color: "#d00", fontWeight: "700", letterSpacing: "0.05em" }}>Pending</span>
                  )}
                </div>
              </div>

              {/* Shipping Status */}
              <div style={{ textAlign: "center" }}>
                <span style={{ fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.15em", color: "var(--color-grey-medium)" }}>Delivery</span>
                <div style={{ marginTop: "8px" }}>
                  {order.isDelivered ? (
                    <span style={{ fontSize: "0.75rem", textTransform: "uppercase", color: "#2e7d32", fontWeight: "700", letterSpacing: "0.05em" }}>Arrived</span>
                  ) : (
                    <span style={{ fontSize: "0.75rem", textTransform: "uppercase", color: "var(--color-gold)", fontWeight: "700", letterSpacing: "0.05em" }}>Processing</span>
                  )}
                </div>
              </div>

              {/* Action */}
              <div style={{ textAlign: "right" }}>
                <Link 
                  to={`/orders/${order._id}`}
                  className="btn-outline"
                  style={{ padding: "0.8rem 1.5rem", fontSize: "0.7rem", width: "100%", textAlign: "center" }}
                >
                  View Detail
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Orders;
