import { useState } from "react";
import { useCreateCoupon } from "./service/useAdminStats";

const CouponCreateComponent = () => {
    const createCoupon = useCreateCoupon();
    const [couponData, setCouponData] = useState({
        code: "",
        discount: "",
        type: "SINGLE_USE",
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setCouponData({ ...couponData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!couponData.code || !couponData.discount) {
            alert("Minden mezőt ki kell tölteni!");
            return;
        }

        const formattedData = {
            code: couponData.code,
            discount: parseInt(couponData.discount),
            type: couponData.type,
        };

        createCoupon.mutate(formattedData);
    };

    return (
        <div className="max-w-md mx-auto p-6 bg-white border shadow-lg rounded-lg">
            <h2 className="text-xl font-bold mb-4">Új kupon létrehozása</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <input
                    type="text"
                    name="code"
                    value={couponData.code}
                    onChange={handleChange}
                    placeholder="Kupon kód"
                    className="w-full p-2 border rounded"
                />
                <input
                    type="number"
                    name="discount"
                    value={couponData.discount}
                    onChange={handleChange}
                    placeholder="Kedvezmény (%)"
                    className="w-full p-2 border rounded"
                />
                <select
                    name="type"
                    value={couponData.type}
                    onChange={handleChange}
                    className="w-full p-2 border rounded"
                >
                    <option value="SINGLE_USE">Csak egyszer felhasználható</option>
                    <option value="GENERAL">Minden felhasználó egyszer felhasználhatja</option>
                </select>

                <button type="submit" className="w-full bg-primary text-white py-2 rounded">
                    Kupon létrehozása
                </button>
            </form>
        </div>
    );
};

export default CouponCreateComponent;