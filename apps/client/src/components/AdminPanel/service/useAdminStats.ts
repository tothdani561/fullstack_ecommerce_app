// 📂 src/hooks/useAdminStats.ts
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchTotalProducts, fetchTotalOrders, fetchTotalUsers, fetchMonthlyCompletedOrders, fetchSalesData, fetchRecentOrders, fetchProductList, fetchProductByName, createCoupon } from "./adminService";

export const useTotalProducts = () => {
    return useQuery({
        queryKey: ["totalProducts"],
        queryFn: fetchTotalProducts,
        staleTime: 60000,
        enabled: !!localStorage.getItem("accessToken"),
    });
};

export const useTotalOrders = () => {
    return useQuery({
        queryKey: ["totalOrders"],
        queryFn: fetchTotalOrders,
        staleTime: 60000,
        enabled: !!localStorage.getItem("accessToken"),
    });
};

export const useTotalUsers = () => {
    return useQuery({
        queryKey: ["totalUsers"],
        queryFn: fetchTotalUsers,
        staleTime: 60000,
        enabled: !!localStorage.getItem("accessToken"),
    });
};

export const useMonthlyCompletedOrders = () => {
    return useQuery({
        queryKey: ["totalOrdersThisMonth"],
        queryFn: fetchMonthlyCompletedOrders,
        staleTime: 60000,
        enabled: !!localStorage.getItem("accessToken"),
    });
};

export const useSalesData = () => {
    return useQuery({
        queryKey: ["salesData"],
        queryFn: fetchSalesData,
        staleTime: 60000,
        enabled: !!localStorage.getItem("accessToken"),
    });
};

export const useRecentOrders = () => {
    return useQuery({
        queryKey: ["recentOrders"],
        queryFn: fetchRecentOrders,
        staleTime: 60000,
        enabled: !!localStorage.getItem("accessToken"),
    });
};

// 🆕 Hook: Összes termék listázása (ID + név)
export const useProductList = () => {
    return useQuery({
        queryKey: ["productList"],
        queryFn: fetchProductList,
        staleTime: 60000,
        enabled: !!localStorage.getItem("accessToken"),
    });
};

// 🆕 Hook: Termék keresése név alapján
export const useProductSearch = (name: string) => {
    return useQuery({
        queryKey: ["productSearch", name],
        queryFn: () => fetchProductByName(name),
        staleTime: 60000,
        enabled: !!name && !!localStorage.getItem("accessToken"),
    });
};

export const useCreateCoupon = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: createCoupon,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["couponList"] }); // 🆕 Frissíti a kuponlistát sikeres létrehozás után
        },
    });
};