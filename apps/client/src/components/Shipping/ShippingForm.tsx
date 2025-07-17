import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiRequest } from "../../utils/axiosInstance";

const ShippingForm: React.FC = () => {
    const navigate = useNavigate();
    const [showBilling, setShowBilling] = useState(false);
    const [isBusiness, setIsBusiness] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState("cash");
    const [formData, setFormData] = useState({
        firstname: "",
        lastname: "",
        phone: "",
        email: "",
        zipCode: "",
        city: "",
        street: "",
        streetType: "",
        houseNumber: "",
        extra: "",

        billingFirstname: "",
        billingLastname: "",
        billingPhone: "",
        billingZipCode: "",
        billingCity: "",
        billingStreet: "",
        billingStreetType: "",
        billingHouseNumber: "",
        billingExtra: "",
        companyName: "",
        taxNumber: "",
    });

    const [orderId, setOrderId] = useState<number | null>(null);
    const [validationErrors, setValidationErrors] = useState<string[]>([]);

    useEffect(() => {
        const fetchPendingOrder = async () => {
            try {
                const res = await apiRequest("/orders/pending", { method: "POST" });
    
                if (res && res.id) {
                    setOrderId(Number(res.id));
                    console.log("Lekért orderId:", res.id);
                } else {
                    console.warn("⚠️ Az API nem adott vissza érvényes orderId-t:", res);
                }
            } catch (err) {
                console.error("❌ Nincs pending order vagy más hiba történt:", err);
            }
        };
    
        fetchPendingOrder();
    }, []);

    const isFormValid = () => {
        const requiredFields = [
            "firstname",
            "lastname",
            "phone",
            "email",
            "zipCode",
            "city",
            "street",
            "streetType",
            "houseNumber",
        ];
    
        if (isBusiness || showBilling) {
            requiredFields.push(
                "billingFirstname",
                "billingLastname",
                "billingPhone",
                "billingZipCode",
                "billingCity",
                "billingStreet",
                "billingStreetType",
                "billingHouseNumber"
            );
    
            if (isBusiness) {
                requiredFields.push("companyName", "taxNumber");
            }
        }
    
        const missingFields = requiredFields.filter(field => !formData[field as keyof typeof formData]);
    
        setValidationErrors(missingFields);
        
        return missingFields.length === 0;
    };    

    const handleSubmit = async () => {
        if (!isFormValid()) {
            console.warn("Hiányzó mezők:", validationErrors);
            return;
        }
    
        if (!orderId) {
            console.warn("Nincs orderId, nem tudunk menteni!");
            return;
        }
    
        const token = localStorage.getItem("accessToken");
        if (!token) {
            console.warn("Nincs bejelentkezett felhasználó!");
            return;
        }
    
        if (isBusiness) {
            try {
                const updateBusinessResponse = await apiRequest(
                    `/orders/update-business/${orderId}`,
                    {
                        method: "PUT",
                        data: { isBusiness: true },
                    }
                );
        
                console.log("✅ isBusiness sikeresen frissítve:", updateBusinessResponse);
            } catch (error) {
                console.error("❌ Hiba történt az isBusiness frissítésénél:", error);
                return;
            }
        }

        if (paymentMethod === "barion") {
            try {
                await apiRequest(
                    `/orders/update-payment/${orderId}`,
                    {
                        method: "PUT",
                        data: { paymentMethod: "barion" },
                    }
                );
        
                console.log("✅ paymentMethod sikeresen frissítve.");
            } catch (error) {
                console.error("❌ Hiba történt a paymentMethod frissítésénél:", error);
                return;
            }
        }
    
        try {
            const shippingPayload = {
                firstName: formData.firstname,
                lastName: formData.lastname,
                phone: formData.phone,
                email: formData.email,
                zipCode: formData.zipCode,
                city: formData.city,
                street: formData.street,
                streetType: formData.streetType,
                houseNumber: formData.houseNumber,
                extra: formData.extra,
            };
    
            console.log("Elküldött Shipping:", shippingPayload);
    
            await apiRequest(
                `/orders/${orderId}/shipping`,
                {
                    method: "POST",
                    data: shippingPayload,
                }
            );
    
            const billingPayload = {
                firstName: formData.billingFirstname || formData.firstname,
                lastName: formData.billingLastname || formData.lastname,
                phone: formData.billingPhone || formData.phone,
                zipCode: formData.billingZipCode || formData.zipCode,
                city: formData.billingCity || formData.city,
                street: formData.billingStreet || formData.street,
                streetType: formData.billingStreetType || formData.streetType,
                houseNumber: formData.billingHouseNumber || formData.houseNumber,
                extra: formData.billingExtra || formData.extra,
                companyName: isBusiness ? formData.companyName : "",
                taxNumber: isBusiness ? formData.taxNumber : "",
            };
    
            console.log("Elküldött Billing:", billingPayload);
    
            await apiRequest(
                `/orders/${orderId}/billing`,
                {
                    method: "POST",
                    data: billingPayload,
                }
            );
    
            if (paymentMethod === "cash") {
                await apiRequest(
                    `/orders/complete/${orderId}`,
                    {
                        method: "PUT",
                        data: {},
                    }
                );
                console.log("Utánvételes rendelés státusza COMPLETED-re frissítve.");
                navigate("/shipping-success");
                return;
            }
    
            if (paymentMethod === "barion") {
                console.log("Barion fizetés indítása...");
            
                try {
                    const paymentResponse = await apiRequest(`/payment/start?orderId=${orderId}`, {
                        method: "GET",
                    });
            
                    console.log(paymentResponse?.data?.GatewayUrl);
                    if (paymentResponse?.data?.GatewayUrl) {
                        console.log("Kapott Barion URL:", paymentResponse.data.GatewayUrl);
                        window.location.href = paymentResponse.data.GatewayUrl;
                    } else {
                        console.error("Hiba: Nem érkezett érvényes Barion URL");
                    }
                } catch (error) {
                    console.error("Hiba történt a Barion fizetés indításakor:", error);
                }
            }
    
        } catch (error) {
            console.error("Hiba a shipping/billing mentésénél:", error);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;

        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));

        setValidationErrors(prevErrors => {
            const updatedErrors = prevErrors.filter(error => error !== name);
            return updatedErrors.length === 0 ? [] : updatedErrors;
        });
    };

    return (
        <div className="max-w-lg mx-auto p-6 bg-white shadow-lg border rounded-2xl mt-8 mb-4">
            <h2 className="text-xl font-semibold mb-4">Szállítási és számlázási cím</h2>

            <div className="flex gap-4 mb-4">
                <button className={`flex-1 py-2 border rounded-lg font-medium ${!isBusiness ? "bg-gray-100" : ""}`} onClick={() => setIsBusiness(false)}>
                    Magánszemély
                </button>
                <button className={`flex-1 py-2 border rounded-lg font-medium ${isBusiness ? "bg-gray-100" : ""}`} onClick={() => setIsBusiness(true)}>
                    Vállalkozás/szervezet
                </button>
            </div>

            <div className="flex gap-4 mb-4">
                <button className={`flex-1 py-2 border rounded-lg font-medium ${paymentMethod === "cash" ? "bg-gray-100" : ""}`} onClick={() => setPaymentMethod("cash")}>
                    Utánvétel
                </button>
                <button className={`flex-1 py-2 border rounded-lg font-medium ${paymentMethod === "barion" ? "bg-gray-100" : ""}`} onClick={() => setPaymentMethod("barion")}>
                    Online fizetés Barionnal
                </button>
            </div>

                <input name="firstname" onChange={handleChange} value={formData.firstname} className={`w-full p-2 border rounded-lg mb-2 ${validationErrors.includes("firstname") ? "border-red-500" : ""}`} type="text" placeholder="Vezetéknév*" required/>
                <input name="lastname" onChange={handleChange} value={formData.lastname} className={`w-full p-2 border rounded-lg mb-2 ${validationErrors.includes("lastname") ? "border-red-500" : ""}`} type="text" placeholder="Keresztnév*" required/>
                <input name="phone" onChange={handleChange} value={formData.phone} className={`w-full p-2 border rounded-lg mb-2 ${validationErrors.includes("phone") ? "border-red-500" : ""}`} type="text" placeholder="Telefonszám (06301234567)*" required/>
                <input name="email" onChange={handleChange} value={formData.email} className={`w-full p-2 border rounded-lg mb-2 ${validationErrors.includes("email") ? "border-red-500" : ""}`} type="email" placeholder="E-mail*" required/>
                <input name="zipCode" onChange={handleChange} value={formData.zipCode} className={`w-full p-2 border rounded-lg mb-2 ${validationErrors.includes("zipCode") ? "border-red-500" : ""}`} type="text" placeholder="Irányítószám*" required/>
                <input name="city" onChange={handleChange} value={formData.city} className={`w-full p-2 border rounded-lg mb-2 ${validationErrors.includes("city") ? "border-red-500" : ""}`} type="text" placeholder="Település*" required/>
                <input name="street" onChange={handleChange} value={formData.street} className={`w-full p-2 border rounded-lg mb-2 ${validationErrors.includes("street") ? "border-red-500" : ""}`} type="text" placeholder="Közterület neve*" required/>
                <select name="streetType" onChange={handleChange} value={formData.streetType} className={`w-full p-2 border rounded-lg mb-2 ${validationErrors.includes("streetType") ? "border-red-500" : ""}`} required>
                    <option value="" disabled hidden>Közterület jellege*</option>
                    <option value="Utca">Utca</option>
                    <option value="Tér">Tér</option>
                    <option value="Körút">Körút</option>
                    <option value="Út">Út</option>
                </select>
                <input name="houseNumber" onChange={handleChange} value={formData.houseNumber} className={`w-full p-2 border rounded-lg mb-2 ${validationErrors.includes("houseNumber") ? "border-red-500" : ""}`} type="text" placeholder="Házszám*" required/>
                <input name="extra" onChange={handleChange} value={formData.extra} className="w-full p-2 border rounded-lg mb-2" type="text" placeholder="Címkiegészítés (emelet, ajtó)" />

            {!isBusiness && (
                <div className="mt-4">
                    <label className="flex items-center gap-2">
                    <input
                        type="checkbox"
                        checked={showBilling}
                        onChange={() => setShowBilling(!showBilling)}
                    />
                        Számlázási cím eltér a szállítási címtől
                    </label>
                </div>
            )}

            {(isBusiness || showBilling) && (
                <div>
                    <h3 className="text-lg font-medium mb-2">Számlázási cím</h3>
                    <input name="billingFirstname" onChange={handleChange} value={formData.billingFirstname} className="w-full p-2 border rounded-lg mb-2" type="text" placeholder="Vezetéknév" />
                    <input name="billingLastname" onChange={handleChange} value={formData.billingLastname} className="w-full p-2 border rounded-lg mb-2" type="text" placeholder="Keresztnév" />
                    <input name="billingPhone" onChange={handleChange} value={formData.billingPhone} className="w-full p-2 border rounded-lg mb-2" type="text" placeholder="Telefonszám (06301234567)" />
                    <input name="billingZipCode" onChange={handleChange} value={formData.billingZipCode} className="w-full p-2 border rounded-lg mb-2" type="text" placeholder="Irányítószám" />
                    <input name="billingCity" onChange={handleChange} value={formData.billingCity} className="w-full p-2 border rounded-lg mb-2" type="text" placeholder="Település" />
                    <input name="billingStreet" onChange={handleChange} value={formData.billingStreet} className="w-full p-2 border rounded-lg mb-2" type="text" placeholder="Közterület neve" />
                    <select name="billingStreetType" onChange={handleChange} value={formData.billingStreetType} className="w-full p-2 border rounded-lg mb-2">
                        <option value="" disabled hidden>Közterület jellege*</option>
                        <option value="Utca">Utca</option>
                        <option value="Tér">Tér</option>
                        <option value="Körút">Körút</option>
                        <option value="Út">Út</option>
                    </select>
                    <input name="billingHouseNumber" onChange={handleChange} value={formData.billingHouseNumber} className="w-full p-2 border rounded-lg mb-2" type="text" placeholder="Házszám" />
                    <input name="billingExtra" onChange={handleChange} value={formData.billingExtra} className="w-full p-2 border rounded-lg mb-2" type="text" placeholder="Címkiegészítés (emelet, ajtó)" />
                    
                    {isBusiness && (
                        <>
                            <input name="companyName" onChange={handleChange} value={formData.companyName} className="w-full p-2 border rounded-lg mb-2" type="text" placeholder="Számlán szereplő név" />
                            <input name="taxNumber" onChange={handleChange} value={formData.taxNumber} className="w-full p-2 border rounded-lg mb-2" type="text" placeholder="Adószám" />
                        </>
                    )}
                </div>
            )}

            <button
                className={`w-full py-2 px-4 rounded-lg mt-4 ${
                    paymentMethod === "cash"
                        ? "bg-blue-500 hover:bg-blue-600 text-white"
                        : "bg-green-500 hover:bg-green-600 text-white"
                }`}
                onClick={() => {
                    if (isFormValid()) {
                        handleSubmit();
                    } else {
                        console.warn("Az űrlapot teljesen ki kell tölteni!");
                    }
                }}
            >
                {paymentMethod === "cash" ? "Megrendelés leadása" : "Fizetés indítása"}
            </button>
        </div>
    );
}

export default ShippingForm;