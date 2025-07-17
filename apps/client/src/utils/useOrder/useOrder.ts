import { useMutation } from "@tanstack/react-query";
import { createOrder } from "./orderService";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export const useOrder = () => {
    const navigate = useNavigate();
    const [couponError, setCouponError] = useState<string | null>(null);

    const orderMutation = useMutation({
        mutationFn: (couponCode?: string) => createOrder(couponCode),
        onSuccess: (data) => {
            console.log("✅ Rendelés sikeresen leadva:", data);
            navigate("/shipping");
        },
        onError: (error: any) => {
            console.error("❌ Hiba a rendelés során:", error);
            if (error.response && error.response.data) {
                const errorMessage =
                    error.response.data.message ||
                    (typeof error.response.data === "string" ? error.response.data : "Ismeretlen hiba történt.");
                setCouponError(errorMessage);
            } else {
                setCouponError("Hiba történt a rendelés során.");
            }
        },
    });

    return {
        createOrder: orderMutation.mutate,
        isLoading: orderMutation.isPending,
        couponError,
    };
};