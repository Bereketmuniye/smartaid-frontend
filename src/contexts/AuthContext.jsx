import React, { createContext, useContext, useState, useEffect } from "react";
import api from "../services/api";
import { toast } from "react-toastify";

const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(localStorage.getItem("token"));
    const [user, setUser] = useState(null);
    const [role, setRole] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (token && storedUser) {
            const parsedUser = JSON.parse(storedUser);
            setUser(parsedUser);
            setRole(parsedUser.role);
        }
        setLoading(false);
    }, [token]);

    const login = async (credentials) => {
        try {
            const { data } = await api.post("/users/login", credentials);
            setToken(data.token);
            setUser(data.user);
            setRole(data.user.role);
            localStorage.setItem("token", data.token);
            localStorage.setItem("user", JSON.stringify(data.user));
            toast.success("Login successful!");
        } catch (error) {
            toast.error(error.response?.data?.message || "Login failed");
            throw error;
        }
    };

    const register = async (credentials) => {
        try {
            const { data } = await api.post("/users/register", credentials);
            setToken(data.token);
            setUser(data.user);
            setRole(data.user.role);
            localStorage.setItem("token", data.token);
            localStorage.setItem("user", JSON.stringify(data.user));
            toast.success("Registration successful!");
        } catch (error) {
            toast.error(error.response?.data?.message || "Registration failed");
            throw error;
        }
    };

    const logout = () => {
        setToken(null);
        setUser(null);
        setRole(null);
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        toast.info("Logged out.");
    };

    const value = { token, user, role, login, register, logout, loading };

    return (
        <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
    );
};
