import { useSearchParams } from "react-router-dom";

export const useProductFilter = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    
    const selectedCategory = searchParams.get("category") || "";

    const setSelectedCategory = (category: string) => {
        const params = new URLSearchParams(searchParams);
        if (category) {
            params.set("category", category);
        } else {
            params.delete("category");
        }
        setSearchParams(params);
    };

    return { selectedCategory, setSelectedCategory };
};