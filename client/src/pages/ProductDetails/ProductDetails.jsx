import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getSingleProduct } from "../../services/productService";
import { addToCart } from "../../features/cart/cartSlice";
import { createReview, resetProduct } from "../../features/products/productSlice";
import { addToWishlist } from "../../features/wishlist/wishlistSlice";

function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  const { user } = useSelector((state) => state.auth);
  const { isSuccess: reviewSuccess, isError: reviewError, message: reviewMessage } = useSelector((state) => state.product);

  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [successMessage, setSuccessMessage] = useState("");

  const API_BASE_URL = process.env.REACT_APP_API_URL ? process.env.REACT_APP_API_URL.replace("/api", "") : "http://localhost:5000";

  const getImagePath = (image) => {
    if (!image) return "https://via.placeholder.com/800";
    if (image.startsWith("http")) return image;
    return image.startsWith("/") ? image : `/${image}`;
  };

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const data = await getSingleProduct(id);
      setProduct(data);
      if (data.sizes && data.sizes.length > 0) setSelectedSize(data.sizes[0]);
      if (data.colors && data.colors.length > 0) setSelectedColor(data.colors[0]);
    } catch (err) {
      setError("The requested piece could not be located.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (reviewSuccess) {
      setSuccessMessage("Your review has been shared.");
      setRating(5);
      setComment("");
      dispatch(resetProduct());
      fetchProduct();
      setTimeout(() => setSuccessMessage(""), 3000);
    }
    
    if (reviewError) {
      dispatch(resetProduct());
    }

    fetchProduct();
  }, [id, reviewSuccess, reviewError, reviewMessage, dispatch]);

  const handleAddToCart = () => {
    const cartItem = {
      productId: product._id,
      name: product.name,
      price: product.discountPrice > 0 ? product.discountPrice : product.price,
      image: product.images[0],
      size: selectedSize,
      color: selectedColor,
      quantity: quantity,
      stock: product.stock
    };
    
    dispatch(addToCart(cartItem));
    setSuccessMessage("Added to your selection.");
    setTimeout(() => setSuccessMessage(""), 3000);
  };

  const handleWishlist = () => {
    if (!user) {
      navigate("/login");
      return;
    }
    dispatch(addToWishlist(product._id)).then((res) => {
      if (!res.error) {
        setSuccessMessage("Piece saved to wishlist.");
        setTimeout(() => setSuccessMessage(""), 3000);
      }
    });
  };

  const submitReviewHandler = (e) => {
    e.preventDefault();
    dispatch(createReview({ productId: id, review: { rating, comment } }));
  };

  if (loading) return (
    <div className="container" style={{ padding: "10rem", textAlign: "center" }}>
      <p className="hero-subtitle">Refining Details...</p>
    </div>
  );
  
  if (error) return (
    <div className="container" style={{ padding: "10rem", textAlign: "center" }}>
      <h2 style={{ marginBottom: "2rem" }}>{error}</h2>
      <Link to="/shop" className="btn-luxury">Return to Collection</Link>
    </div>
  );

  if (!product) return null;

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

      <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: "5rem", marginBottom: "8rem" }}>
        {/* Image Gallery */}
        <div style={{ position: "relative" }}>
          <img 
            src={getImagePath(product.images[0])} 
            alt={product.name} 
            style={{ width: "100%", height: "800px", objectFit: "cover", background: "var(--color-grey-light)" }}
          />
        </div>

        {/* Product Info */}
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "center" }}>
          <span className="hero-subtitle">{product.category}</span>
          <h1 style={{ fontSize: "3.5rem", margin: "1rem 0", lineHeight: "1.1" }}>{product.name}</h1>
          <p style={{ color: "var(--color-gold)", letterSpacing: "0.1em", fontWeight: "600", marginBottom: "2rem" }}>
            {product.brand.toUpperCase()}
          </p>
          
          <div style={{ marginBottom: "2.5rem" }}>
            {product.discountPrice > 0 ? (
              <div style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>
                <span style={{ fontSize: "1.5rem", fontWeight: "700" }}>${product.discountPrice.toLocaleString()}</span>
                <span style={{ textDecoration: "line-through", color: "var(--color-grey-medium)", fontSize: "1.1rem" }}>
                  ${product.price.toLocaleString()}
                </span>
              </div>
            ) : (
              <span style={{ fontSize: "1.5rem", fontWeight: "700" }}>${product.price.toLocaleString()}</span>
            )}
          </div>

          <div style={{ marginBottom: "3rem" }}>
             <h4 style={{ fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.15em", marginBottom: "1rem", fontWeight: "700" }}>Description</h4>
             <p style={{ color: "var(--color-grey-dark)", lineHeight: "1.8", fontSize: "0.95rem" }}>{product.description}</p>
          </div>

          {/* Selection Controls */}
          <div style={{ display: "flex", flexDirection: "column", gap: "2.5rem", borderTop: "1px solid #eee", paddingTop: "2.5rem" }}>
            {product.sizes && product.sizes.length > 0 && (
              <div>
                <h4 style={{ fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.15em", marginBottom: "1rem", fontWeight: "700" }}>Select Size</h4>
                <div style={{ display: "flex", gap: "1rem" }}>
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      style={{
                        width: "50px", height: "50px", display: "flex", alignItems: "center", justifyContent: "center",
                        border: `1px solid ${selectedSize === size ? "var(--color-black)" : "#eee"}`,
                        background: selectedSize === size ? "var(--color-black)" : "transparent",
                        color: selectedSize === size ? "white" : "var(--color-black)",
                        fontSize: "0.8rem", fontWeight: "600", transition: "var(--transition-smooth)"
                      }}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div style={{ display: "flex", alignItems: "flex-end", gap: "2rem" }}>
              <div style={{ flex: 1 }}>
                <h4 style={{ fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.15em", marginBottom: "1rem", fontWeight: "700" }}>Quantity</h4>
                <div style={{ display: "flex", alignItems: "center", border: "1px solid #eee", width: "fit-content", padding: "5px" }}>
                  <button onClick={() => setQuantity(q => Math.max(1, q - 1))} style={{ padding: "10px 15px", fontSize: "1.2rem" }}>-</button>
                  <span style={{ padding: "0 20px", fontWeight: "600" }}>{quantity}</span>
                  <button onClick={() => setQuantity(q => Math.min(product.stock, q + 1))} style={{ padding: "10px 15px", fontSize: "1.2rem" }}>+</button>
                </div>
              </div>

              <button 
                onClick={handleAddToCart}
                disabled={product.stock <= 0}
                className="btn-luxury"
                style={{ flex: 2, padding: "1.4rem" }}
              >
                {product.stock > 0 ? "Add to Selection" : "Temporarily Unavailable"}
              </button>

              <button 
                onClick={handleWishlist}
                className="btn-outline"
                style={{ width: "60px", padding: "1.4rem", display: "flex", alignItems: "center", justifyContent: "center" }}
              >
                ♥
              </button>
            </div>
            
            <p style={{ fontSize: "0.8rem", color: product.stock > 0 ? "#2e7d32" : "#d00", letterSpacing: "0.05em" }}>
              {product.stock > 0 ? `• Complimentary shipping included. Only ${product.stock} pieces remaining.` : "• This item is currently out of stock."}
            </p>
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <div style={{ borderTop: "1px solid #eee", paddingTop: "5rem" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1.5fr", gap: "5rem" }}>
          <div>
            <h2 style={{ fontSize: "2rem", marginBottom: "2rem" }}>Guest Feedback</h2>
            <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1rem" }}>
               <span style={{ fontSize: "3rem", fontWeight: "700" }}>{product.rating.toFixed(1)}</span>
               <div>
                  <div style={{ color: "var(--color-gold)", fontSize: "1.2rem" }}>{"★".repeat(Math.round(product.rating))}{"☆".repeat(5 - Math.round(product.rating))}</div>
                  <p style={{ fontSize: "0.85rem", color: "var(--color-grey-medium)" }}>Based on {product.reviewsCount} reviews</p>
               </div>
            </div>
            
            <div style={{ marginTop: "3rem" }}>
              <h4 style={{ fontSize: "0.8rem", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "1.5rem" }}>Share your experience</h4>
              {user ? (
                <form onSubmit={submitReviewHandler} style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                  <select value={rating} onChange={(e) => setRating(Number(e.target.value))} style={{ padding: "1rem", border: "1px solid #eee", background: "var(--color-grey-light)", outline: "none" }} required>
                    <option value="5">5 - Exceptional</option>
                    <option value="4">4 - Excellent</option>
                    <option value="3">3 - Standard</option>
                    <option value="2">2 - Disappointing</option>
                    <option value="1">1 - Poor</option>
                  </select>
                  <textarea 
                    placeholder="Your thoughts on this piece..."
                    value={comment} 
                    onChange={(e) => setComment(e.target.value)} 
                    style={{ padding: "1rem", border: "1px solid #eee", background: "var(--color-grey-light)", height: "120px", outline: "none" }} 
                    required
                  />
                  <button type="submit" className="btn-outline" style={{ padding: "1rem" }}>Submit Review</button>
                </form>
              ) : (
                <p style={{ fontSize: "0.9rem", color: "var(--color-grey-medium)" }}>
                  Please <Link to="/login" style={{ color: "var(--color-black)", fontWeight: "600" }}>sign in</Link> to share your feedback.
                </p>
              )}
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "3rem" }}>
            {product.reviews.length === 0 ? (
              <p style={{ fontStyle: "italic", color: "var(--color-grey-medium)" }}>No reviews have been shared for this piece yet.</p>
            ) : (
              product.reviews.map((review) => (
                <div key={review._id} style={{ borderBottom: "1px solid #f9f9f9", paddingBottom: "2rem" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "1rem" }}>
                    <span style={{ fontWeight: "700", textTransform: "uppercase", fontSize: "0.8rem", letterSpacing: "0.1em" }}>{review.name}</span>
                    <span style={{ color: "var(--color-gold)" }}>{"★".repeat(review.rating)}</span>
                  </div>
                  <p style={{ fontSize: "0.95rem", lineHeight: "1.7", color: "var(--color-grey-dark)", marginBottom: "1rem" }}>"{review.comment}"</p>
                  <span style={{ fontSize: "0.75rem", color: "var(--color-grey-medium)" }}>{new Date(review.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetails;
