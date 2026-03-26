import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getCoupons, createCoupon, deleteCoupon } from "../../services/couponService";

function CouponList() {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const [formData, setFormData] = useState({
    code: "",
    discountType: "percentage",
    discountValue: 0,
    expiryDate: "",
    usageLimit: "",
  });

  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  const fetchCouponsData = async () => {
    try {
      setLoading(true);
      const data = await getCoupons();
      setCoupons(data);
      setLoading(false);
    } catch (err) {
      setError("Failed to fetch coupons");
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user || !user.isAdmin) {
      navigate("/login");
    } else {
      fetchCouponsData();
    }
  }, [user, navigate]);

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      await createCoupon({
        ...formData,
        usageLimit: formData.usageLimit === "" ? null : Number(formData.usageLimit),
      });
      setFormData({
        code: "",
        discountType: "percentage",
        discountValue: 0,
        expiryDate: "",
        usageLimit: "",
      });
      setSuccessMessage("Promotional code successfully activated.");
      setTimeout(() => setSuccessMessage(""), 3000);
      fetchCouponsData();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create coupon");
    }
  };

  const deleteHandler = async (id) => {
    if (window.confirm("Are you sure you want to retire this promotional code?")) {
      try {
        await deleteCoupon(id);
        fetchCouponsData();
      } catch (err) {
        setError("Failed to delete coupon");
      }
    }
  };

  if (loading) return <div className="container" style={{ padding: "10rem", textAlign: "center" }}><p className="hero-subtitle">Accessing Incentive Suite...</p></div>;

  return (
    <div className="container" style={{ padding: "5rem 2rem" }}>
      {successMessage && (
        <div style={{ 
          position: "fixed", top: "100px", left: "50%", transform: "translateX(-50%)",
          padding: "1rem 2rem", background: "var(--color-black)", color: "white",
          zIndex: 1001, letterSpacing: "0.1em", fontSize: "0.8rem", textTransform: "uppercase"
        }}>
          {successMessage}
        </div>
      )}

      <div style={{ marginBottom: "4rem" }}>
        <span className="hero-subtitle">Incentives</span>
        <h1 style={{ fontSize: "2.5rem", marginTop: "1rem" }}>Promotional Management</h1>
      </div>
      
      <div style={{ display: "grid", gridTemplateColumns: "400px 1fr", gap: "5rem" }}>
        {/* Create Coupon Form */}
        <div>
          <h3 style={{ fontSize: "0.8rem", textTransform: "uppercase", letterSpacing: "0.2em", marginBottom: "2rem", borderBottom: "1px solid #eee", paddingBottom: "1rem" }}>
            New Promotion
          </h3>
          <form onSubmit={submitHandler} style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
            <div>
              <label style={{ display: "block", fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.15em", marginBottom: "0.8rem", fontWeight: "600" }}>Code</label>
              <input type="text" name="code" value={formData.code} onChange={onChange} required placeholder="e.g. LUXURY20" style={{ width: "100%", padding: "1rem", border: "1px solid #eee", background: "var(--color-grey-light)", outline: "none" }} />
            </div>
            
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
              <div>
                <label style={{ display: "block", fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.15em", marginBottom: "0.8rem", fontWeight: "600" }}>Type</label>
                <select name="discountType" value={formData.discountType} onChange={onChange} style={{ width: "100%", padding: "1rem", border: "1px solid #eee", background: "var(--color-grey-light)", outline: "none" }}>
                  <option value="percentage">Percentage (%)</option>
                  <option value="fixed">Fixed ($)</option>
                </select>
              </div>
              <div>
                <label style={{ display: "block", fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.15em", marginBottom: "0.8rem", fontWeight: "600" }}>Value</label>
                <input type="number" name="discountValue" value={formData.discountValue} onChange={onChange} required style={{ width: "100%", padding: "1rem", border: "1px solid #eee", background: "var(--color-grey-light)", outline: "none" }} />
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: "1.5rem" }}>
              <div>
                <label style={{ display: "block", fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.15em", marginBottom: "0.8rem", fontWeight: "600" }}>Expiry Date</label>
                <input type="date" name="expiryDate" value={formData.expiryDate} onChange={onChange} required style={{ width: "100%", padding: "1rem", border: "1px solid #eee", background: "var(--color-grey-light)", outline: "none" }} />
              </div>
              <div>
                <label style={{ display: "block", fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.15em", marginBottom: "0.8rem", fontWeight: "600" }}>Limit</label>
                <input type="number" name="usageLimit" value={formData.usageLimit} onChange={onChange} placeholder="∞" style={{ width: "100%", padding: "1rem", border: "1px solid #eee", background: "var(--color-grey-light)", outline: "none" }} />
              </div>
            </div>

            <button type="submit" className="btn-luxury" style={{ width: "100%", padding: "1.2rem" }}>
              Activate Code
            </button>
          </form>
        </div>

        {/* Coupon List Table */}
        <div>
          <h3 style={{ fontSize: "0.8rem", textTransform: "uppercase", letterSpacing: "0.2em", marginBottom: "2rem", borderBottom: "1px solid #eee", paddingBottom: "1rem" }}>
            Active Registry
          </h3>
          {error && <p style={{ color: "#d00", marginBottom: "1rem", fontSize: "0.85rem" }}>{error}</p>}
          
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
             {coupons.map((coupon) => (
                <div key={coupon._id} style={{ 
                  display: "grid", 
                  gridTemplateColumns: "1.5fr 1fr 1fr 100px", 
                  alignItems: "center", 
                  padding: "1.5rem 2rem", 
                  background: "#fff", 
                  border: "1px solid #f4f4f4",
                  transition: "var(--transition-smooth)"
                }}
                onMouseOver={(e) => e.currentTarget.style.borderColor = "var(--color-gold)"}
                onMouseOut={(e) => e.currentTarget.style.borderColor = "#f4f4f4"}
                >
                  <div>
                    <span style={{ fontWeight: "700", fontSize: "1rem", letterSpacing: "0.05em" }}>{coupon.code}</span>
                    <p style={{ fontSize: "0.75rem", color: "var(--color-grey-medium)", marginTop: "5px" }}>
                      Expires {new Date(coupon.expiryDate).toLocaleDateString()}
                    </p>
                  </div>
                  
                  <div style={{ textAlign: "center" }}>
                    <span style={{ fontSize: "1rem", fontWeight: "700", color: "var(--color-gold)" }}>
                      {coupon.discountType === "percentage" ? `${coupon.discountValue}%` : `$${coupon.discountValue}`}
                    </span>
                  </div>

                  <div style={{ textAlign: "center" }}>
                    <span style={{ fontSize: "0.85rem" }}>{coupon.usedCount} / {coupon.usageLimit || "∞"} Used</span>
                  </div>

                  <div style={{ textAlign: "right" }}>
                    <button 
                      onClick={() => deleteHandler(coupon._id)}
                      style={{ fontSize: "0.75rem", textTransform: "uppercase", fontWeight: "700", color: "#d00" }}
                    >
                      Retire
                    </button>
                  </div>
                </div>
              ))}
              {coupons.length === 0 && <p style={{ color: "var(--color-grey-medium)", fontStyle: "italic" }}>No active promotional codes.</p>}
          </div>
        </div>
      </div>
    </div>
  );
}

export default CouponList;
