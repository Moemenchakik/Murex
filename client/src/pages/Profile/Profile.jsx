import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { updateProfile, reset } from "../../features/auth/authSlice";

function Profile() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");

  const dispatch = useDispatch();
  const { user, isLoading, isError, isSuccess, message: authMessage } = useSelector(
    (state) => state.auth
  );

  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
    }
  }, [user]);

  useEffect(() => {
    if (isSuccess) {
      setMessage("Profile updated successfully");
      setTimeout(() => {
        setMessage("");
        dispatch(reset());
      }, 3000);
    }
  }, [isSuccess, dispatch]);

  const submitHandler = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setMessage("Passwords do not match");
    } else {
      dispatch(updateProfile({ name, email, password }));
    }
  };

  return (
    <div className="container profile-container" style={{ maxWidth: "600px", padding: "5rem 2rem" }}>
      <div style={{ textAlign: "center", marginBottom: "3rem" }}>
        <span className="hero-subtitle">Your Account</span>
        <h1 style={{ fontSize: "2.5rem", marginTop: "1rem" }}>Profile Settings</h1>
      </div>

      {(message || isError) && (
        <div style={{ 
          padding: "1rem", 
          marginBottom: "2rem", 
          background: isError ? "#fff0f0" : "var(--color-cream)", 
          color: isError ? "#d00" : "var(--color-gold)",
          border: `1px solid ${isError ? "#ffdada" : "#e0d0b0"}`,
          textAlign: "center",
          fontSize: "0.9rem",
          letterSpacing: "0.05em"
        }}>
          {message || authMessage}
        </div>
      )}

      <form onSubmit={submitHandler} style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
        <div>
          <label style={{ display: "block", fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.15em", marginBottom: "0.8rem", fontWeight: "600" }}>
            Full Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
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
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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

        <div style={{ padding: "1rem 0", borderTop: "1px solid #eee", marginTop: "1rem" }}>
          <p style={{ fontSize: "0.8rem", color: "var(--color-grey-medium)", marginBottom: "1.5rem", fontStyle: "italic" }}>
            Leave password blank to keep current password
          </p>
          
          <div style={{ marginBottom: "2rem" }}>
            <label style={{ display: "block", fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.15em", marginBottom: "0.8rem", fontWeight: "600" }}>
              New Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
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
        </div>

        <button 
          type="submit" 
          disabled={isLoading}
          className="btn-luxury"
          style={{ width: "100%", marginTop: "1rem" }}
        >
          {isLoading ? "Saving Changes..." : "Update Profile"}
        </button>
      </form>
    </div>
  );
}

export default Profile;
