// src/services/ngoService.js
import api from "../config/api";

export const getNGOs = async () => {
    const response = await api.get("/ngos");
    return response.data;
};

export const getNGOById = async (id) => {
    const response = await api.get(`/ngos/${id}`);
    return response.data;
};

export const createNGO = async (ngoData) => {
    const token = localStorage.getItem("authToken");
    if (token) {
        api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    }

   const response = await api.post("/ngos", ngoData, {
       headers: {
           Authorization: `Bearer ${token}`,
           "Content-Type": "application/json",
       },
   });
   return response.data;
};

export const updateNGO = async (id, ngoData) => {
    const response = await api.put(`/ngos/${id}`, ngoData);
    return response.data;
}

