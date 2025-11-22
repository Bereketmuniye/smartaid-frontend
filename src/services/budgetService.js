import api from "../config/api";


export const getBudgets = async (projectId) => {
    const token = localStorage.getItem("authToken");
    if (token) {
        api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    }
    try {
    const response = await api.get(`/projects/budgets/${projectId}`, {
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json", 
        },
    });
    return response.data;
    } catch (error) {
        console.error(`Failed to get activities for project ${projectId}:`, error);
        throw error;
    }
};


export const createBudget = async (budgetData) => {
  const token = localStorage.getItem("authToken");
  if (token) {
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  }

  const { project_id } = budgetData;

  if (!project_id) throw new Error("Project ID is required");

  if (!budgetData.budget_line_code ||
      !budgetData.budget_line_name ||
      !budgetData.budget_line_amount ||
      !budgetData.budget_line_description) {
    throw new Error("All budget fields are required");
  }

  // 1) Fetch existing budgets once
  const existingBudgets = await getBudgets(project_id);

  const existingAmount = existingBudgets.reduce(
    (sum, b) => sum + b.budget_line_amount,
    0
  );

  // 2) Compare with total_budget passed from frontend
  if (existingAmount + budgetData.budget_line_amount > budgetData.total_budget) {
    throw new Error("Total allocated amount cannot exceed project budget");
  }

   const response = await api.post(
      `/projects/budgets/${project_id}`,
      {
        budget_line_code: budgetData.budget_line_code,
        budget_line_name: budgetData.budget_line_name,
        budget_line_amount: budgetData.budget_line_amount,
        budget_line_description: budgetData.budget_line_description,
      }
    );
    return response.data;
};



export const createExpense = async (expenseData) => {
    const token = localStorage.getItem("authToken");
    if (token) {
        api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    }
    try {
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
    } catch (error) {
        console.error("Create expense error:", error.response?.data || error);
        throw error;
    }
};
