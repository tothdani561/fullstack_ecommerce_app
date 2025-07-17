import { useLocation } from "react-router-dom";
import { useState } from "react";
import axios from "axios";

const CheckYourEmailComponent = () => {
    const location = useLocation();
    const [email] = useState(new URLSearchParams(location.search).get("email") || "");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleResendEmail = async () => {
        setLoading(true);
        setError(null);
        try {
            await axios.post("/api/auth/forgot-password", { email });
        } catch (err) {
            setError("Hiba történt az e-mail újraküldésekor.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col justify-center items-center bg-gray-100">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md text-center">
                <h2 className="text-2xl font-bold mb-2">Nézze meg az e-mailjeit</h2>
                <p className="text-gray-600 mb-4">
                    Kérjük, ellenőrizze a jelszó visszaállításához szükséges utasítások kézbesítésére szolgáló
                    <strong className="text-black"> {email} </strong> e-mail címet.
                </p>

                {error && <p className="text-red-500 mb-3">{error}</p>}

                <button
                    onClick={handleResendEmail}
                    className="w-full bg-gray-200 text-black font-bold py-2 px-4 rounded transition-all duration-200 hover:bg-gray-300"
                    disabled={loading}
                >
                    {loading ? "Újraküldés..." : "E-mail újraküldése"}
                </button>

                <div className="text-center mt-4">
                    <a href="/login" className="text-primary hover:underline">
                        Vissza a következőhöz: Bejelentkezés
                    </a>
                </div>
            </div>
        </div>
    );
};

export default CheckYourEmailComponent;