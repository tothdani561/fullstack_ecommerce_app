import { apiRequest } from "../axiosInstance";

export const createOrder = async (couponCode?: string) => {
    const token = localStorage.getItem("accessToken");
    if (!token) throw new Error("Bejelentkezés szükséges");

    return await apiRequest("/orders", {
        method: "POST",
        data: {
            isBusiness: false,
            paymentMethod: "cash",
            couponCode: couponCode?.trim() !== "" ? couponCode?.trim() : undefined,
        },
        headers: { Authorization: `Bearer ${token}` },
    });
};