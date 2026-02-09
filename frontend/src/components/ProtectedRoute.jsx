import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

function PrivateRoute({ children }) {
  const { token, user, loading } = useContext(AuthContext);

  // If loading, we return null. This keeps the current UI (MainLayout) 
  // on screen without replacing it with a loading div that breaks animations.
  if (loading) {
    return null; 
  }

  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default PrivateRoute;