import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

const ResetPasswordPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [message, setMessage] = useState<string | null>(null);

    const token = new URLSearchParams(location.search).get("token");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setMessage(null);

        if (!token) {
            setError("Érvénytelen jelszó-visszaállítási hivatkozás.");
            return;
        }

        if (password !== confirmPassword) {
            setError("A két jelszó nem egyezik meg!");
            return;
        }

        setLoading(true);
        try {
            await axios.put("/api/auth/reset-password", {
                newPassword: password,
                resetToken: token,
            });

            setMessage("Jelszavad sikeresen megváltozott!");
            setTimeout(() => navigate("/login"), 3000);
        } catch (err) {
            setError("Hiba történt a jelszó visszaállításakor.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col justify-center items-center bg-gray-100">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
                <h2 className="text-2xl font-bold text-center mb-2">Jelszó visszaállítása</h2>
                <p className="text-center text-gray-600 mb-4">
                    Adj meg egy új jelszót a fiókodhoz.
                </p>

                {error && <p className="text-red-500 text-center mb-3">{error}</p>}
                {message && <p className="text-green-500 text-center mb-3">{message}</p>}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        type="password"
                        placeholder="Új jelszó"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                    <input
                        type="password"
                        placeholder="Új jelszó megerősítése"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary"
                    />

                    <button
                        type="submit"
                        className="w-full bg-primary text-white font-bold py-2 px-4 rounded transition-all duration-200"
                        disabled={loading}
                    >
                        {loading ? "Feldolgozás..." : "Jelszó módosítása"}
                    </button>
                </form>

                <div className="text-center mt-4">
                    <a href="/login" className="text-primary hover:underline">
                        Vissza a bejelentkezéshez
                    </a>
                </div>
            </div>
        </div>
    );
};

export default ResetPasswordPage;