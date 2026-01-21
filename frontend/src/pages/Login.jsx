import { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import '../index.css';

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login, loading, token } = useContext(AuthContext);
  const [error, setError] = useState("");
  const [isHovered, setIsHovered] = useState(false);
  const [isExiting, setIsExiting] = useState(false); // State for smooth exit animation
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
        // Adding the requested delay for a "processing" feel
        setIsExiting(true);
        setTimeout(() => {
          navigate("/dashboard");
        }, 800); // 800ms smooth transition delay
      } else {
        setError(res.message || "Login failed");
      }
    } catch (err) {
      setError("An unexpected error occurred.");
    }
  };

  const pageStyle = {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#eeededff",
    fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif',
    overflow: "hidden"
  };

  const glassCard = {
    width: "350px",
    padding: "40px",
    backgroundColor: "rgba(255, 255, 255, 0.75)",
    backdropFilter: "blur(25px) saturate(180%)",
    WebkitBackdropFilter: "blur(25px) saturate(180%)",
    borderRadius: "28px",
    border: "1px solid rgba(255, 255, 255, 0.6)",
    boxShadow: "0 20px 40px rgba(0, 0, 0, 0.06)",
    textAlign: "center",
    // Smooth exit animation: fades out and scales down
    opacity: isExiting ? 0 : 1,
    transform: isExiting ? "scale(0.95) translateY(10px)" : "scale(1) translateY(0)",
    transition: "all 0.6s cubic-bezier(0.4, 0, 0.2, 1)"
  };

  const inputStyle = {
    width: "100%",
    padding: "12px 16px",
    borderRadius: "12px",
    border: "1px solid rgba(0, 0, 0, 0.1)",
    backgroundColor: "rgba(255, 255, 255, 0.5)",
    fontSize: "13px",
    marginBottom: "16px",
    outline: "none",
    boxShadow: "inset 0 1px 2px rgba(0,0,0,0.02)"
  };



  return (
    <div style={pageStyle}>
      <div style={glassCard}>
        <div style={{ marginBottom: "32px" }}>
          <h1 style={{ fontSize: "22px", fontWeight: "700", color: "#1d1d1f", letterSpacing: "-0.02em", marginBottom: "8px" }}>HAP Hospital Login</h1>
          <p style={{ fontSize: "13px", color: "#86868b" }}>Secure access to medical systems</p>
        </div>

        {error && <div style={{ fontSize: "12px", color: "#ff3b30", backgroundColor: "rgba(255, 59, 48, 0.1)", padding: "10px", borderRadius: "8px", marginBottom: "20px" }}>{error}</div>}

        <form onSubmit={handleSubmit} style={{ textAlign: "left" }}>
          <div className="mb-3">
            <label style={{ fontSize: "12px", fontWeight: "600", color: "#1d1d1f", marginLeft: "4px", marginBottom: "6px", display: "block" }}>Email address</label>
            <input
              type="email"
              style={inputStyle}
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="mb-4">
            <label style={{ fontSize: "12px", fontWeight: "600", color: "#1d1d1f", marginLeft: "4px", marginBottom: "6px", display: "block" }}>Password</label>
            <input
              type="password"
              style={inputStyle}
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button 
            type="submit" 
            className="btn btn-macos btn-macos-primary w-100"
            disabled={loading || isExiting}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            {loading || isExiting ? "Verifying..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;