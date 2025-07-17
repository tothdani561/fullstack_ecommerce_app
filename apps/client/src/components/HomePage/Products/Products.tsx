import { useNavigate, Link } from "react-router-dom";
import { useCart } from "../../../utils/useCart/useCart";
import { useProducts } from "../../../utils/useProduct/useProducts";
import { useProductFilter } from "../../../utils/useProduct/useProductFilter";
import { useState } from "react";
import { FaShoppingCart } from "react-icons/fa";

import { ToastContainer, toast, Slide } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Footer from "../Footer/Footer";

const CATEGORY_OPTIONS = [
    { value: "", label: "Összes kategória" },
    { value: "UNIQUE_FLOWER_ARRANGEMENTS", label: "Virágkötészeti csodák" },
    { value: "DRY_PLANT_MOSS_ART", label: "Tartósított izlandi zuzmóból és egyéb szállított növényi részekből álló fali képek" },
    { value: "UNIQUE_WIRE_JEWELRY", label: "Egyedi Drótékszerek" },
];

const Products = () => {
    const { addToCart, cartItems } = useCart();
    const { data: products, isLoading: loading, error } = useProducts();
    const { selectedCategory, setSelectedCategory } = useProductFilter();
    const [isCategoryOpen, setIsCategoryOpen] = useState(false);
    const [isSortOpen, setIsSortOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const navigate = useNavigate();
    const [sortOrder, setSortOrder] = useState<"" | "asc" | "desc">("");
    const [visibleProductsCount, setVisibleProductsCount] = useState(6);

    const handleAddToCart = async (productId: number) => {
        const productInCart = cartItems.some((item: { id: number }) => item.id === productId);

        if (productInCart) {
            toast.warn("Ez a termék már a kosárban van!", {
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
            return;
        }
        try {
            await addToCart(productId);
            toast.success("A termék a kosárba helyezve!", {
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
        } catch (error) {
            console.error(error);
            if (error instanceof Error && error.message.includes("Please log in")) {
                navigate("/login");
            } else {
                toast.error("Hiba történt a termék kosárba helyezésekor!", {
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
            }
        }
    };

    if (loading) return <p>Betöltés...</p>;
    if (error) return <p>Hiba történt: {error.message}</p>;

    let filteredProducts = [...(products || [])];

    if (selectedCategory) {
        filteredProducts = filteredProducts.filter((product) => product.category === selectedCategory);
    }

    if (searchQuery) {
        filteredProducts = filteredProducts.filter((product) =>
            product.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }

    if (sortOrder === "asc") {
        filteredProducts.sort((a, b) => a.price - b.price);
    } else if (sortOrder === "desc") {
        filteredProducts.sort((a, b) => b.price - a.price);
    }

    const displayedProducts = filteredProducts.slice(0, visibleProductsCount);

    return (
        <>
            <ToastContainer />
            <div className="flex flex-col min-h-[calc(100vh-72px)] justify-between">
                <div className="flex flex-col items-center p-5 mt-4">
                    <div className="w-full flex flex-wrap justify-center gap-4 mb-6 relative">
                        <div className="relative">
                            <button
                                onClick={() => setIsCategoryOpen((prev) => !prev)}
                                className="p-2 border rounded-md bg-white shadow-md hover:shadow-lg transition-all"
                            >
                                Kategória választás
                            </button>
                            {isCategoryOpen && (
                                <div className="absolute left-0 mt-2 w-64 bg-white shadow-lg rounded-md overflow-hidden z-20">
                                    {CATEGORY_OPTIONS.map((option) => (
                                        <button
                                            key={option.value}
                                            className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 transition"
                                            onClick={() => {
                                                setSelectedCategory(option.value);
                                                setIsCategoryOpen(false);
                                            }}
                                        >
                                            {option.label}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="relative">
                            <button
                                onClick={() => setIsSortOpen((prev) => !prev)}
                                className="p-2 border rounded-md bg-white shadow-md hover:shadow-lg transition-all"
                            >
                                Rendezés
                            </button>
                            {isSortOpen && (
                                <div className="absolute left-0 mt-2 w-64 bg-white shadow-lg rounded-md overflow-hidden z-20">
                                    <button
                                        className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 transition"
                                        onClick={() => {
                                            setSortOrder("");
                                            setIsSortOpen(false);
                                        }}
                                    >
                                        Alapértelmezett
                                    </button>
                                    <button
                                        className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 transition"
                                        onClick={() => {
                                            setSortOrder("asc");
                                            setIsSortOpen(false);
                                        }}
                                    >
                                        Ár: Növekvő
                                    </button>
                                    <button
                                        className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 transition"
                                        onClick={() => {
                                            setSortOrder("desc");
                                            setIsSortOpen(false);
                                        }}
                                    >
                                        Ár: Csökkenő
                                    </button>
                                </div>
                            )}
                        </div>

                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Keresés..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="p-2 border rounded-md bg-white shadow-md focus:ring-2 focus:ring-primary transition-all"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 place-items-center my-3">
                        {displayedProducts.length > 0 ? (
                            displayedProducts.map((product) => (
                                <div key={product.id} className="bg-base-100 w-72 shadow hover:shadow-md transition-shadow rounded-t-xl flex flex-col justify-between relative">
                                    {product.discountPrice > 0 && product.discountPrice < product.price && (
                                        <div className="absolute top-3 right-0 bg-primary text-white text-lg font-bold px-4 py-1 rounded-s-full shadow-lg z-10">
                                            %
                                        </div>
                                    )}
                                    <figure className="w-full h-72 overflow-hidden relative group">
                                        <img
                                            src={
                                                product.images.length > 0
                                                    ? product.images[0].url
                                                    : "https://img.daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.webp"
                                            }
                                            alt={product.name}
                                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 cursor-pointer"
                                            onClick={() => navigate(`/product/${product.id}`)}
                                        />
                                    </figure>
                                    <div className="p-3 flex-1 flex flex-col justify-between">
                                        <h2 className="text-sm text-gray-700 line-clamp-2 text-left h-10 overflow-hidden decoration-1 decoration-gray-500 underline-offset-4 hover:underline hover:decoration-gray-700 hover:text-gray-800 transition-all duration-300 hover:cursor-pointer">
                                            <Link to={`/product/${product.id}`}>{product.name}</Link>
                                        </h2>
                                        <div className="flex justify-between items-center mt-4">
                                            <div className="text-base text-left">
                                                {product.discountPrice ? (
                                                    <>
                                                        <span className="text-gray-500 line-through mr-2">
                                                            {product.price.toLocaleString("hu-HU")} Ft
                                                        </span>
                                                        <span className="text-primary font-bold">
                                                            {product.discountPrice.toLocaleString("hu-HU")} Ft
                                                        </span>
                                                    </>
                                                ) : (
                                                    <span>{product.price.toLocaleString("hu-HU")} Ft</span>
                                                )}
                                            </div>
                                            <button
                                                className="text-gray-500 hover:text-primary transition-all"
                                                aria-label="Add to Cart"
                                                onClick={() => handleAddToCart(product.id)}
                                            >
                                                <FaShoppingCart className="text-xl" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-gray-500">Nincsenek elérhető termékek.</p>
                        )}
                    </div>
                    {visibleProductsCount < filteredProducts.length && (
                        <button
                            onClick={() => setVisibleProductsCount((prevCount) => prevCount + 6)}
                            className="my-4 px-6 py-3 bg-primary text-white text-lg font-semibold rounded-md hover:bg-primary-dark transition-all"
                        >
                            További termékek betöltése
                        </button>
                    )}
                </div>

                <Footer />
            </div>
        </>
    );
};

export default Products;