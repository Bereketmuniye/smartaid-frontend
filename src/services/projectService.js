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


export const getProjectsByUserId = async (userId) => {
    const response = await api.get(`/projects/user/${userId}`);
    return response.data;
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
    const response = await api.get(`/projects/activities/${projectId}`, {
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
  const existingBudgets = await getBudgets({ projectId: project_id });

  const existingAmount = existingBudgets.reduce(
    (sum, b) => sum + b.budget_line_amount,
    0
  );

  // 2) Compare with total_budget passed from frontend
  if (existingAmount + budgetData.budget_line_amount > budgetData.total_budget) {
    throw new Error("Total allocated amount cannot exceed project budget");
  }

   const response = await api.post(
      `/projects/${project_id}/budgets?projectId=${project_id}`,
      {
        budget_line_code: budgetData.budget_line_code,
        budget_line_name: budgetData.budget_line_name,
        budget_line_amount: budgetData.budget_line_amount,
        budget_line_description: budgetData.budget_line_description,
      }
    );
    return response.data;
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
