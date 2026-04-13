import { useContext } from "react";
import { AuthContext } from "../context/auth.context.jsx";
import { login, register, logout } from "../services/auth.api.js";

export const useAuth = () => {
  const { user, setUser, loading, setLoading } = useContext(AuthContext);

  const handleRegister = async (username, email, password) => {
    try {
      setLoading(true);
      const data = await register(username, email, password);

      if (!data?.user) {
        throw new Error("Invalid credentials");
      }

      setUser(data.user);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (email, password) => {
    try {
      setLoading(true);
      const data = await login(email, password);

      if (!data?.user) {
        throw new Error("Invalid credentials");
      }

      setUser(data.user);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      setLoading(true);
      await logout();
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  return {
    user,
    loading,
    handleRegister,
    handleLogin,
    handleLogout,
  };
};
