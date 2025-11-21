import { createContext, useContext, useState, useEffect } from "react";
import api from "../services/api";
import { jwtDecode } from "jwt-decode";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("authToken") || null);
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")) || null);
  const [loading, setLoading] = useState(true);

  // Load user on first render
  useEffect(() => {
    const init = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        // Validate token
        const decoded = jwtDecode(token);
        if (decoded.exp * 1000 < Date.now()) {
          return logout();
        }

        // Fetch real user
        const { data } = await api.get("/users/me", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setUser(data);
        localStorage.setItem("user", JSON.stringify(data));
      } catch (err) {
        logout();
      }

      setLoading(false);
    };

    init();
  }, [token]);

  // LOGIN
  const login = async (email, password) => {
    const { data } = await api.post("/users/login", {email, password});

    localStorage.setItem("authToken", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));

    setToken(data.token);
    setUser(data.user);

    return data.user;
  };

  // REGISTER
  const register = async (credentials) => {
    const { data } = await api.post("/users/register", credentials);

    localStorage.setItem("authToken", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));

    setToken(data.token);
    setUser(data.user);

    return data.user;
  };

  // LOGOUT
  const logout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        register,
        logout,
        loading,
        isAuthenticated: !!user && !!token,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
