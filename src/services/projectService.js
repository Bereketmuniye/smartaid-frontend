// src/services/projectService.js
import api from "../config/api";

export const getProjects = async () => {
    const response = await api.get("/projects");
    return response.data;
};

export const getProjectById = async (id) => {
    const token = localStorage.getItem("authToken");
    if (token) {
        api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    }
    try {
    const response = await api.get(`/projects/${id}`);
    return response.data;
    } catch (error) {
        console.error(`Failed to get project ${id}:`, error);
        throw error;
    }
};

export const createProject = async (projectData) => {
    const token = localStorage.getItem("authToken");
    if (token) {
        api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

    }
   
   const response = await api.post("/projects", projectData, {
       headers: {
           Authorization: `Bearer ${token}`,
           "Content-Type": "application/json",
       },
   });
   return response.data;
};

export const updateProject = async (id, projectData) => {
    const token = localStorage.getItem("authToken");
    if (token) {
        api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    }
    try {
    const response = await api.put(`/projects/${id}`, projectData, {
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json", 
        },
    });
    return response.data;
    } catch (error) {
        console.error(`Failed to update project ${id}:`, error);
        throw error;
    }
};


export const getActivities = async (projectId) => {
    const token = localStorage.getItem("authToken");
    if (token) {
        api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    }
    try {
    const response = await api.get(`/projects/${projectId}/activities`, {
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

export const createActivity = async (activityData) => {
  const token = localStorage.getItem("authToken");
  if (token) {
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  }

  const { project } = activityData;

  if (!project) {
    throw new Error("Project ID is required");
  }

  if (!activityData.name || !activityData.description || !activityData.start_date || !activityData.end_date || !activityData.total_budget || !activityData.responsible_person) {
    throw new Error("All activity fields are required");
  }
  

  try {
    const response = await api.post(
      `/projects/${project}/activities?projectId=${project}`,
      {
        name: activityData.name,
        description: activityData.description,
        start_date: activityData.start_date,
        end_date: activityData.end_date,
        budget_amount: activityData.total_budget,   
        responsible_user: activityData.responsible_person, 
      }
    );
    return response.data;
  } catch (error) {
    console.error("Create activity error:", error.response?.data || error);
    throw error;
  }
};

export const updateActivity = async (projectId, activityId, activityData) => {
    const token = localStorage.getItem("authToken");
    if (token) {
        api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    }
    try {
    const response = await api.put(`/projects/${projectId}/activities/${activityId}`, activityData, {
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json", 
        },
    });
    return response.data;
    } catch (error) {
        console.error(`Failed to update activity for project ${projectId}:`, error);
        throw error;
    }
};
export const getBudgets = async (params) => {
    const token = localStorage.getItem("authToken");
    if (token) {
        api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    }
    try {
    const response = await api.get(`/projects/${params.projectId}/budgets?projectId=${params.projectId}`, {
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json", 
        },
        params,
    });
    return response.data;
    } catch (error) {
        console.error("Get budgets error:", error.response?.data || error);
        throw error;
    }
};
export const createBudget = async (budgetData) => {
  const token = localStorage.getItem("authToken");
  if (token) {
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  }

  const { project } = budgetData;

  if (!project) {
    throw new Error("Project ID is required");
  }

  if (!budgetData.category || !budgetData.allocated_amount) {
    throw new Error("All budget fields are required");
  }

  if (budgetData.allocated_amount <= 0) {
    throw new Error("Allocated amount must be greater than 0");
  }

  if (budgetData.category === "") {
    throw new Error("Category is required");
  }
  const existingBudgets = await getBudgets({ projectId: project });
  if (!Array.isArray(existingBudgets)) {
    throw new Error("Failed to get existing budgets");
  }
  const existingBudgetAmount = existingBudgets.reduce((sum, budget) => sum + budget.allocated_amount, 0);
  if (existingBudgetAmount + budgetData.allocated_amount > project.total_budget) {
    throw new Error("Total allocated amount cannot exceed project budget");
  }

  try {
    const response = await api.post(
      `/projects/${project}/budgets?projectId=${project}`,
      {
        category: budgetData.category,
        allocated_amount: budgetData.allocated_amount, 
      }
    );
    return response.data;
  } catch (error) {
    console.error("Create budget error:", error.response?.data || error);
    throw error;
  }
};



// Example for expenses:
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
