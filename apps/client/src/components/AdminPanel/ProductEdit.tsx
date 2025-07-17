import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useProductSearch } from "./service/useAdminStats";
import { useUpdateProduct, useProductById } from "../../utils/useProduct/useProducts";

const categories = [
    "UNIQUE_FLOWER_ARRANGEMENTS",
    "DRY_PLANT_MOSS_ART",
    "UNIQUE_WIRE_JEWELRY",
];

const ProductEditComponent = () => {
    const { register, handleSubmit, reset, setValue } = useForm();
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedProduct, setSelectedProduct] = useState<number | null>(null);

    const { data: searchResults } = useProductSearch(searchTerm);
    const { data: product, refetch } = useProductById(selectedProduct?.toString() ?? "");
    const updateProductMutation = useUpdateProduct();

    useEffect(() => {
        if (product) {
            reset();
            Object.entries(product).forEach(([key, value]) => setValue(key, value));
            setSearchTerm("");
        }
    }, [product, setValue, reset]);

    const onSubmit = async (data: any) => {
        if (!selectedProduct) return alert("Válassz ki egy terméket!");
        
        const formattedData = {
            ...data,
            price: parseFloat(data.price), 
            discountPrice: data.discountPrice ? parseFloat(data.discountPrice) : undefined, 
            stock: data.stock === "true" || data.stock === true,
        };
    
        try {
            await updateProductMutation.mutateAsync({ id: selectedProduct.toString(), data: formattedData });
            refetch(); 
        } catch (error) {
            console.error("❌ Hiba történt:", error);
            alert("❌ Hiba történt a frissítés során.");
        }
    };

    return (
        <div className="max-w-2xl mx-auto p-6 bg-white border shadow-lg rounded-lg">
            <h2 className="text-xl font-bold mb-4">✏️ Termék szerkesztése</h2>

            <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Keresés termék név alapján..."
                className="w-full p-2 border rounded mb-4"
            />

            {(searchResults?.length ?? 0) > 0 && (
                <ul className="border p-2 rounded max-h-40 overflow-auto">
                    {searchResults?.map((prod) => (
                        <li 
                            key={prod.id} 
                            className="cursor-pointer hover:bg-gray-200 p-2 rounded"
                            onClick={() => setSelectedProduct(prod.id)}
                        >
                            {prod.name}
                        </li>
                    ))}
                </ul>
            )}

            {selectedProduct && product && (
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-4">
                    <input {...register("name")} placeholder="Termék neve" className="w-full p-2 border rounded" />
                    <textarea {...register("description")} placeholder="Leírás" className="w-full p-2 border rounded" />
                    <input {...register("price")} type="number" placeholder="Ár (Ft)" className="w-full p-2 border rounded" />
                    <input {...register("discountPrice")} type="number" placeholder="Akciós ár (Ft)" className="w-full p-2 border rounded" />

                    <label className="flex items-center space-x-2">
                        <input type="checkbox" {...register("stock")} onChange={(e) => setValue("stock", e.target.checked)} />
                        <span>Raktáron van</span>
                    </label>

                    <select {...register("category")} className="w-full p-2 border rounded">
                        <option value="">Válassz kategóriát</option>
                        {categories.map((cat) => (
                            <option key={cat} value={cat}>{cat}</option>
                        ))}
                    </select>

                    <button type="submit" className="w-full bg-primary text-white py-2 rounded">
                        🚀 Mentés
                    </button>
                </form>
            )}
        </div>
    );
};

export default ProductEditComponent;