import { Navigate } from "react-router";
import { useAuth } from "../hooks/useAuth.js";

const PublicOnly = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return;
  }

  if (user) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default PublicOnly;
