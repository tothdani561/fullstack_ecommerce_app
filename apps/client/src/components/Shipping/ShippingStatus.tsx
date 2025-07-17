import { useEffect, useState } from "react";
import { apiRequest } from "../../utils/axiosInstance";
import { useNavigate } from "react-router-dom";

const ShippingStatus = () => {
    const [status, setStatus] = useState<"loading" | "success" | "failed">("loading");
    const navigate = useNavigate();

    useEffect(() => {
        const checkPaymentStatus = async () => {
            const urlParams = new URLSearchParams(window.location.search);
            const paymentId = urlParams.get("paymentId");

            if (!paymentId) {
                setStatus("failed");
                return;
            }

            try {
                const response = await apiRequest("/payment/status", {
                    method: "GET",
                    params: { paymentId },
                });

                console.log("Barion Payment Status:", response);

                if (response?.data?.Status === "Succeeded") {
                    console.log("✅ Fizetés sikeres, rendelés frissítése COMPLETED-re...");

                    let pendingOrder = null;

                    try {
                        pendingOrder = await apiRequest("/orders/pending", {
                            method: "POST",
                        });
                    } catch (error) {
                        console.warn("⚠️ Nem található PENDING rendelés.");
                    }

                    if (pendingOrder?.id) {
                        console.log("🔄 Frissítendő rendelés ID:", pendingOrder.id);

                        await apiRequest(`/orders/complete/${pendingOrder.id}`, {
                            method: "PUT",
                        });

                        console.log("✅ Rendelés státusza COMPLETED-re frissítve.");
                        setStatus("success");
                        removePaymentIdFromURL();
                        return;
                    }

                    let completedOrders = [];
                    try {
                        completedOrders = await apiRequest("/orders/completed", {
                            method: "POST",
                        });
                    } catch (error) {
                        console.warn("⚠️ Nem található COMPLETED rendelés sem.");
                    }

                    if (completedOrders && completedOrders.length > 0) {
                        console.log("✅ Rendelés már COMPLETED, átnavigálás success oldalra.");
                        setStatus("success");
                        removePaymentIdFromURL();
                        return;
                    }

                    console.warn("❌ Nem sikerült megtalálni a rendelést.");
                    setStatus("failed");
                } else {
                    console.warn("⚠️ Fizetés nem sikerült.");
                    setStatus("failed");
                }
                
                removePaymentIdFromURL();
            } catch (error: any) {
                console.error("❌ Hiba történt a fizetés állapotának lekérdezésekor:", error);

                if (error?.response?.status === 401 || error?.response?.status === 403) {
                    console.warn("⚠️ Token lejárt, várunk az új API-hívásra...");
                    return;
                }

                setStatus("failed");
                removePaymentIdFromURL();
            }
        };

        checkPaymentStatus();
    }, []);

    // 🔹 **Eltávolítjuk a paymentId-t az URL-ből**
    const removePaymentIdFromURL = () => {
        const newUrl = window.location.origin + window.location.pathname;
        window.history.replaceState({}, document.title, newUrl);
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen text-center">
            {status === "loading" && (
                <div className="bg-white shadow-lg rounded-2xl p-8 max-w-lg w-full">
                    <h1 className="text-2xl font-bold text-gray-800">Fizetés ellenőrzése...</h1>
                    <p className="text-gray-600 mt-2">Kérlek, várj egy pillanatot.</p>
                </div>
            )}

            {status === "success" && (
                <div className="p-8 max-w-lg w-full">
                    <h1 className="text-4xl font-bold text-gray-800">Megrendelés sikeresen megtörtént!</h1>
                    <p className="text-gray-600 mt-2">Köszönjük a rendelésed!</p>
                    <button
                        className="mt-6 px-6 py-3 bg-primary text-white font-semibold rounded-lg shadow-md"
                        onClick={() => navigate("/")}
                    >
                        Vissza a főoldalra
                    </button>
                </div>
            )}

            {status === "failed" && (
                <div className="p-8 max-w-lg w-full">
                    <h1 className="text-4xl font-bold text-gray-800">Megrendelés sikertelen!</h1>
                    <p className="text-lg text-gray-600 mt-2">Térj vissza a főoldalra.</p>
                    <button
                        className="mt-6 px-6 py-3 bg-primary text-white font-semibold rounded-lg shadow-md"
                        onClick={() => navigate("/")}
                    >
                        Vissza a főoldalra
                    </button>
                </div>
            )}
        </div>
    );
};

export default ShippingStatus;
