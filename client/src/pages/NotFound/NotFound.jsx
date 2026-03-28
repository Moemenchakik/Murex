import { Link } from "react-router-dom";

function NotFound() {
  return (
    <div className="container" style={{ 
      height: "70vh", 
      display: "flex", 
      flexDirection: "column", 
      alignItems: "center", 
      justifyContent: "center",
      textAlign: "center"
    }}>
      <span className="hero-subtitle">Error 404</span>
      <h1 className="not-found-title" style={{ fontSize: "4rem", margin: "1.5rem 0" }}>Page Not Located.</h1>
      <p style={{ 
        maxWidth: "500px", 
        color: "var(--color-grey-medium)", 
        marginBottom: "3rem",
        lineHeight: "1.8"
      }}>
        The piece or page you are seeking appears to have moved 
        or no longer resides in our current collection.
      </p>
      <Link to="/shop" className="btn-luxury">Return to Collection</Link>
    </div>
  );
}

export default NotFound;
