import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import fetchWithoutAuth from "../../utils/fetchWithoutAuth";
import { authEventEmitter } from "../../utils/authEventEmitter";
import { getValueFromToken } from "../../utils/getValueFromToken";

import { ToastContainer, toast, Slide } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import MiniFooter from "../HomePage/Footer/MiniFooter"; // ✅ Footer importálása

const LoginForm = () => {
    const [password, setPassword] = useState<string>("");
    const [useremail, setUserEmail] = useState<string>("");
    const navigate = useNavigate();

    const fillInputs = () => {
        toast.warn("Hiányzó email cím vagy jelszó!", {
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

    const loginError = () => {
        toast.error("Helytelen bejelentkezési adatok! Próbáld újra!", {
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

    const handleLoginSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (useremail === "" || password === "") {
            fillInputs();
            return;
        }

        try {
            const payload = { email: useremail, password };

            const response = await fetchWithoutAuth("/local/signin", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                loginError();
                return;
            }

            const data = await response?.json();
            localStorage.setItem("accessToken", data.accessToken);
            localStorage.setItem("refreshToken", data.refreshToken);

            authEventEmitter.emit("login");

            const isAdmin = getValueFromToken(data.accessToken, "admin");
            console.log("isAdmin", isAdmin);

            navigate(isAdmin ? "/adminpanel" : "/");
        } catch (error) {
            console.error("Hiba történt a bejelentkezés során:", error);
        }
    };

    const handleGoogleLogin = async () => {
        try {
            const googleLoginUrl = "/api/auth/google/login";
            window.location.href = googleLoginUrl;
        } catch (error) {
            console.error("Hiba történt a Google belépés során:", error);
        }
    };

    return (
        <>
            <ToastContainer />
            <div className="flex flex-col min-h-screen">
                {/* Középre igazított form */}
                <div className="flex-grow flex items-center justify-center mt-4">
                    <div className="w-full max-w-md bg-white p-6 border rounded-lg shadow-md">
                        <div className="flex justify-center mb-6">
                            <img src="/DROTVARAZS_LOGO.png" alt="Logo" onClick={() => navigate('/')} className="h-24" />
                        </div>
                        <h2 className="text-3xl font-bold text-center text-pink-600 mb-6">
                            Bejelentkezés
                        </h2>
                        <form onSubmit={handleLoginSubmit}>
                            <div className="mb-4">
                                <label
                                    htmlFor="username"
                                    className="block text-sm font-medium text-gray-500 mb-2"
                                >
                                    Email cím
                                </label>
                                <input
                                    type="text"
                                    id="username"
                                    value={useremail}
                                    onChange={(e) => setUserEmail(e.target.value)}
                                    placeholder="Email cím"
                                    className="w-full px-3 py-2 border border-pink-300 rounded focus:outline-none focus:ring-pink-500 focus:border-pink-500"
                                />
                            </div>
                            <div className="mb-2">
                                <label
                                    htmlFor="password"
                                    className="block text-sm font-medium text-gray-500 mb-2"
                                >
                                    Jelszó
                                </label>
                                <input
                                    type="password"
                                    id="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Jelszó"
                                    className="w-full px-3 py-2 border border-pink-300 rounded focus:outline-none focus:ring-pink-500 focus:border-pink-500"
                                />
                            </div>
                            <a className="text-primary" href="/forgot-password">
                                Elfelejtette a jelszavát?
                            </a>
                            <button
                                type="submit"
                                className="w-full bg-pink-600 text-white py-2 px-4 mt-2 rounded hover:bg-pink-700 transition"
                            >
                                BEJELENTKEZÉS
                            </button>
                        </form>
                        <div className="mt-4 text-center">
                            <button
                                onClick={handleGoogleLogin}
                                className="w-full bg-gray-200 text-black py-2 px-4 rounded hover:bg-gray-300 transition flex items-center justify-center gap-2"
                            >
                                <img src="/google.png" alt="Google" className="w-5 h-5" />
                                Google belépés
                            </button>
                        </div>
                        <div className="mt-4 text-center">
                            <p className="text-sm text-gray-500">
                                Nincs még regisztrálva felhasználód?{" "}
                                <button 
                                    onClick={() => navigate("/register")} 
                                    className="text-pink-600 hover:underline font-medium"
                                >
                                    Regisztrálok!
                                </button>
                            </p>
                        </div>
                    </div>
                </div>

                {/* Footer mindig az aljára igazítva */}
                <MiniFooter />
            </div>
        </>
    );
};

export default LoginForm;