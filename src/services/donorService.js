import api from "../config/api";
export const getDonors = async () => {
    const response = await api.get("/donors");
    return response.data;
};

export const getDonorById = async (id) => {
    const response = await api.get(`/donors/${id}`);
    return response.data;
};

export const createDonor = async (donorData) => {
    const response = await api.post("/donors", donorData);
    return response.data;
};

export const updateDonor = async (id, donorData) => {
    const response = await api.put(`/donors/${id}`, donorData);
    return response.data;
};

export const deleteDonor = async (id) => {
    const response = await api.delete(`/donors/${id}`);
    return response.data;
};
