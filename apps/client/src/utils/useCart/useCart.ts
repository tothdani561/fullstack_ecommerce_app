import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchCartItems, addToCart, removeFromCart, clearCart } from "./cartService";
import { useEffect, useState } from "react";
import { getValueFromToken } from "../getValueFromToken";
import { authEventEmitter } from "../authEventEmitter";

export const useUserId = () => {
  const [userId, setUserId] = useState<number | null>(null);

  useEffect(() => {
    const fetchUserId = () => {
      const token = localStorage.getItem("accessToken");
      if (token) {
        const id = getValueFromToken(token, "sub");
        console.log("[useUserId] User ID detected:", id);
        setUserId(id);
      } else {
        setUserId(null);
      }
    };

    fetchUserId();
    authEventEmitter.on("login", fetchUserId);
    return () => {
      authEventEmitter.off("login", fetchUserId);
    };
  }, []);

  return userId;
};

export const useCart = () => {
  const queryClient = useQueryClient();
  const userId = useUserId();

  const { data: cartItems = []} = useQuery({
    queryKey: ["cart", userId],
    queryFn: () => fetchCartItems(userId),
    enabled: !!userId,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    staleTime: 0,
  });

  const refreshCart = () => {
    if (userId) {
      queryClient.invalidateQueries({ queryKey: ["cart", userId] });
    }
  };

  const addToCartMutation = useMutation({
    mutationFn: (productId: number) => addToCart(userId, productId),
    onSuccess: () => refreshCart(),
  });

  const removeFromCartMutation = useMutation({
    mutationFn: (productId: number) => removeFromCart(userId, productId),
    onSuccess: () => refreshCart(),
  });

  const clearCartMutation = useMutation({
    mutationFn: () => clearCart(userId),
    onSuccess: () => refreshCart(),
  });

  return {
    cartItems,
    refreshCart,
    addToCart: addToCartMutation.mutate,
    removeFromCart: removeFromCartMutation.mutate,
    clearCart: clearCartMutation.mutate,
  };
};