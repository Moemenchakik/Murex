import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getAllProducts } from "../../services/productService";
import { useDispatch, useSelector } from "react-redux";
import { addToWishlist } from "../../features/wishlist/wishlistSlice";

function Shop() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [categories, setCategories] = useState(["All"]);
  const [successMessage, setSuccessMessage] = useState("");
  
  // Filters
  const [keyword, setKeyword] = useState("");
  const [category, setCategory] = useState("All");

  const API_BASE_URL = process.env.REACT_APP_API_URL ? process.env.REACT_APP_API_URL.replace("/api", "") : "http://localhost:5000";

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const data = await getAllProducts({ keyword, category });
        setProducts(data);
        
        // Only set categories on initial load of all products
        if (category === "All" && !keyword) {
           const uniqueCategories = ["All", ...new Set(data.map(p => p.category))];
           setCategories(uniqueCategories);
        }
      } catch (err) {
        console.error("Product fetch error:", err);
        const message = 
          (err.response && err.response.data && err.response.data.message) || 
          err.message || 
          "Failed to load products";
        setError(message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [keyword, category]);

  const handleWishlist = (productId) => {
    if (!user) {
      navigate("/login");
      return;
    }
    dispatch(addToWishlist(productId)).then((res) => {
      if (!res.error) {
        setSuccessMessage("Piece saved to wishlist.");
        setTimeout(() => setSuccessMessage(""), 3000);
      }
    });
  };

  const getImagePath = (image) => {
    if (!image) return "https://via.placeholder.com/200";
    if (image.startsWith("http") || image.startsWith("data:")) return image;
    return image.startsWith("/") ? image : `/${image}`;
  };

  return (
    <div className="container" style={{ padding: "4rem 2rem" }}>
      {successMessage && (
        <div style={{ 
          position: "fixed", top: "100px", left: "50%", transform: "translateX(-50%)",
          padding: "1rem 2rem", background: "var(--color-black)", color: "white",
          zIndex: 1001, letterSpacing: "0.1em", fontSize: "0.8rem", textTransform: "uppercase"
        }}>
          {successMessage}
        </div>
      )}
      <div style={{ textAlign: "center", marginBottom: "4rem" }}>
        <span className="hero-subtitle">The Collection</span>
        <h1 style={{ fontSize: "3rem", marginTop: "1rem" }}>Sophisticated Styles</h1>
      </div>

      {/* Search and Filters */}
      <div style={{ 
        display: "flex", 
        justifyContent: "space-between", 
        alignItems: "center", 
        marginBottom: "3rem",
        paddingBottom: "1.5rem",
        borderBottom: "1px solid #eee"
      }}>
        <div style={{ display: "flex", gap: "2rem", alignItems: "center" }}>
          {/* Categories */}
          <div style={{ display: "flex", gap: "1.5rem" }}>
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                style={{
                  fontSize: "0.8rem",
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                  fontWeight: category === cat ? "700" : "400",
                  color: category === cat ? "var(--color-black)" : "var(--color-grey-medium)",
                  borderBottom: category === cat ? "2px solid var(--color-black)" : "none",
                  paddingBottom: "5px"
                }}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Search */}
        <div style={{ position: "relative", width: "300px" }}>
          <input 
            type="text"
            placeholder="Search products..."
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            style={{
              width: "100%",
              padding: "0.8rem 1rem",
              border: "1px solid #ddd",
              borderRadius: "0",
              fontSize: "0.9rem",
              fontFamily: "var(--font-sans)",
              outline: "none"
            }}
          />
        </div>
      </div>

      {loading ? (
        <div style={{ textAlign: "center", padding: "5rem" }}>
          <p className="hero-subtitle">Refining Results...</p>
        </div>
      ) : error ? (
        <div style={{ textAlign: "center", padding: "5rem", color: "red" }}>{error}</div>
      ) : (
        <>
          <p style={{ marginBottom: "2rem", fontSize: "0.9rem", color: "var(--color-grey-medium)" }}>
            Showing {products.length} exquisite pieces
          </p>
          
          <div style={{ 
            display: "grid", 
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", 
            gap: "3rem 2rem" 
          }}>
            {products.length === 0 ? (
              <div style={{ gridColumn: "1 / -1", textAlign: "center", padding: "5rem" }}>
                <p>No pieces found matching your criteria.</p>
              </div>
            ) : (
              products.map((product) => (
                <div key={product._id} className="product-card-luxury">
                  <Link to={`/product/${product._id}`} style={{ display: "block", overflow: "hidden" }}>
                    <div style={{ 
                      position: "relative", 
                      height: "400px", 
                      background: "var(--color-grey-light)",
                      transition: "var(--transition-smooth)"
                    }}>
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
                      <button 
                        onClick={(e) => {
                          e.preventDefault();
                          handleWishlist(product._id);
                        }}
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
                          zIndex: 10,
                          fontSize: "1.2rem"
                        }}
                      >
                        ♥
                      </button>
                    </div>
                  </Link>
                  <div style={{ marginTop: "1.5rem" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start" }}>
                      <div>
                        <p style={{ 
                          fontSize: "0.7rem", 
                          textTransform: "uppercase", 
                          letterSpacing: "0.15em", 
                          color: "var(--color-gold)",
                          marginBottom: "0.5rem"
                        }}>
                          {product.category}
                        </p>
                        <h3 style={{ fontSize: "1rem", marginBottom: "0.5rem" }}>
                          <Link to={`/product/${product._id}`}>{product.name}</Link>
                        </h3>
                      </div>
                      <p style={{ fontWeight: "600", fontSize: "0.9rem" }}>${product.price.toLocaleString()}</p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default Shop;