import { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import '../index.css';

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login, loading, token } = useContext(AuthContext);
  const [error, setError] = useState("");
  const [isExiting, setIsExiting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (token) navigate("/dashboard");
  }, [token, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await login({ email, password });
      if (res.ok) {
        setIsExiting(true);
        setTimeout(() => {
          navigate("/dashboard");
        }, 800);
      } else {
        setError(res.message || "Login failed");
      }
    } catch (err) {
      setError("An unexpected error occurred.");
    }
  };

  const pageStyle = {
    backgroundColor: "rgba(226, 226, 226, 0.40)",
    borderRadius: "18px",
    minHeight: "100vh",
    padding: "40px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    color: "#1d1d1f",
    fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif',
    backdropFilter: "blur(4px) saturate(150%)",
    WebkitBackdropFilter: "blur(4px) saturate(150%)",
    border: "1px solid rgba(0, 0, 0, 0.1)",
    boxShadow: "0 8px 32px rgba(0, 0, 0, 0.06)"
  };

  const glassCard = {
    width: "400px",
    padding: "56px 48px",
    backgroundColor: "rgba(255, 255, 255, 0.27)",
    backdropFilter: "blur(50px) saturate(210%)",
    WebkitBackdropFilter: "blur(50px) saturate(210%)",
    borderRadius: "32px",
    border: "1px solid rgba(255, 255, 255, 0.5)",
    boxShadow: "0 30px 60px rgba(0, 0, 0, 0.12)",
    textAlign: "center",
    opacity: isExiting ? 0 : 1,
    transform: isExiting ? "scale(0.98) translateY(8px)" : "scale(1) translateY(0)",
    transition: "all 0.6s cubic-bezier(0.23, 1, 0.32, 1)"
  };

  const inputStyle = {
    width: "100%",
    padding: "14px 16px",
    borderRadius: "14px",
    border: "1px solid rgba(0, 0, 0, 0.1)",
    backgroundColor: "rgba(255, 255, 255, 0.4)",
    fontSize: "14px",
    outline: "none",
    marginBottom: "20px",
    transition: "all 0.3s ease",
    boxShadow: "inset 0 1px 3px rgba(0,0,0,0.02)"
  };

  const labelStyle = { 
    fontSize: "12px", 
    fontWeight: "600", 
    color: "#1d1d1f", 
    opacity: 0.8,
    marginBottom: "8px", 
    display: "block", 
    textAlign: "left",
    letterSpacing: "0.01em"
  };

  return (
    <div style={pageStyle}>
      <div style={glassCard}>
        <header style={{ marginBottom: "40px" }}>
          <h1 style={{ fontSize: "24px", fontWeight: "700", color: "#1d1d1f", letterSpacing: "-0.04em", marginBottom: "8px" }}>HAP Hospital</h1>
          <p style={{ fontSize: "14px", color: "#424245", opacity: 0.7, lineHeight: "1.4" }}>Enter your credentials to access the medical portal</p>
        </header>

        {error && (
          <div style={{ 
            fontSize: "12px", 
            color: "#ff3b30", 
            backgroundColor: "rgba(255, 59, 48, 0.08)", 
            padding: "12px", 
            borderRadius: "12px", 
            marginBottom: "24px",
            border: "1px solid rgba(255, 59, 48, 0.1)",
            textAlign: "left"
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div>
            <label style={labelStyle}>Email Address</label>
            <input
              type="email"
              style={inputStyle}
              placeholder="example@haphospital.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div style={{ marginBottom: "12px" }}>
            <label style={labelStyle}>Security Password</label>
            <input
              type="password"
              style={inputStyle}
              placeholder="••••••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="d-flex justify-content-center mt-4">
            <button 
              type="submit" 
              className="btn-macos btn-macos-primary"
              style={{ 
                padding: "8px 24px", 
                fontSize: "13px", 
                fontWeight: "600",
                minWidth: "120px",
                height: "36px",
                borderRadius: "8px" // Rectangular universal style
              }}
              disabled={loading || isExiting}
            >
              {loading || isExiting ? "Verifying..." : "Sign In"}
            </button>
          </div>
        </form>

        <footer style={{ marginTop: "40px", fontSize: "11px", color: "#86868b", opacity: 0.8 }}>
          Internal System — Unauthorized Access Prohibited
        </footer>
      </div>
    </div>
  );
}

export default Login;