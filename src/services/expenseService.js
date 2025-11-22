import api from "../config/api";

export const getExpenses = async () => {
    const token = localStorage.getItem("authToken");
    if (token) {
        api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    }
    try {
    const response = await api.get("/expenses");
    return response.data;
    } catch (error) {
        console.error("Get expenses error:", error.response?.data || error);
        throw error;
    }
};

export const getExpenseById = async (id) => {
    const token = localStorage.getItem("authToken");
    if (token) {
        api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    }
    try {
    const response = await api.get(`/expenses/${id}`);
    return response.data;
    } catch (error) {
        console.error("Get expense by ID error:", error.response?.data || error);
        throw error;
    }
};

export const createExpense = async (expenseData) => {
    const token = localStorage.getItem("authToken");
    if (token) {
        api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    }
    try {
    const response = await api.post("/expenses", expenseData); 
    return response.data;
    } catch (error) {
        console.error("Create expense error:", error.response?.data || error);
        throw error;
    }
};

export const updateExpense = async (id, expenseData) => {
    const token = localStorage.getItem("authToken");
    if (token) {
        api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    }
    try {
    const response = await api.put(`/expenses/${id}`, expenseData);
    return response.data;
    } catch (error) {
        console.error("Update expense error:", error.response?.data || error);
        throw error;
    }
}

export const getCurrentExpense = async () => {
    const token = localStorage.getItem("authToken");
    if (token) {
        api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    }
    try {
    const response = await api.get("/expenses/current");
    return response.data;
    } catch (error) {
        console.error("Get current expense error:", error.response?.data || error);
        throw error;
    }
}