import apiClient from "../axiosInstance";

export const subscribeToNewsletter = async (email: string) => {
    const response = await apiClient.post("/newsletter/subscribe", { email });
    return response.data;
};