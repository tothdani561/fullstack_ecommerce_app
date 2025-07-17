import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchProducts, fetchProductById, createProduct, uploadProductImages, updateProduct, deleteProduct, fetchLatestProducts } from "./productService";

export const useProducts = () => {
    return useQuery({
        queryKey: ["products"],
        queryFn: fetchProducts,
        staleTime: 60000,
    });
};

export const useProductById = (id: string) => {
    return useQuery({
        queryKey: ["product", id],
        queryFn: () => fetchProductById(id),
        enabled: !!id,
    });
};

export const useCreateProduct = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: createProduct,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["products"] });
        },
    });
};

export const useUpdateProduct = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: any }) => updateProduct(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["products"] });
        },
        onError: (error) => {
            console.error("API hiba:", error);
            alert("Hiba történt a termék frissítése során.");
        },
    });
};

export const useDeleteProduct = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => deleteProduct(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["products"] });
        },
        onError: (error) => {
            console.error("Hiba történt a termék törlése során:", error);
            alert("Hiba történt a termék törlése során.");
        },
    });
};

export const useLatestProducts = () => {
    return useQuery({
        queryKey: ["latestProducts"],
        queryFn: fetchLatestProducts,
        staleTime: 60000,
    });
};

export const useUploadProductImages = () => {
    return useMutation({
        mutationFn: ({ productId, images }: { productId: string; images: File[] }) =>
            uploadProductImages(productId, images),
    });
};