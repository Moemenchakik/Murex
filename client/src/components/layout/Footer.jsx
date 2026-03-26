import { Link } from "react-router-dom";

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer style={{ 
      backgroundColor: "var(--color-cream)", 
      padding: "5rem 0 2rem 0",
      marginTop: "5rem",
      borderTop: "1px solid #eee"
    }}>
      <div className="container">
        <div style={{ 
          display: "grid", 
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", 
          gap: "4rem",
          marginBottom: "4rem"
        }}>
          {/* Brand Column */}
          <div>
            <Link to="/" style={{ 
              fontFamily: "var(--font-serif)", 
              fontSize: "1.5rem", 
              fontWeight: "bold", 
              letterSpacing: "0.1em",
              display: "block",
              marginBottom: "1.5rem"
            }}>MUREX</Link>
            <p style={{ 
              fontSize: "0.9rem", 
              color: "var(--color-grey-medium)", 
              lineHeight: "1.8" 
            }}>
              Curating the finest selection of global luxury fashion. 
              Elegance in every stitch, sophistication in every silhouette.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 style={{ fontSize: "0.8rem", textTransform: "uppercase", letterSpacing: "0.2em", marginBottom: "2rem" }}>Shop</h4>
            <ul style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <li><Link to="/shop" style={{ fontSize: "0.9rem", color: "var(--color-grey-dark)" }}>All Collection</Link></li>
              <li><Link to="/shop?category=Men" style={{ fontSize: "0.9rem", color: "var(--color-grey-dark)" }}>Men's Fashion</Link></li>
              <li><Link to="/shop?category=Women" style={{ fontSize: "0.9rem", color: "var(--color-grey-dark)" }}>Women's Fashion</Link></li>
              <li><Link to="/shop?category=Accessories" style={{ fontSize: "0.9rem", color: "var(--color-grey-dark)" }}>Accessories</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 style={{ fontSize: "0.8rem", textTransform: "uppercase", letterSpacing: "0.2em", marginBottom: "2rem" }}>Customer Care</h4>
            <ul style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <li><Link to="/orders" style={{ fontSize: "0.9rem", color: "var(--color-grey-dark)" }}>Track Order</Link></li>
              <li><Link to="#" style={{ fontSize: "0.9rem", color: "var(--color-grey-dark)" }}>Shipping Policy</Link></li>
              <li><Link to="#" style={{ fontSize: "0.9rem", color: "var(--color-grey-dark)" }}>Returns & Exchanges</Link></li>
              <li><Link to="#" style={{ fontSize: "0.9rem", color: "var(--color-grey-dark)" }}>Contact Us</Link></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 style={{ fontSize: "0.8rem", textTransform: "uppercase", letterSpacing: "0.2em", marginBottom: "2rem" }}>The Insider</h4>
            <p style={{ fontSize: "0.85rem", color: "var(--color-grey-medium)", marginBottom: "1.5rem" }}>
              Subscribe to receive updates on new arrivals and exclusive offers.
            </p>
            <div style={{ display: "flex", borderBottom: "1px solid #ccc", paddingBottom: "0.5rem" }}>
              <input 
                type="email" 
                placeholder="Email Address" 
                style={{ 
                  background: "transparent", 
                  border: "none", 
                  outline: "none", 
                  fontSize: "0.8rem", 
                  flex: 1 
                }} 
              />
              <button style={{ fontSize: "0.7rem", fontWeight: "700", textTransform: "uppercase" }}>Join</button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div style={{ 
          paddingTop: "2rem", 
          borderTop: "1px solid #e5e5e5", 
          display: "flex", 
          justifyContent: "space-between", 
          alignItems: "center",
          flexWrap: "wrap",
          gap: "1rem"
        }}>
          <p style={{ fontSize: "0.75rem", color: "var(--color-grey-medium)" }}>
            &copy; {currentYear} MUREX Luxury Store. Built for Excellence.
          </p>
          <div style={{ display: "flex", gap: "1.5rem" }}>
            <Link to="#" style={{ fontSize: "0.75rem", color: "var(--color-grey-medium)" }}>Privacy Policy</Link>
            <Link to="#" style={{ fontSize: "0.75rem", color: "var(--color-grey-medium)" }}>Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
