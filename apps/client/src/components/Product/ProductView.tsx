import { useState } from "react";
import { ProductType } from "../../components/HomePage/interfaces/HomePageInterfaces";
import { useCart } from "../../utils/useCart/useCart";
import { IoMdClose } from "react-icons/io";
import { ToastContainer, toast, Slide } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import MiniFooter from "../HomePage/Footer/MiniFooter";

const ProductView = ({ 
    product, 
    selectedImage, 
    setSelectedImage 
}: { 
    product: ProductType; 
    selectedImage: string | null; 
    setSelectedImage: (image: string) => void; 
}) => {
    const { addToCart, cartItems } = useCart();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(
        product.images.findIndex(img => img.url === selectedImage) || 0
    );

    const successAddToCart = () => {
        toast.success('A termék a kosárba helyezve!', {
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

    const warnAlreadyInCart = () => {
        toast.warn('Ez a termék már a kosárban van!', {
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

    const categoryTranslations: { [key: string]: string } = {
        "UNIQUE_FLOWER_ARRANGEMENTS": "Virágkötészeti csodák",
        "DRY_PLANT_MOSS_ART": "Tartósított izlandi zuzmóból és egyéb szállított növényi részekből álló fali képek",
        "UNIQUE_WIRE_JEWELRY": "Egyedi drótékszerek",
    };    

    const handleAddToCart = () => {
        const productInCart = cartItems.some((item: ProductType) => item.id === product.id);

        if (productInCart) {
            warnAlreadyInCart();
            return;
        }

        addToCart(product.id);
        successAddToCart();
    };

    const openModal = () => {
        const selectedIndex = product.images.findIndex(img => img.url === selectedImage);
        setCurrentIndex(selectedIndex !== -1 ? selectedIndex : 0);
        setIsModalOpen(true);
    };    

    const closeModal = () => {
        setIsModalOpen(false);
    };

    const nextImage = () => {
        setCurrentIndex((prevIndex) =>
            prevIndex === product.images.length - 1 ? 0 : prevIndex + 1
        );
    };

    const prevImage = () => {
        setCurrentIndex((prevIndex) =>
            prevIndex === 0 ? product.images.length - 1 : prevIndex - 1
        );
    };

    return (
        <>
            <ToastContainer />
            <div className="container mx-auto px-5 pt-5 mt-8 flex flex-col min-h-[calc(100vh-104px)]">
                <div className="flex-grow">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    <div>
                        <div 
                            className="w-full h-96 flex items-center justify-center mb-4 rounded-lg overflow-hidden cursor-pointer"
                            onClick={openModal}
                        >
                            {selectedImage ? (
                                <img
                                    src={selectedImage}
                                    alt={product.name}
                                    className="max-w-full max-h-full object-contain"
                                />
                            ) : (
                                <p>Nincs kép</p>
                            )}
                        </div>

                        <div className="flex gap-4 justify-center">
                            {product.images.map((image, index) => (
                                <div
                                    key={index}
                                    className={`w-20 h-20 bg-gray-300 border rounded-lg overflow-hidden cursor-pointer ${
                                        selectedImage === image.url ? "ring-2 ring-primary" : ""
                                    }`}
                                    onClick={() => setSelectedImage(image.url)}
                                >
                                    <img
                                        src={image.url}
                                        alt={`${product.name} - ${index + 1}`}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="flex flex-col md:mt-12 lg:mt-12">
                        <div>
                            <p className="text-sm text-gray-500 mb-2">
                                {categoryTranslations[product.category] || "Ismeretlen kategória"}
                            </p>
                            <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
                            <p className="text-lg text-gray-700 mb-4">{product.description}</p>
                            <div className="text-2xl font-bold text-gray-900 mb-6">
                                {product.discountPrice ? (
                                    <div className="flex flex-col">
                                        <span className="line-through text-gray-800 font-light text-lg">
                                            {product.price.toLocaleString("hu-HU")} Ft
                                        </span>
                                        <span className="text-primary text-2xl font-bold">
                                            {product.discountPrice.toLocaleString("hu-HU")} Ft
                                        </span>
                                    </div>
                                ) : (
                                    <span className="text-2xl font-bold text-primary">
                                        {product.price.toLocaleString("hu-HU")} Ft
                                    </span>
                                )}
                            </div>
                        </div>

                        <button
                            className="w-full py-3 mb-10 bg-primary text-white text-lg font-semibold rounded-md disabled:bg-gray-400"
                            onClick={handleAddToCart}
                        >
                            Kosárba teszem
                        </button>

                        <div className="mt-6">
                            <div className="collapse bg-base-200 mt-2">
                                <input type="radio" name="my-accordion-1" />
                                <div className="collapse-title text-xl font-medium">Kapcsolat és ügyfélszolgálat</div>
                                <div className="collapse-content">
                                    <p><span className="font-semibold text-gray-500">E-mail</span>: <a href="mailto:info@drotvarazs.hu" className="text-primary">info@drotvarazs.hu</a></p>
                                    <p><span className="font-semibold text-gray-500">Telefon</span>: +36 30 123 4567</p>
                                </div>
                            </div>

                            <div className="collapse bg-base-200 mt-2">
                                <input type="radio" name="my-accordion-1" />
                                <div className="collapse-title text-xl font-medium">Szállítás és visszaküldés</div>
                                <div className="collapse-content">
                                    <p><span className="font-semibold text-gray-500">Szállítási idő</span>: 2-5 munkanap</p>
                                    <p><span className="font-semibold text-gray-500">Szállítási díj</span>: 1500 Ft</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {isModalOpen && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-90 z-50">
                        <div className="relative w-full max-w-10xl h-[99vh] flex flex-col items-center justify-center">
                            <button 
                                className="absolute top-5 right-5 text-white hover:text-red-500 text-4xl z-50"
                                onClick={closeModal}
                            >
                                <IoMdClose />
                            </button>

                            <div className="relative w-full flex items-center justify-center">
                                {/* Left Arrow */}
                                <button 
                                    onClick={prevImage} 
                                    className="absolute left-5 text-white bg-black bg-opacity-50 p-3 rounded-full hover:bg-opacity-75 transition"
                                >
                                    <FaChevronLeft className="text-2xl" />
                                </button>

                                {/* Image Display */}
                                <img
                                    src={product.images[currentIndex].url}
                                    alt={product.name}
                                    className="max-h-[80vh] object-contain"
                                />

                                {/* Right Arrow */}
                                <button 
                                    onClick={nextImage} 
                                    className="absolute right-5 text-white bg-black bg-opacity-50 p-3 rounded-full hover:bg-opacity-75 transition"
                                >
                                    <FaChevronRight className="text-2xl" />
                                </button>
                            </div>

                            {/* Navigation Dots */}
                            <div className="absolute bottom-5 flex space-x-2">
                                {product.images.map((_, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setCurrentIndex(index)}
                                        className={`w-3 h-3 rounded-full transition ${
                                            index === currentIndex ? "bg-white" : "bg-gray-400"
                                        }`}
                                    ></button>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
                </div>

                <MiniFooter />
            </div>
        </>
    );
};

export default ProductView;