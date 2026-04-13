import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth.js";

const Protected = ({ children }) => {
  const { loading, user } = useAuth();

  if (loading) {
    return;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default Protected;
