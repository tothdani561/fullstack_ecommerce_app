import { useNavigate } from "react-router-dom";
import { useProductFilter } from "../../../utils/useProduct/useProductFilter";

const products = [
    { title: "Virágkötészeti csodák", img: "/csokor.jpg", category: "UNIQUE_FLOWER_ARRANGEMENTS" },
    { title: "Tartósított izlandi zuzmóból és egyéb szállított növényi részekből álló fali képek", img: "/HomePhoto1.jpg", category: "DRY_PLANT_MOSS_ART" },
    { title: "Egyedi Drótékszerek", img: "/drot.png", category: "UNIQUE_WIRE_JEWELRY" },
];

const ProductShowcase = () => {
    const navigate = useNavigate();
    const { setSelectedCategory } = useProductFilter();

    const handleCategoryClick = (category: string) => {
        setSelectedCategory(category);
        navigate(`/products-list?category=${category}`);
    };

    return (
        <div className="text-center p-10 mb-10">
            <h1 className="text-4xl font-bold text-pink-600">Köszöntünk a Drótvarázs Ékszer és Virág oldalán!</h1>
            <div className="flex justify-center items-center">
                <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 px-5 place-items-center">
                    {products.map((product, index) => (
                        <div 
                            key={index} 
                            className="relative group w-full max-w-xs sm:max-w-sm lg:max-w-md h-64 sm:h-72 lg:h-80 overflow-hidden rounded-xl shadow-lg cursor-pointer"
                        >
                            <div className="relative w-full h-full overflow-hidden">
                                <img src={product.img} alt={product.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                                <div className="absolute inset-0 bg-black bg-opacity-30 transition-all duration-500 group-hover:bg-opacity-0"></div>
                            </div>

                            <div className="absolute inset-0 flex flex-col justify-end pb-5 items-center text-white text-lg font-semibold opacity-100 group-hover:opacity-90 transition-opacity duration-500">
                                <p className="mb-3">{product.title}</p>
                                <button
                                    onClick={() => handleCategoryClick(product.category)}
                                    className="bg-pink-500 hover:bg-pink-600 text-white px-4 py-2 rounded-lg transition-all"
                                >
                                    Megnézem
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ProductShowcase;