import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { login, reset } from "../../features/auth/authSlice";

function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const { email, password } = formData;
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user, isLoading, isError, isSuccess, message } = useSelector(
    (state) => state.auth
  );

  useEffect(() => {
    if (isSuccess || user) {
      if (user && user.isAdmin) {
        navigate("/admin");
      } else {
        navigate("/shop");
      }
    }
    return () => dispatch(reset());
  }, [user, isSuccess, navigate, dispatch]);

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const onSubmit = (e) => {
    e.preventDefault();
    dispatch(login({ email, password }));
  };

  return (
    <div className="container auth-container" style={{ maxWidth: "500px", padding: "8rem 2rem", margin: "0 auto" }}>
      <div style={{ textAlign: "center", marginBottom: "3rem" }}>
        <span className="hero-subtitle">Welcome Back</span>
        <h1 style={{ fontSize: "2.5rem", marginTop: "1rem" }}>Sign In</h1>
      </div>

      {isError && (
        <div style={{ 
          padding: "1rem", 
          marginBottom: "2rem", 
          background: "#fff0f0", 
          color: "#d00",
          border: "1px solid #ffdada",
          textAlign: "center",
          fontSize: "0.85rem",
          letterSpacing: "0.05em"
        }}>
          {message}
        </div>
      )}

      <form onSubmit={onSubmit} style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
        <div>
          <label style={{ display: "block", fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.15em", marginBottom: "0.8rem", fontWeight: "600" }}>
            Email Address
          </label>
          <input
            type="email"
            name="email"
            value={email}
            onChange={onChange}
            required
            style={{ 
              width: "100%", 
              padding: "1rem", 
              border: "1px solid #eee", 
              fontSize: "1rem",
              background: "var(--color-grey-light)",
              outline: "none"
            }}
          />
        </div>

        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.8rem" }}>
            <label style={{ fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.15em", fontWeight: "600" }}>
              Password
            </label>
            <Link to="#" style={{ fontSize: "0.7rem", color: "var(--color-grey-medium)", textTransform: "uppercase", letterSpacing: "0.05em" }}>Forgot?</Link>
          </div>
          <input
            type="password"
            name="password"
            value={password}
            onChange={onChange}
            required
            style={{ 
              width: "100%", 
              padding: "1rem", 
              border: "1px solid #eee", 
              fontSize: "1rem",
              background: "var(--color-grey-light)",
              outline: "none"
            }}
          />
        </div>

        <button 
          type="submit" 
          disabled={isLoading}
          className="btn-luxury"
          style={{ width: "100%", marginTop: "1rem" }}
        >
          {isLoading ? "Authenticating..." : "Sign In"}
        </button>
      </form>

      <div style={{ marginTop: "2rem", textAlign: "center", fontSize: "0.9rem" }}>
        <p style={{ color: "var(--color-grey-medium)" }}>
          New to MUREX? <Link to="/register" style={{ color: "var(--color-black)", fontWeight: "600", borderBottom: "1px solid var(--color-black)" }}>Create Account</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
