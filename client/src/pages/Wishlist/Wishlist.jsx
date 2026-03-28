import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { getWishlist, removeFromWishlist, reset } from "../../features/wishlist/wishlistSlice";

function Wishlist() {
  const dispatch = useDispatch();
  const { wishlistItems, isLoading, isError, message } = useSelector(
    (state) => state.wishlist
  );

  const API_BASE_URL = process.env.REACT_APP_API_URL ? process.env.REACT_APP_API_URL.replace("/api", "") : "http://localhost:5000";

  useEffect(() => {
    dispatch(getWishlist());
    return () => dispatch(reset());
  }, [dispatch]);

  const handleRemove = (id) => {
    dispatch(removeFromWishlist(id)).then(() => {
      dispatch(getWishlist());
    });
  };

  const getImagePath = (image) => {
    if (!image) return "https://via.placeholder.com/200";
    if (image.startsWith("http") || image.startsWith("data:")) return image;
    return image.startsWith("/") ? image : `/${image}`;
  };

  if (isLoading) return (
    <div className="container" style={{ padding: "10rem", textAlign: "center" }}>
      <p className="hero-subtitle">Opening Your Collection...</p>
    </div>
  );

  return (
    <div className="container" style={{ padding: "5rem 2rem" }}>
      <div style={{ textAlign: "center", marginBottom: "5rem" }}>
        <span className="hero-subtitle">Saved Pieces</span>
        <h1 style={{ fontSize: "3rem", marginTop: "1rem" }}>My Wishlist</h1>
      </div>

      {wishlistItems.length === 0 ? (
        <div style={{ textAlign: "center", padding: "5rem 0" }}>
          <p style={{ color: "var(--color-grey-medium)", marginBottom: "2rem" }}>Your wishlist is currently empty.</p>
          <Link to="/shop" className="btn-luxury">Discover New Pieces</Link>
        </div>
      ) : (
        <div style={{ 
          display: "grid", 
          gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", 
          gap: "3rem 2rem" 
        }}>
          {wishlistItems.map((product) => (
            <div key={product._id} className="product-card-luxury">
              <div style={{ position: "relative", overflow: "hidden", height: "400px" }}>
                <Link to={`/product/${product._id}`}>
                  <img 
                    src={getImagePath(product.images[0])} 
                    alt={product.name} 
                    style={{ 
                      width: "100%", 
                      height: "100%", 
                      objectFit: "cover",
                      transition: "var(--transition-smooth)"
                    }}
                    onMouseOver={(e) => e.currentTarget.style.transform = "scale(1.05)"}
                    onMouseOut={(e) => e.currentTarget.style.transform = "scale(1)"}
                  />
                </Link>
                <button 
                  onClick={() => handleRemove(product._id)}
                  style={{
                    position: "absolute",
                    top: "15px",
                    right: "15px",
                    background: "white",
                    width: "35px",
                    height: "35px",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
                    fontSize: "1.2rem"
                  }}
                >
                  &times;
                </button>
              </div>
              <div style={{ marginTop: "1.5rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start" }}>
                  <div>
                    <p style={{ 
                      fontSize: "0.7rem", 
                      textTransform: "uppercase", 
                      letterSpacing: "0.15em", 
                      color: "var(--color-gold)",
                      marginBottom: "0.5rem"
                    }}>{product.category}</p>
                    <h3 style={{ fontSize: "1rem", marginBottom: "0.5rem" }}>
                      <Link to={`/product/${product._id}`}>{product.name}</Link>
                    </h3>
                  </div>
                  <p style={{ fontWeight: "600", fontSize: "0.9rem" }}>${product.price.toLocaleString()}</p>
                </div>
                <Link 
                  to={`/product/${product._id}`}
                  className="btn-outline"
                  style={{ width: "100%", textAlign: "center", padding: "0.8rem", marginTop: "1rem", display: "block", fontSize: "0.75rem" }}
                >
                  View Piece
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Wishlist;
