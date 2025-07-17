import { apiRequest } from "../../../utils/axiosInstance";

export const fetchTotalProducts = async (): Promise<number> => {
    const response = await apiRequest("/admin/total-products", { method: "GET" });
    return response.totalProducts;
};

export const fetchTotalOrders = async (): Promise<number> => {
    const response = await apiRequest("/admin/total-orders", { method: "GET" });
    return response.totalOrders;
};

export const fetchTotalUsers = async (): Promise<number> => {
    const response = await apiRequest("/admin/total-users", { method: "GET" });
    return response.totalUsers;
};

export const fetchMonthlyCompletedOrders = async (): Promise<number> => {
    const response = await apiRequest("/admin/total-orders-this-month", { method: "GET" });
    return response.totalOrdersThisMonth;
};

export const fetchSalesData = async (): Promise<any> => {
    const response = await apiRequest("/admin/sales-data", { method: "GET" });
    return response.salesData;
};

export const fetchRecentOrders = async (): Promise<any> => {
    const response = await apiRequest("/admin/recent-orders", { method: "GET" });
    return response.recentOrders;
};

// 🆕 Termékek listázása (ID + név)
export const fetchProductList = async (): Promise<{ id: number; name: string }[]> => {
    const response = await apiRequest("/admin/list", { method: "GET" });
    return response;
};

// 🆕 Termék keresése név alapján
export const fetchProductByName = async (name: string): Promise<{ id: number; name: string }[]> => {
    const response = await apiRequest(`/admin/search/${name}`, { method: "GET" });
    return response;
};

export const createCoupon = async (couponData: { code: string; discount: number; type: string }) => {
    return await apiRequest("/coupons", {method: "POST", data: couponData,});
};