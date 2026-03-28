import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

function Admin() {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!user || !user.isAdmin) {
      navigate("/login");
    }
  }, [user, navigate]);

  const adminModules = [
    {
      title: "Product Inventory",
      description: "Manage your luxury collection, update stock, and refine piece details.",
      link: "/admin/products",
      label: "Open Collection"
    },
    {
      title: "Order Registry",
      description: "Review client statements, track transit status, and manage fulfillment.",
      link: "/admin/orders", // Currently points back to Admin for now, we'll split it soon
      label: "Review Registry"
    },
    {
      title: "Promotion Center",
      description: "Create and manage exclusive coupons and seasonal offerings.",
      link: "/admin/coupons",
      label: "Manage Offers"
    }
  ];

  return (
    <div className="container" style={{ padding: "5rem 2rem" }}>
      <div style={{ textAlign: "center", marginBottom: "5rem" }}>
        <span className="hero-subtitle">Executive Command</span>
        <h1 style={{ fontSize: "3.5rem", marginTop: "1rem" }}>Dashboard</h1>
      </div>

      <div className="admin-dashboard-grid">
        {adminModules.map((module, index) => (
          <div 
            key={index}
            style={{ 
              padding: "3.5rem 2.5rem", 
              background: "#fff", 
              border: "1px solid #eee",
              display: "flex",
              flexDirection: "column",
              gap: "1.5rem",
              transition: "var(--transition-smooth)"
            }}
            onMouseOver={(e) => e.currentTarget.style.borderColor = "var(--color-gold)"}
            onMouseOut={(e) => e.currentTarget.style.borderColor = "#eee"}
          >
            <h3 style={{ fontSize: "1.2rem", fontWeight: "700" }}>{module.title}</h3>
            <p style={{ color: "var(--color-grey-medium)", fontSize: "0.9rem", lineHeight: "1.6" }}>
              {module.description}
            </p>
            <Link 
              to={module.link} 
              className="btn-luxury" 
              style={{ marginTop: "auto", padding: "1.2rem", textAlign: "center", textDecoration: "none" }}
            >
              {module.label}
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Admin;
