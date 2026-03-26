import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { listOrders } from "../../features/orders/orderSlice";

function OrderList() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user } = useSelector((state) => state.auth);
  const { orders, isLoading, isError, message } = useSelector(
    (state) => state.order
  );

  useEffect(() => {
    if (user && user.isAdmin) {
      dispatch(listOrders());
    } else {
      navigate("/login");
    }
  }, [dispatch, user, navigate]);

  if (isLoading) return (
    <div className="container" style={{ padding: "10rem", textAlign: "center" }}>
      <p className="hero-subtitle">Accessing Registry...</p>
    </div>
  );

  return (
    <div className="container" style={{ padding: "5rem 2rem" }}>
      <div style={{ marginBottom: "4rem" }}>
        <span className="hero-subtitle">Executive Command</span>
        <h1 style={{ fontSize: "2.5rem", marginTop: "1rem" }}>Order Registry</h1>
      </div>

      {isError && <div style={{ color: "#d00", marginBottom: "2rem" }}>{message}</div>}

      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        <div style={{ 
          display: "grid", 
          gridTemplateColumns: "1fr 1fr 1fr 1fr 1fr 1fr 120px", 
          padding: "1rem 2rem", 
          fontSize: "0.7rem", 
          textTransform: "uppercase", 
          letterSpacing: "0.15em", 
          color: "var(--color-grey-medium)",
          borderBottom: "1px solid #eee"
        }}>
          <span>Order Ref</span>
          <span>Client</span>
          <span>Date</span>
          <span>Investment</span>
          <span>Payment</span>
          <span>Status</span>
          <span style={{ textAlign: "right" }}>Action</span>
        </div>

        {orders.map((order) => (
          <div 
            key={order._id} 
            style={{ 
              display: "grid", 
              gridTemplateColumns: "1fr 1fr 1fr 1fr 1fr 1fr 120px", 
              alignItems: "center", 
              padding: "1.5rem 2rem", 
              background: "#fff", 
              border: "1px solid #f4f4f4",
              transition: "var(--transition-smooth)"
            }}
            onMouseOver={(e) => e.currentTarget.style.borderColor = "var(--color-gold)"}
            onMouseOut={(e) => e.currentTarget.style.borderColor = "#f4f4f4"}
          >
            <span style={{ fontWeight: "700", fontSize: "0.85rem" }}>#{order._id.substring(order._id.length-8).toUpperCase()}</span>
            <span style={{ fontSize: "0.9rem" }}>{order.user && order.user.name}</span>
            <span style={{ fontSize: "0.85rem", color: "var(--color-grey-dark)" }}>{new Date(order.createdAt).toLocaleDateString()}</span>
            <span style={{ fontWeight: "600" }}>${order.totalPrice.toLocaleString()}</span>
            <span>
              {order.isPaid ? (
                <span style={{ color: "#2e7d32", fontSize: "0.75rem", fontWeight: "700", textTransform: "uppercase" }}>Settled</span>
              ) : (
                <span style={{ color: "#d00", fontSize: "0.75rem", fontWeight: "700", textTransform: "uppercase" }}>Pending</span>
              )}
            </span>
            <span>
              {order.isDelivered ? (
                <span style={{ color: "#2e7d32", fontSize: "0.75rem", fontWeight: "700", textTransform: "uppercase" }}>Arrived</span>
              ) : (
                <span style={{ color: "var(--color-gold)", fontSize: "0.75rem", fontWeight: "700", textTransform: "uppercase" }}>In Transit</span>
              )}
            </span>
            <div style={{ textAlign: "right" }}>
              <Link 
                to={`/orders/${order._id}`}
                style={{ fontSize: "0.75rem", textTransform: "uppercase", fontWeight: "700", borderBottom: "1px solid #000" }}
              >
                Review
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default OrderList;
