import api from "../config/api";

export const getExpenses = async () => {
    const response = await api.get("/expenses");
    return response.data;
};

export const getExpenseById = async (id) => {
    const response = await api.get(`/expenses/${id}`);
    return response.data;
};

export const createExpense = async (expenseData) => {
    const formData = new FormData();
    for (const key in expenseData) {
        formData.append(key, expenseData[key]);
    }
    const response = await api.post("/expenses", formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
    return response.data;
};

export const updateExpense = async (id, expenseData) => {
    const formData = new FormData();
    for (const key in expenseData) {
        formData.append(key, expenseData[key]);
    }
    const response = await api.put(`/expenses/${id}`, formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
    return response.data;
}