import api from "../config/api";

export const getBudgets = async () => {
    const response = await api.get("/budgets");
    return response.data;
};
    
export const createBudget = async (budgetData) => {
    const response = await api.post("/budgets", budgetData);
    return response.data;
};
    
export const updateBudget = async (budgetId, budgetData) => {
    const response = await api.put(`/budgets/${budgetId}`, budgetData);
    return response.data;
};