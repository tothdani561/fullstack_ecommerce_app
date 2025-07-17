import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ForgotPasswordForm = () => {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage(null);
        setError(null);
        setLoading(true);
    
        try {
            const response = await axios.post("/api/auth/forgot-password", { email });
    
            setMessage(response.data.message);
            navigate(`/check-email?email=${email}`);
        } catch (err: any) {
            setError("Hiba történt a jelszó visszaállítási kérés során.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col justify-center items-center bg-gray-100">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
                <img src="/DROTVARAZS_LOGO.png" alt="Logo" className="w-20 h-20 mx-auto mb-5" />
                <h2 className="text-2xl font-bold text-center mb-2 text-primary">A jelszavad visszaállítása</h2>
                <p className="text-center text-gray-600 mb-4">
                    Add meg az e-mail címed, és elküldjük az utasításokat a jelszó visszaállításához.
                </p>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        type="email"
                        placeholder="E-mail-cím*"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                    
                    <button
                        type="submit"
                        className="w-full bg-primary text-white font-bold py-2 px-4 rounded transition-all duration-200"
                        disabled={loading}
                    >
                        {loading ? "Küldés..." : "Tovább"}
                    </button>
                </form>

                {message && <p className="text-primary text-center mt-3">{message}</p>}
                {error && <p className="text-red-500 text-center mt-3">{error}</p>}

                <div className="text-center mt-4">
                    <a href="/login" className="text-primary hover:underline">
                        Vissza a következőhöz: Bejelentkezés
                    </a>
                </div>
            </div>
        </div>
    );
};

export default ForgotPasswordForm;