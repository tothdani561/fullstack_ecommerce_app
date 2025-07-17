import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import MiniFooter from "../HomePage/Footer/MiniFooter";

interface OrderItem {
    id: number;
    product: {
        name: string;
        price: number;
        discountPrice?: number;
        images: { url: string }[];
    };
}

interface Order {
    id: number;
    createdAt: string;
    totalAmount: number;
    items: OrderItem[];
}

const OrdersComponent = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const navigate = useNavigate();

    const accessToken = localStorage.getItem("accessToken");

    useEffect(() => {
        if (!accessToken) {
            navigate("/login");
            return;
        }

        const fetchOrders = async () => {
            try {
                const response = await axios.post("/api/orders/completed", {}, {
                    headers: { Authorization: `Bearer ${accessToken}` },
                });
                setOrders(response.data);
            } catch (error) {
                console.error("Hiba történt a rendelések lekérésekor:", error);
            }
        };

        fetchOrders();
    }, [navigate, accessToken]);

    return (
        <div className="flex flex-col min-h-[calc(100vh-72px)]">
            <div className="flex-grow container mx-auto p-6 my-5">
                <h2 className="text-2xl font-semibold mb-4">Leadott rendelések</h2>
                {orders.length > 0 ? (
                    <div className="space-y-6">
                        {orders.map(order => (
                            <div key={order.id} className="border rounded-lg p-4 shadow-md">
                                <p className="text-gray-600">Rendelés dátuma: {new Date(order.createdAt).toLocaleString()}</p>
                                <p className="text-gray-800 font-semibold">Végösszeg: {order.totalAmount.toLocaleString("hu-HU")} Ft</p>
                                <div className="mt-3 space-y-4">
                                    {order.items.map(item => (
                                        <div key={item.id} className="flex gap-4 items-center pb-3">
                                            <div className="w-16 h-16 bg-gray-200 rounded-md overflow-hidden">
                                                <img 
                                                    src={item.product.images.length > 0 ? item.product.images[0].url : "/placeholder.png"} 
                                                    alt={item.product.name} 
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                            <div>
                                                <p className="font-medium">{item.product.name}</p>
                                                <p className="text-sm text-gray-500">
                                                    {item.product.discountPrice ? (
                                                        <>
                                                            <span className="line-through mr-2">{item.product.price.toLocaleString("hu-HU")} Ft</span>
                                                            <span className="text-primary font-semibold">{item.product.discountPrice.toLocaleString("hu-HU")} Ft</span>
                                                        </>
                                                    ) : (
                                                        `${item.product.price.toLocaleString("hu-HU")} Ft`
                                                    )}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-gray-500">Nincsenek leadott rendelések.</p>
                )}
            </div>

            <MiniFooter />
        </div>
    );
};

export default OrdersComponent;