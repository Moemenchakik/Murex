import { useEffect, useState } from "react";
import { Link, useNavigate, useParams, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { fetchProductById, updateProduct, createProduct, resetProduct } from "../../features/products/productSlice";
import api from "../../services/api/axios";

function ProductEdit() {
  const { id } = useParams();
  const { pathname } = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const isCreateMode = pathname.includes("/create");
  const isEditMode = !isCreateMode && !!id;

  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    price: 0,
    brand: "",
    category: "",
    stock: 0,
    description: "",
    gender: "unisex",
    slug: "",
    images: []
  });

  const { product, isLoading, isError, isSuccess, message } = useSelector(
    (state) => state.product
  );

  const API_BASE_URL = process.env.REACT_APP_API_URL ? process.env.REACT_APP_API_URL.replace("/api", "") : "http://localhost:5000";

  // 1. Handle mutation success (Redirect)
  useEffect(() => {
    if (isSuccess) {
       navigate("/admin/products");
       dispatch(resetProduct());
    }
  }, [isSuccess, navigate, dispatch]);

  // 2. Handle ID changes: Reset local/global state and fetch if needed
  useEffect(() => {
    dispatch(resetProduct());
    setFormData({
      name: "", price: 0, brand: "", category: "", stock: 0,
      description: "", gender: "unisex", slug: "", images: []
    });

    if (isEditMode) {
      dispatch(fetchProductById(id));
    }
  }, [dispatch, id, isEditMode]);

  // 3. Populate form when correct data arrives
  useEffect(() => {
    if (isEditMode && product && product._id === id) {
      setFormData({
        name: product.name,
        price: product.price,
        brand: product.brand,
        category: product.category,
        stock: product.stock,
        description: product.description,
        gender: product.gender,
        slug: product.slug,
        images: product.images || []
      });
    }
  }, [product, id, isEditMode]);

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const uploadFileHandler = async (e) => {
    const file = e.target.files[0];
    const formDataUpload = new FormData();
    formDataUpload.append("image", file);
    setUploading(true);

    try {
      const config = {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      };

      const { data } = await api.post("/upload", formDataUpload, config);

      setFormData((prev) => ({
        ...prev,
        images: [...prev.images, data.image],
      }));
      
      setUploading(false);
    } catch (error) {
      console.error(error);
      setUploading(false);
    }
  };

  const submitHandler = (e) => {
    e.preventDefault();
    if (isEditMode) {
      dispatch(updateProduct({ _id: id, ...formData }));
    } else {
      dispatch(createProduct(formData));
    }
  };

  if (isLoading) return <div className="container" style={{ padding: "10rem", textAlign: "center" }}><p className="hero-subtitle">Processing...</p></div>;

  return (
    <div className="container" style={{ padding: "5rem 2rem", maxWidth: "800px" }}>
      <Link to="/admin/products" style={{ textDecoration: "none", color: "var(--color-grey-dark)", fontSize: "0.8rem", textTransform: "uppercase", letterSpacing: "0.1em", display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "2rem" }}>
        ← Back to Collection
      </Link>
      
      <div style={{ marginBottom: "3rem" }}>
        <span className="hero-subtitle">Inventory Management</span>
        <h1 style={{ fontSize: "2.5rem", marginTop: "1rem" }}>{isEditMode ? "Edit Piece" : "Add New Piece"}</h1>
      </div>
      
      {isError && <div style={{ color: "#d00", marginBottom: "2rem", padding: "1rem", background: "#fee", borderLeft: "4px solid #d00" }}>{message}</div>}

      <form onSubmit={submitHandler} style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          <div>
            <label style={{ display: "block", fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "0.5rem" }}>Name</label>
            <input type="text" name="name" value={formData.name} onChange={onChange} style={{ width: "100%", padding: "1rem", border: "1px solid #eee", background: "#fcfcfc" }} required />
          </div>
          
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
            <div>
              <label style={{ display: "block", fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "0.5rem" }}>Price ($)</label>
              <input type="number" name="price" value={formData.price} onChange={onChange} style={{ width: "100%", padding: "1rem", border: "1px solid #eee", background: "#fcfcfc" }} required />
            </div>
            <div>
              <label style={{ display: "block", fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "0.5rem" }}>Stock</label>
              <input type="number" name="stock" value={formData.stock} onChange={onChange} style={{ width: "100%", padding: "1rem", border: "1px solid #eee", background: "#fcfcfc" }} required />
            </div>
          </div>

          <div>
            <label style={{ display: "block", fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "0.5rem" }}>Brand</label>
            <input type="text" name="brand" value={formData.brand} onChange={onChange} style={{ width: "100%", padding: "1rem", border: "1px solid #eee", background: "#fcfcfc" }} />
          </div>

          <div>
            <label style={{ display: "block", fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "0.5rem" }}>Category</label>
            <input type="text" name="category" value={formData.category} onChange={onChange} style={{ width: "100%", padding: "1rem", border: "1px solid #eee", background: "#fcfcfc" }} />
          </div>
          
          <div>
             <label style={{ display: "block", fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "0.5rem" }}>Gender</label>
             <select name="gender" value={formData.gender} onChange={onChange} style={{ width: "100%", padding: "1rem", border: "1px solid #eee", background: "#fcfcfc" }}>
                <option value="men">Men</option>
                <option value="women">Women</option>
                <option value="unisex">Unisex</option>
             </select>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          <div>
            <label style={{ display: "block", fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "0.5rem" }}>Slug (URL)</label>
            <input type="text" name="slug" value={formData.slug} onChange={onChange} style={{ width: "100%", padding: "1rem", border: "1px solid #eee", background: "#fcfcfc" }} placeholder="e.g. leather-jacket-black" />
          </div>

          <div>
            <label style={{ display: "block", fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "0.5rem" }}>Description</label>
            <textarea name="description" value={formData.description} onChange={onChange} style={{ width: "100%", padding: "1rem", border: "1px solid #eee", background: "#fcfcfc", height: "120px", resize: "none" }} />
          </div>

          <div>
            <label style={{ display: "block", fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "0.5rem" }}>Images</label>
            <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1rem" }}>
              <input type="file" onChange={uploadFileHandler} style={{ fontSize: "0.8rem" }} accept="image/png, image/jpeg, image/jpg, image/webp, image/svg+xml" />
              {uploading && <span style={{ fontSize: "0.7rem", color: "var(--color-gold)" }}>Uploading...</span>}
            </div>
            
            <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", background: "#f9f9f9", padding: "1rem", border: "1px dashed #ddd" }}>
              {formData.images.length === 0 && <span style={{ fontSize: "0.8rem", color: "#999" }}>No images uploaded yet.</span>}
              {formData.images.map((img, index) => (
                <div key={index} style={{ position: "relative" }}>
                  <img src={img.startsWith("http") ? img : `${API_BASE_URL}${img}`} alt="Product" style={{ width: "70px", height: "90px", objectFit: "cover" }} />
                  <button 
                    type="button"
                    onClick={() => setFormData({ ...formData, images: formData.images.filter((_, i) => i !== index) })}
                    style={{ position: "absolute", top: "-10px", right: "-10px", background: "#000", color: "white", border: "none", borderRadius: "50%", width: "22px", height: "22px", cursor: "pointer", fontSize: "10px" }}
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div style={{ gridColumn: "span 2", marginTop: "2rem" }}>
          <button 
            type="submit" 
            className="btn-luxury"
            style={{ width: "100%", padding: "1.5rem", fontSize: "1rem" }}
          >
            {isEditMode ? "Update Collection Piece" : "Confirm New Addition"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default ProductEdit;