import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useProductById } from "../../utils/useProduct/useProducts"; // ✅ React Query Hook
import Navbar from "../../components/HomePage/Navbar/Navbar";
import ProductView from "../../components/Product/ProductView";

const ProductPage = () => {
    const { id } = useParams();
    const { data: selectedProduct, isLoading: loading, error } = useProductById(id!);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);

    useEffect(() => {
        if (selectedProduct?.images?.length) {
            setSelectedImage(selectedProduct.images[0].url);
        }
    }, [selectedProduct]);

    if (loading) {
        return <p>Betöltés...</p>;
    }

    if (error) {
        return <p>Hiba történt: {error.message}</p>;
    }

    if (!selectedProduct) {
        return <p>Nincs ilyen termék.</p>;
    }

    return (
        <>
            <Navbar />
            <ProductView 
                product={selectedProduct} 
                selectedImage={selectedImage} 
                setSelectedImage={setSelectedImage} 
            />
        </>
    );
};

export default ProductPage;