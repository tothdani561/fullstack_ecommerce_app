import { useState } from "react";
import axios from "axios";
import { FaArrowRight } from "react-icons/fa";

import { ToastContainer, toast, Slide } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Newsletter = () => {
    const [email, setEmail] = useState("");

    const subError = () => {
        toast.error("Hiba történt a feliratkozás során. Próbáld újra később!", {
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

    const handleSubscribe = async () => {
        if (!email.trim()) {
            toast.warn("Kérlek, add meg az email címed!", {
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
            return;
        }

        try {
            const response = await axios.post("/api/newsletter/subscribe", { email });

            if (response.status === 201 || response.status === 200) {
                toast.success("Sikeresen feliratkoztál a hírlevelünkre!", {
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
                setEmail("");
            }
        } catch (error: any) {
            console.error("Hiba történt a feliratkozás során:", error);

            if (error.response && error.response.data) {
                const errorMessage = error.response.data.message;

                if (errorMessage === "Email already subscribed") {
                    toast.warn("Ez az email cím már fel van iratkozva!", {
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
                } else {
                    subError();
                }
            } else {
                subError();
            }
        }
    };

    return (
        <>
            <ToastContainer />
            <div className="w-full h-[300px] md:h-[350px] lg:h-[400px] bg-primary flex flex-col justify-center items-center text-center px-4">
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif text-white">
                    Iratkozz fel a hírlevelünkre!
                </h2>
                <p className="text-sm md:text-base text-white mt-2">
                    Légy te az első, aki értesül a legújabb ajánlatainkról.
                </p>
                <div className="mt-6 flex items-center border border-white overflow-hidden">
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Email cím"
                        className="px-4 py-2 text-white bg-transparent outline-none placeholder-white"
                    />
                    <button onClick={handleSubscribe} className="px-4 py-2 bg-transparent text-white">
                        <FaArrowRight />
                    </button>
                </div>
            </div>
        </>
    );
};

export default Newsletter;