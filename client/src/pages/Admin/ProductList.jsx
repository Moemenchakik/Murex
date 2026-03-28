import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { fetchProducts, deleteProduct, createProduct, resetProduct } from "../../features/products/productSlice";

function ProductList() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { products, isLoading, isError, isSuccess, message, product: createdProduct } = useSelector(
    (state) => state.product
  );
  const { user } = useSelector((state) => state.auth);

  const API_BASE_URL = process.env.REACT_APP_API_URL ? process.env.REACT_APP_API_URL.replace("/api", "") : "http://localhost:5000";

  useEffect(() => {
    if (!user || !user.isAdmin) {
      navigate("/");
      return;
    }
    
    dispatch(fetchProducts());
    
    // Cleanup state when leaving the dashboard
    return () => dispatch(resetProduct());
  }, [dispatch, user, navigate]);

  const deleteHandler = (id) => {
    if (window.confirm("Are you sure you want to remove this piece from the collection?")) {
      dispatch(deleteProduct(id));
    }
  };

  const getImagePath = (image) => {
    if (!image) return "https://via.placeholder.com/200";
    if (image.startsWith("http") || image.startsWith("data:")) return image;
    return image.startsWith("/") ? image : `/${image}`;
  };

  if (isLoading) return <div className="container" style={{ padding: "10rem", textAlign: "center" }}><p className="hero-subtitle">Accessing Inventory...</p></div>;

  return (
    <div className="container" style={{ padding: "5rem 2rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "4rem" }}>
        <div>
          <span className="hero-subtitle">Management</span>
          <h1 style={{ fontSize: "2.5rem", marginTop: "1rem" }}>Product Collection</h1>
        </div>
        <Link to="/admin/product/create" className="btn-luxury" style={{ padding: "1rem 2rem", textDecoration: "none" }}>
          Add New Piece
        </Link>
      </div>

      {isError && <div style={{ color: "#d00", marginBottom: "2rem" }}>{message}</div>}

      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        {/* Table Header */}
        <div style={{ 
          display: "grid", 
          gridTemplateColumns: "80px 1.5fr 1fr 1fr 1fr 120px", 
          padding: "1rem 2rem", 
          fontSize: "0.7rem", 
          textTransform: "uppercase", 
          letterSpacing: "0.15em", 
          color: "var(--color-grey-medium)",
          borderBottom: "1px solid #eee"
        }}>
          <span>Image</span>
          <span>Piece Name</span>
          <span>Category</span>
          <span>Price</span>
          <span>Stock</span>
          <span style={{ textAlign: "right" }}>Actions</span>
        </div>

        {/* Product Rows */}
        {products.map((product) => (
          <div key={product._id} style={{ 
            display: "grid", 
            gridTemplateColumns: "80px 1.5fr 1fr 1fr 1fr 120px", 
            alignItems: "center", 
            padding: "1.5rem 2rem", 
            background: "#fff", 
            border: "1px solid #f4f4f4",
            transition: "var(--transition-smooth)"
          }}
          onMouseOver={(e) => e.currentTarget.style.borderColor = "var(--color-gold)"}
          onMouseOut={(e) => e.currentTarget.style.borderColor = "#f4f4f4"}
          >
            <img src={getImagePath(product.images[0])} alt="" style={{ width: "50px", height: "65px", objectFit: "cover", background: "#f9f9f9" }} />
            <span style={{ fontWeight: "600", fontSize: "0.95rem" }}>{product.name}</span>
            <span style={{ fontSize: "0.85rem", color: "var(--color-grey-dark)" }}>{product.category}</span>
            <span style={{ fontWeight: "700" }}>${product.price.toLocaleString()}</span>
            <span style={{ 
              fontSize: "0.85rem", 
              color: product.stock < 5 ? "#d00" : "var(--color-grey-dark)",
              fontWeight: product.stock < 5 ? "700" : "400"
            }}>
              {product.stock} Units
            </span>
            <div style={{ display: "flex", gap: "1.5rem", justifyContent: "flex-end" }}>
              <Link to={`/admin/product/${product._id}/edit`} style={{ fontSize: "0.75rem", textTransform: "uppercase", fontWeight: "700", borderBottom: "1px solid #000" }}>Edit</Link>
              <button onClick={() => deleteHandler(product._id)} style={{ fontSize: "0.75rem", textTransform: "uppercase", fontWeight: "700", color: "#d00" }}>Remove</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ProductList;
