import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useRegister } from "../../utils/useAuth/useAuth";
import { useNewsletter } from "../../utils/useNewsletter/useNewsletter";

import { ToastContainer, toast, Slide } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import MiniFooter from "../HomePage/Footer/MiniFooter";

const RegisterForm = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [firstname, setFirstname] = useState("");
    const [lastname, setLastname] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [agreeToTerms, setAgreeToTerms] = useState(false);
    const [agreeToDataTerms, setAgreeToDataTerms] = useState(false);
    const [subscribeNewsletter, setSubscribeNewsletter] = useState(false);
    const navigate = useNavigate();

    // React Query mutations
    const registerMutation = useRegister();
    const newsletterMutation = useNewsletter();

    const fillInputs = () => {
        toast.warn('Töltse ki az összes mezőt!', {
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
    }

    const passwordMatches = () => {
        toast.error('A jelszavak nem egyeznek!', {
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
    }

    const agreeTerms = () => {
        toast.error('El kell fogadnia a szabályzatot a regisztrációhoz!', {
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
    }

    const handleRegisterSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!email || !password || !confirmPassword || !firstname || !lastname) {
            fillInputs();
            return;
        }

        if (password !== confirmPassword) {
            passwordMatches();
            return;
        }

        if (!agreeToTerms) {
            agreeTerms();
            return;
        }

        try {
            await registerMutation.mutateAsync({
                email,
                password,
                firstname,
                lastname,
            });

            if (subscribeNewsletter) {
                await newsletterMutation.mutateAsync(email);
            }

            navigate("/login");
        } catch (error: any) {
            console.error("Hiba történt a regisztráció során:", error.message);
            alert(error.message);
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
            <div className="flex-grow flex items-center justify-center my-8">
                <div className="w-full max-w-md bg-white border p-6 rounded-lg shadow-md">
                    <div className="flex justify-center mb-6">
                        <img src="/DROTVARAZS_LOGO.png" alt="Logo" className="h-24" />
                    </div>
                    <h2 className="text-3xl font-bold text-center text-pink-600 mb-6">
                        Regisztráció
                    </h2>
                    <form onSubmit={handleRegisterSubmit}>
                        <div className="mb-4">
                            <label htmlFor="lastname" className="block text-sm font-medium text-gray-500 mb-2">
                                Vezetéknév*
                            </label>
                            <input
                                type="text"
                                id="lastname"
                                value={lastname}
                                onChange={(e) => setLastname(e.target.value)}
                                className="w-full px-3 py-2 border border-pink-300 rounded"
                                required
                            />
                        </div>

                        <div className="mb-4">
                            <label htmlFor="firstname" className="block text-sm font-medium text-gray-500 mb-2">
                                Keresztnév*
                            </label>
                            <input
                                type="text"
                                id="firstname"
                                value={firstname}
                                onChange={(e) => setFirstname(e.target.value)}
                                className="w-full px-3 py-2 border border-pink-300 rounded"
                                required
                            />
                        </div>

                        <div className="mb-4">
                            <label htmlFor="email" className="block text-sm font-medium text-gray-500 mb-2">
                                Email cím*
                            </label>
                            <input
                                type="email"
                                id="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-3 py-2 border border-pink-300 rounded"
                                required
                            />
                        </div>

                        <div className="mb-4">
                            <label htmlFor="password" className="block text-sm font-medium text-gray-500 mb-2">
                                Jelszó*
                            </label>
                            <input
                                type="password"
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-3 py-2 border border-pink-300 rounded"
                                required
                            />
                        </div>

                        <div className="mb-4">
                            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-500 mb-2">
                                Jelszó ismét*
                            </label>
                            <input
                                type="password"
                                id="confirmPassword"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="w-full px-3 py-2 border border-pink-300 rounded"
                                required
                            />
                        </div>

                        <div className="mb-4 flex items-center">
                            <input
                                type="checkbox"
                                id="terms"
                                checked={agreeToTerms}
                                onChange={() => setAgreeToTerms(!agreeToTerms)}
                                className="w-4 h-4 text-pink-600 border-gray-300 rounded"
                            />
                            <label htmlFor="terms" className="ml-2 text-sm text-gray-500">
                                Elfogadom az Általános Szerződési Feltételeket*
                            </label>
                        </div>

                        <div className="mb-4 flex items-center">
                            <input
                                type="checkbox"
                                id="terms"
                                checked={agreeToDataTerms}
                                onChange={() => setAgreeToDataTerms(!agreeToDataTerms)}
                                className="w-4 h-4 text-pink-600 border-gray-300 rounded"
                            />
                            <label htmlFor="terms" className="ml-2 text-sm text-gray-500">
                                Elfogadom az Adatkezelési Tájékoztatót*
                            </label>
                        </div>

                        <div className="mb-4 flex items-center">
                            <input
                                type="checkbox"
                                id="newsletter"
                                checked={subscribeNewsletter}
                                onChange={() => setSubscribeNewsletter(!subscribeNewsletter)}
                                className="w-4 h-4 text-pink-600 border-gray-300 rounded"
                            />
                            <label htmlFor="newsletter" className="ml-2 text-sm text-gray-500">
                                Feliratkozom a hírlevélre
                            </label>
                        </div>

                        <button type="submit" className="w-full bg-pink-600 text-white py-2 px-4 rounded">
                            {registerMutation.isPending ? "Regisztráció..." : "REGISZTRÁCIÓ"}
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
                            Van már felhasználód?{" "}
                            <button 
                                onClick={() => navigate("/login")} 
                                className="text-pink-600 hover:underline font-medium"
                            >
                                Jelentkezz be!
                            </button>
                        </p>
                    </div>
                </div>
            </div>
            <MiniFooter />
        </div>
        </>
    );
};

export default RegisterForm;