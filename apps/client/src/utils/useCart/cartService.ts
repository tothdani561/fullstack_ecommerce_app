import { apiRequest } from "../../utils/axiosInstance";
import { redirectToLogin } from "../../utils/axiosInstance";

export const fetchCartItems = async (userId: number | null) => {
    if (!userId) return [];
    return await apiRequest(`/cart/${userId}`, { method: "GET" });
};

export const addToCart = async (userId: number | null, productId: number) => {
    const accessToken = localStorage.getItem("accessToken");

    if (!accessToken) {
        console.warn("❌ Nincs accessToken! Átirányítás a bejelentkezési oldalra...");
        redirectToLogin();
        return;
    }
    if (!userId) throw new Error("User ID is required");
    return await apiRequest("/cart", { method: "POST", data: { userId, productId } });
};

export const removeFromCart = async (userId: number | null, productId: number) => {
    if (!userId) throw new Error("User ID is required");
    return await apiRequest(`/cart/${userId}/${productId}`, { method: "DELETE" });
};

export const clearCart = async (userId: number | null) => {
    if (!userId) throw new Error("User ID is required");
    return await apiRequest(`/cart/${userId}`, { method: "DELETE" });
};