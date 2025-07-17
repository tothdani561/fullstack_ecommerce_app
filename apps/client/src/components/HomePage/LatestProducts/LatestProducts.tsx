import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLatestProducts } from "../../../utils/useProduct/useProducts";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../../utils/useCart/useCart";

import { ToastContainer, toast, Slide } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const LatestProducts = () => {
    const { data: latestProducts, isLoading, error } = useLatestProducts();
    const { addToCart, cartItems } = useCart();
    const [currentPage, setCurrentPage] = useState(0);
    const productsPerPage = 4;
    const navigate = useNavigate();

    if (isLoading) return <p className="text-center text-gray-500">Betöltés...</p>;
    if (error) return <p className="text-center text-red-500">Hiba történt az adatok betöltésekor.</p>;

    const products = latestProducts || [];
    const totalPages = Math.ceil(products.length / productsPerPage);
    const displayedProducts = products.slice(
        currentPage * productsPerPage,
        (currentPage + 1) * productsPerPage
    );

    const showSuccessToast = () => {
        toast.success("A termék a kosárba helyezve.", {
            position: "top-right",
            autoClose: 4000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
            transition: Slide,
        });
    };

    const showAlreadyInCartToast = () => {
        toast.warn("A termék már a kosárban van!", {
            position: "top-right",
            autoClose: 4000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
            transition: Slide,
        });
    };

    const handleAddToCart = async (productId: number) => {
        const isAlreadyInCart = cartItems.some((item: { id: number }) => item.id === productId);

        if (isAlreadyInCart) {
            showAlreadyInCartToast();
            return;
        }
        try {
            await addToCart(productId);
            showSuccessToast();
        } catch (error) {
            console.error(error);
            if (error instanceof Error && error.message.includes("Please log in")) {
                navigate("/login");
            } else {
                alert("Hiba történt a termék kosárba helyezésekor.");
            }
        }
    };

    return (
        <>
            <ToastContainer />
            <div className="flex flex-col items-center p-5 mt-4 w-full max-w-7xl mx-auto mb-12">
                <h2 className="text-4xl font-bold text-pink-600 mb-9 pl-4 sm:pl-6 md:pl-8 xl:pl-0">
                    Legújabb termékeink
                </h2>

                <div className="relative overflow-hidden w-full md:max-w-[680px] xl:max-w-full">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentPage}
                            initial={{ x: "100%", opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            exit={{ x: "-100%", opacity: 0 }}
                            transition={{ duration: 0.5, ease: "easeInOut" }}
                            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 xl:grid-cols-4 gap-6 place-items-center w-full"
                        >
                            {displayedProducts.map((product: { id: string; name: string; price: number; discountPrice: number; images?: { url: string }[] }) => (
                                <div 
                                    key={product.id} 
                                    className="w-72 shadow hover:shadow-md transition-shadow rounded-t-xl flex flex-col justify-between relative"
                                >
                                    {product.discountPrice > 0 && product.discountPrice < product.price && (
                                        <div className="absolute top-3 right-0 bg-pink-500 text-white text-lg font-bold px-4 py-1 rounded-s-full shadow-lg z-10">
                                            %
                                        </div>
                                    )}

                                    <figure 
                                        className="w-full h-72 overflow-hidden relative cursor-pointer group"
                                        onClick={() => navigate(`/product/${product.id}`)}
                                    >
                                        <img
                                            src={product.images?.[0]?.url || "https://img.daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.webp"}
                                            alt={product.name}
                                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                        />
                                    </figure>

                                    {/* Tartalom */}
                                    <div className="p-3 flex-1 flex flex-col justify-between">
                                        <h2 
                                            className="text-sm text-gray-700 line-clamp-2 text-left h-10 overflow-hidden decoration-1 decoration-gray-500 underline-offset-4 hover:underline hover:decoration-gray-700 hover:text-gray-800 transition-all duration-300 hover:cursor-pointer"
                                            onClick={() => navigate(`/product/${product.id}`)}
                                        >
                                            {product.name}
                                        </h2>

                                        <div className="flex justify-between items-center mt-4">
                                            <div className="text-base text-left">
                                                {product.discountPrice ? (
                                                    <>
                                                        <span className="text-gray-500 line-through mr-2">
                                                            {product.price.toLocaleString("hu-HU")} Ft
                                                        </span>
                                                        <span className="text-pink-600 font-bold">
                                                            {product.discountPrice.toLocaleString("hu-HU")} Ft
                                                        </span>
                                                    </>
                                                ) : (
                                                    <span>{product.price.toLocaleString("hu-HU")} Ft</span>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Kosárba rak gomb */}
                                    <button 
                                        className="mt-4 w-full bg-primary text-white py-2 rounded"
                                        onClick={() => handleAddToCart(Number(product.id))} // ⬅️ Kosárba rakás
                                    >
                                        Kosárba
                                    </button>
                                </div>
                            ))}
                        </motion.div>
                    </AnimatePresence>
                </div>
                {totalPages > 1 && (
                    <div className="flex justify-center mt-6 space-x-3">
                        {Array.from({ length: totalPages }, (_, i) => (
                            <button
                                key={i}
                                className={`w-12 h-2 rounded-full transition ${
                                    currentPage === i ? "bg-pink-600" : "bg-gray-300"
                                }`}
                                onClick={() => setCurrentPage(i)}
                            ></button>
                        ))}
                    </div>
                )}
            </div>
        </>
    );
};

export default LatestProducts;
