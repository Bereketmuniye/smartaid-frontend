// src/services/userService.js
import api from "../config/api";

export const getUsers = async () => {
    const response = await api.get("/users");
    return response.data;
};

export const getUserById = async (id) => {
    const response = await api.get(`/users/${id}`);
    return response.data;
};

export const registerUser = async (userData) => {
     const token = localStorage.getItem("token");
     if (token) {
        api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

    }
 const password = "bek12bek";

  const payload = {
    ...userData,
    password: password,
  };
     const response = await api.post("/users/register", payload, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
   return response.data;
};

export const updateUser = async (id, userData) => {
    const response = await api.put(`/users/${id}`, userData);
    return response.data;
};

export const activateUser = async (id) => {
    const token = localStorage.getItem("token");
    if (token) {
        api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    }
    try {
    const response = await api.put(`/users/activate/${id}`);
    return response.data;
    } catch (error) {
        console.error("Activate user error:", error.response?.data || error);
        throw error;
    }
};

export const deactivateUser = async (id) => {
    const token = localStorage.getItem("token");
    if (token) {
        api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    }
    try {
      const payload = {
        status: "inactive",
      };
    const response = await api.put(`/users/deactivate/${id}`, payload);
    return response.data;
    } catch (error) {
        console.error("Deactivate user error:", error.response?.data || error);
        throw error;
    }
};

