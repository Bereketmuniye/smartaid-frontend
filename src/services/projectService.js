// src/services/projectService.js
import api from "../config/api";

export const getProjects = async () => {
    const response = await api.get("/projects");
    return response.data;
};

export const getProjectById = async (id) => {
    const response = await api.get(`/projects/${id}`);
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
    const response = await api.put(`/projects/${id}`, projectData);
    return response.data;
};
export const getActivitiesByProjectId = async (projectId) => {
    const response = await api.get(`/projects/${projectId}/activities`);
    return response.data;
};

export const createActivity = async (projectId, activityData) => {
    const response = await api.post(
        `/projects/${projectId}/activities`,
        activityData
    );
    return response.data;
};

// Example for expenses:
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
