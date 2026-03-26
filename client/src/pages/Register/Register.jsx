import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { register, reset } from "../../features/auth/authSlice";

function Register() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const { name, email, password, confirmPassword } = formData;
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
        navigate("/");
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
    if (password !== confirmPassword) {
      // This will be replaced by better feedback in a later step
      return; 
    }
    dispatch(register({ name, email, password }));
  };

  return (
    <div className="container" style={{ maxWidth: "500px", padding: "8rem 2rem", margin: "0 auto" }}>
      <div style={{ textAlign: "center", marginBottom: "3rem" }}>
        <span className="hero-subtitle">Join the Club</span>
        <h1 style={{ fontSize: "2.5rem", marginTop: "1rem" }}>Create Account</h1>
      </div>

      {(isError || (password !== confirmPassword && confirmPassword)) && (
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
          {password !== confirmPassword ? "Passwords do not match" : message}
        </div>
      )}

      <form onSubmit={onSubmit} style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
        <div>
          <label style={{ display: "block", fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.15em", marginBottom: "0.8rem", fontWeight: "600" }}>
            Full Name
          </label>
          <input
            type="text"
            name="name"
            value={name}
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
          <label style={{ display: "block", fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.15em", marginBottom: "0.8rem", fontWeight: "600" }}>
            Password
          </label>
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

        <div>
          <label style={{ display: "block", fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.15em", marginBottom: "0.8rem", fontWeight: "600" }}>
            Confirm Password
          </label>
          <input
            type="password"
            name="confirmPassword"
            value={confirmPassword}
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
          {isLoading ? "Creating Account..." : "Register Now"}
        </button>
      </form>

      <div style={{ marginTop: "2rem", textAlign: "center", fontSize: "0.9rem" }}>
        <p style={{ color: "var(--color-grey-medium)" }}>
          Already a member? <Link to="/login" style={{ color: "var(--color-black)", fontWeight: "600", borderBottom: "1px solid var(--color-black)" }}>Sign In</Link>
        </p>
      </div>
    </div>
  );
}

export default Register;
