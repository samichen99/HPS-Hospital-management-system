import { useState } from "react";
import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

console.log("Sending request to:", import.meta.env.VITE_API_BASE_URL + "/auth/login");

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const {login, loading, token} = useContext(AuthContext);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(()=> {
    if (token){
      navigate("/dashboard");
    }
  }, [token, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const credentials = { email, password};

    try {
      const res = await login(credentials);
      if (res.ok){
        navigate("/dashboard");
      }else{
        setError( res.message || "login failed");
      }
    } catch (err){
      console.error("login error:", err);
      setError("An unexpected error occurred. Please try again.");
    }
  };

 

  return (
    <div className="d-flex vh-100 justify-content-center align-items-center bg-light">
      <div className="card shadow p-4" style={{ width: "24rem" }}>
        <h3 className="text-center mb-3">HAP Hospital Login</h3>

        {error && <div className="alert alert-danger">{error}</div>}

        <form onSubmit={handleSubmit} autoComplete="on">
          <div className="mb-3">
            <label htmlFor="email" className="form-label">
              Email address
            </label>
            <input
              type="email"
              className="form-control"
              id="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
          </div>

          <div className="mb-3">
            <label htmlFor="password" className="form-label">
              Password
            </label>
            <input
              type="password"
              className="form-control"
              id="password"
              name="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
            />
          </div>

          <button type="submit" 
          className="btn btn-primary w-100"
          disabled ={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;
