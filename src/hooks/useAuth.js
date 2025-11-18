// src/hooks/useAuth.js
import { useState, useEffect, useContext, createContext } from "react";
import api from "../config/api";
// Assuming you'll have an AuthContext or Redux store
// For simplicity, let's just use local state and localStorage here

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem("authToken"));
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const storedToken = localStorage.getItem("authToken");
        if (storedToken) {
            setToken(storedToken);
            // In a real app, you'd decode the token or call a /me endpoint
            // to get user details and verify the token's validity
            setUser({
                name: "Logged In User",
                email: "user@example.com",
                role: "admin",
            }); 
        }
        setIsLoading(false);
    }, []);

    const login = async (email, password) => {
        try {
            const response = await api.post("/users/login", {
                email,
                password,
            });
            const { token, user: userData } = response.data;
            localStorage.setItem("authToken", token);
            setToken(token);
            setUser(userData);
            return true;
        } catch (error) {
            console.error("Login failed:", error);
            throw error;
        }
    };

    const logout = () => {
        localStorage.removeItem("authToken");
        setToken(null);
        setUser(null);
    };

    const isAuthenticated = !!token && !!user;

    const value = {
        user,
        token,
        isLoading,
        isAuthenticated,
        login,
        logout,
    };

    return (
        <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};
