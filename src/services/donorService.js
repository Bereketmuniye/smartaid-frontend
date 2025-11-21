import api from "../config/api";
export const getDonors = async () => {
    const response = await api.get("/donors");
    return  response.data;
};

export const getDonorById = async (id) => {
    const token = localStorage.getItem("token");    
    const response = await api.get(`/donors/${id}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data;
};

export const createDonor = async (donorData) => {
    const token = localStorage.getItem("token");
    const response = await api.post("/donors", donorData, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data;
};

export const updateDonor = async (id, donorData) => {
    const token = localStorage.getItem("token");
    const response = await api.put(`/donors/${id}`, donorData, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data;
};

export const deleteDonor = async (id) => {
    const token = localStorage.getItem("token");
    const response = await api.delete(`/donors/${id}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data;
};
