// src/services/authService.js
// This service could be used if you prefer to separate auth logic from useAuth hook
import api from "../config/api";

export const login = async (email, password) => {
    const response = await api.post("/users/login", { email, password });
    return response.data;
};

export const register = async (userData) => {
    const token = localStorage.getItem("authToken");
    if (token) {
        api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        
    }
    const response = await api.post("/users/register", userData);
    return response.data;
};

// ... other auth related calls
