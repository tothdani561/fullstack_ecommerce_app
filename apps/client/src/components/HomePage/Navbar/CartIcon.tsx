import { RiShoppingBagLine } from "react-icons/ri";
import { useCart } from "../../../utils/useCart/useCart"; // ✅ Helyes import
import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { IoMdClose } from "react-icons/io";

const CartIcon = () => {
    const { cartItems, removeFromCart, clearCart } = useCart();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const navigate = useNavigate();
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const toggleDropdown = () => setIsDropdownOpen((prev) => !prev);

    const handleNavigateToCart = () => {
        setIsDropdownOpen(false);
        navigate("/your-cart");
    };

    const handleNavigateToProduct = (productId: number) => {
        setIsDropdownOpen(false);
        navigate(`/product/${productId}`);
    };

    const totalPrice = cartItems.reduce(
        (sum: number, item: { discountPrice?: number; price: number }) => sum + (item.discountPrice ?? item.price),
        0
    );

    return (
        <div className="relative" ref={dropdownRef}>
            <button className="relative focus:outline-none" onClick={toggleDropdown}>
                <RiShoppingBagLine className="text-2xl text-gray-600 hover:text-primary transition-all duration-300" />
                {cartItems.length > 0 && (
                    <span className="absolute -bottom-1 -right-1 bg-black text-white text-xs font-bold rounded-full w-4 h-4 flex items-center justify-center">
                        {cartItems.length}
                    </span>
                )}
            </button>

            <div
                className={`absolute right-0 mt-2 w-64 bg-white shadow-lg rounded-md overflow-hidden z-10 
                            transition-all duration-300 ease-in-out transform 
                            ${isDropdownOpen ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-95 -translate-y-2 pointer-events-none"}`}
            >
                {cartItems.length > 0 ? (
                    <>
                        <div className="border-b border-gray-200 px-4 py-2 flex justify-center items-center">
                            <span className="font-medium text-primary">Kosár tartalma</span>
                        </div>
                        <ul className="divide-y divide-gray-200">
                            {cartItems.map((item: { id: number; name: string; price: number; discountPrice?: number }) => (
                                <li key={item.id} className="flex justify-between items-center px-4 py-2">
                                    <button
                                        className="text-sm w-32 text-gray-700 hover:underline text-left"
                                        onClick={() => handleNavigateToProduct(item.id)}
                                    >
                                        {item.name}
                                    </button>
                                    <div className="flex justify-end items-center space-x-2">
                                        <div className="text-base text-left">
                                            {item.discountPrice ? (
                                                <>
                                                    <span className="text-black text-sm line-through block">
                                                        {item.price.toLocaleString("hu-HU")} Ft
                                                    </span>
                                                    <span className="text-primary text-sm font-bold">
                                                        {item.discountPrice.toLocaleString("hu-HU")} Ft
                                                    </span>
                                                </>
                                            ) : (
                                                <span className="text-primary text-sm font-bold">
                                                    {item.price.toLocaleString("hu-HU")} Ft
                                                </span>
                                            )}
                                        </div>
                                        <button
                                            className="text-red-500 hover:text-red-600 text-lg"
                                            onClick={() => removeFromCart(item.id)}
                                            aria-label="Törlés"
                                        >
                                            <IoMdClose />
                                        </button>
                                    </div>
                                </li>
                            ))}
                        </ul>
                        <div className="border-t border-gray-200 px-4 py-2 flex justify-between items-center">
                            <span className="font-medium">Végösszeg:</span>
                            <span className="text-sm font-bold">{totalPrice.toLocaleString("hu-HU")} Ft</span>
                        </div>
                        <div className="border-t border-gray-200 px-3 py-2 flex gap-2">
                            <button className="w-[80%] bg-primary text-white py-1 rounded-md" onClick={handleNavigateToCart}>
                                Kosár tartalma
                            </button>
                            <button
                                className="w-[20%] bg-primary text-white py-1 rounded-md"
                                onClick={() => clearCart()}
                                aria-label="Kosár törlése"
                            >
                                X
                            </button>
                        </div>
                    </>
                ) : (
                    <div className="px-4 py-2 text-center text-gray-500">
                        <p>Üres kosár</p>
                        <button
                            className="mt-2 bg-primary text-white px-4 py-1 rounded-md transition w-full"
                            onClick={handleNavigateToCart}
                        >
                            Kosár tartalma
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CartIcon;