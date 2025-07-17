import axios from "axios";
import { apiRequest } from "../../utils/axiosInstance";

export const fetchProducts = async () => {
    try {
        const response = await axios.get("/api/product");
        return response.data;
    } catch (error) {
        console.error("Hiba történt a termékek lekérésekor:", error);
        throw error;
    }
};

export const fetchProductById = async (id: string) => {
    try {
        const response = await axios.get(`/api/product/${id}`);
        return response.data;
    } catch (error) {
        console.error(`❌ Hiba történt a termék (${id}) lekérésekor:`, error);
        throw error;
    }
};

export const createProduct = async (data: any) => {
    return await apiRequest("/product", { method: "POST", data });
};

export const fetchLatestProducts = async () => {
    try {
        const response = await axios.get("/api/product/latest-products");
        return response.data;
    } catch (error) {
        console.error("❌ Hiba történt a legújabb termékek lekérésekor:", error);
        throw error;
    }
};

export const updateProduct = async (id: string, data: any) => {
    const formattedData: any = {
        name: data.name,
        description: data.description,
        price: Number(data.price),
        stock: data.stock === "true" || data.stock === true,
        category: data.category,
    };

    if (data.discountPrice !== undefined && data.discountPrice !== null && data.discountPrice !== "") {
        formattedData.discountPrice = Number(data.discountPrice);
    }

    console.log("📤 API-nak küldött adat:", formattedData);

    return await apiRequest(`/product/${id}`, {
        method: "PUT",
        data: formattedData,
    });
};

export const deleteProduct = async (id: string) => {
    return await apiRequest(`/product/${id}`, {
        method: "DELETE",
    });
};

export const uploadProductImages = async (productId: string, images: File[]) => {
    const formData = new FormData();
    images.forEach((image) => formData.append("files", image));

    return await apiRequest(`/product/${productId}/upload`, { 
        method: "POST", 
        data: formData, 
        headers: { "Content-Type": "multipart/form-data" },
    });
};