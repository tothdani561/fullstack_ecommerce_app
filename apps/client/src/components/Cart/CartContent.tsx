import { useState } from "react";
import { useCart } from "../../utils/useCart/useCart";
import { useOrder } from "../../utils/useOrder/useOrder";
import { IoMdClose } from "react-icons/io";
import MiniFooter from "../HomePage/Footer/MiniFooter";

import { ToastContainer, toast, Slide } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";

const CartContent = () => {
    const { cartItems, removeFromCart, clearCart } = useCart();
    const { createOrder, isLoading, couponError } = useOrder();
    const SHIPPING_COST = 1500;
    const [couponCode, setCouponCode] = useState("");
    const navigate = useNavigate();

    const totalPrice = cartItems.reduce((sum: number, item: { price: number; discountPrice?: number }) => sum + (item.discountPrice ?? item.price), 0);
    const finalPrice = totalPrice + SHIPPING_COST;

    const notifyItemRemoved = () => {
        toast.success('Termék eltávolítva a kosárból!', {
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

    const notifyCartCleared = () => {
        toast.success('Kosár sikeresen kiürítve!', {
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

    return (
        <>
            <ToastContainer />
            <div className="flex flex-col min-h-[calc(100vh-72px)] pt-8">
                <div className="flex-grow container mx-auto p-5">
                    <h1 className="text-3xl font-bold mb-6 text-primary">Kosár tartalma</h1>

                    {cartItems.length > 0 ? (
                        <div className="space-y-4">
                            <ul className="divide-y divide-gray-200">
                                {cartItems.map((item: { id: number; name: string; price: number; discountPrice?: number; images?: { url: string }[] }) => (
                                    <li key={item.id} className="flex justify-between items-center py-4">
                                        <div className="flex items-center gap-4">
                                            <div className="w-20 h-20 bg-gray-200 rounded-md overflow-hidden">
                                                <img
                                                    src={item.images?.[0]?.url || "/placeholder.jpg"}
                                                    alt={item.name}
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                            <div>
                                            <p
                                                className="text-base font-semibold max-w-[300px] text-gray-700 cursor-pointer hover:underline"
                                                onClick={() => navigate(`/product/${item.id}`)}
                                            >
                                                {item.name}
                                            </p>
                                                <div className="text-sm flex items-center gap-2">
                                                    {item.discountPrice ? (
                                                        <>
                                                            <p className="text-gray-500 line-through">{item.price.toLocaleString("hu-HU")} Ft</p>
                                                            <p className="text-primary font-semibold">{item.discountPrice.toLocaleString("hu-HU")} Ft</p>
                                                        </>
                                                    ) : (
                                                        <p className="text-gray-500">{item.price.toLocaleString("hu-HU")} Ft</p>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                        <button
                                            className="text-red-500 hover:text-red-700 text-xl"
                                            onClick={() => {
                                                removeFromCart(item.id);
                                                notifyItemRemoved(); // ✅ Termék törlése után értesítés
                                            }}
                                            aria-label="Törlés"
                                        >
                                            <IoMdClose />
                                        </button>
                                    </li>
                                ))}
                            </ul>
                            <div className="border-t border-gray-200 pt-4 flex justify-between items-center">
                                <div className="text-lg">
                                    <p>Összeg: <span className="text-base">{totalPrice.toLocaleString("hu-HU")} Ft</span></p>
                                    <p>Szállítási díj: <span className="text-base">{SHIPPING_COST.toLocaleString("hu-HU")} Ft</span></p>
                                </div>
                                <div className="font-semibold">
                                    Végösszeg: <span className="text-primary">{finalPrice.toLocaleString("hu-HU")} Ft</span>
                                </div>
                            </div>
                            <div className="mb-4">
                                <label htmlFor="couponCode" className="block text-sm font-medium text-gray-700 mb-2">
                                    Kuponkód:
                                </label>
                                <input
                                    type="text"
                                    id="couponCode"
                                    value={couponCode}
                                    onChange={(e) => setCouponCode(e.target.value)}
                                    placeholder="Add meg a kuponkódot"
                                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-pink-500 focus:border-pink-500"
                                />
                                {couponError && (
                                    <p className="text-red-500 text-sm mt-2">{couponError}</p>
                                )}
                            </div>
                            <div className="flex gap-5 transition-all duration-300">
                                <button
                                    className="w-[80%] py-3 bg-primary text-white text-lg font-semibold rounded-md"
                                    onClick={() => createOrder(couponCode)}
                                    disabled={isLoading}
                                >
                                    {isLoading ? "Feldolgozás..." : "Tovább a rendeléshez"}
                                </button>
                                <button
                                    className="w-[20%] py-3 bg-primary text-white text-lg font-semibold rounded-md"
                                    onClick={() => {
                                        clearCart();
                                        notifyCartCleared(); // ✅ Kosár kiürítése után értesítés
                                    }}
                                >
                                    Kosár ürítése
                                </button>
                            </div>
                        </div>
                    ) : (
                        <p className="text-center text-gray-500">A kosár üres.</p>
                    )}
                </div>

                <MiniFooter />
            </div>
        </>
    );
};

export default CartContent;