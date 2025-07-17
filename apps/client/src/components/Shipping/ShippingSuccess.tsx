import { useNavigate } from "react-router-dom";

const ShippingSuccess = () => {
    const navigate = useNavigate();

    return (
        <div className="flex flex-col items-center justify-center min-h-screen text-center">
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
        </div>
    );
}

export default ShippingSuccess;