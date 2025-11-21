import api from "../config/api";
import { jwtDecode } from "jwt-decode";

export const login = async (email, password) => {
    const response = await api.post("/users/login", { email, password });
    localStorage.setItem("authToken", response.data.token);
    let user = jwtDecode(response.data.token);
    localStorage.setItem("user", JSON.stringify(user));

    return {token: response.data.token, user};
};


export const registerUser = async (userData) => {
    const token = localStorage.getItem("authToken");
    if (token) {
        api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        
    }
    const response = await api.post("/users/register", userData);
    return { token: response.data.token, user: response.data.user};
};
