import apiClient from "../axiosInstance";

export interface RegisterUserData {
    email: string;
    password: string;
    firstname: string;
    lastname: string;
}

export const registerUser = async (userData: RegisterUserData): Promise<any> => {
    try {
        const response = await apiClient.post("/auth/local/signup", userData);
        return response.data;
    } catch (error: any) {
        console.error("Regisztrációs hiba:", error.response?.data || error.message);
        throw new Error(error.response?.data?.message || "Hiba történt a regisztráció során.");
    }
};