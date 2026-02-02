import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

function PrivateRoute({ children }) {
  const { token, user, loading } = useContext(AuthContext);

  // 1. If the AuthContext is explicitly in a loading state (e.g., during login), wait.
  if (loading) {
    return (
      <div style={{ 
        backgroundColor: "#f1f1f1ff", 
        height: "100vh", 
        display: "flex", 
        alignItems: "center", 
        justifyContent: "center",
        color: "#424245",
        fontSize: "13px"
      }}>
        Verifying credentials...
      </div>
    );
  }

  // 2. Check both token and user. 
  // Checking user ensures that the context has finished decoding the JWT 
  // before the page tries to use user.role or user.username.
  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default PrivateRoute;