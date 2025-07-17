import { useState } from "react";
import { useForm } from "react-hook-form";
import { apiRequest } from "../../utils/axiosInstance";

import { ToastContainer, toast, Slide } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const NewsletterSender = () => {
    const { register, reset } = useForm();
    const [isSending, setIsSending] = useState(false);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [formData, setFormData] = useState({ subject: "", html: "" });

    const sendSuccess = () => {
        toast.success("Hírlevél sikeresen elküldve!", {
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

    const sendFail = () => {
        toast.error("Hiányzó tárgy vagy tartalom!", {
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

    const onSubmit = async () => {
        setIsSending(true);
        setShowConfirmModal(false);

        try {
            const response = await apiRequest("/newsletter/send", {
                method: "POST",
                data: formData,
            });

            console.log("Hírlevél sikeresen elküldve:", response);
            sendSuccess();
            reset();
            setFormData({ subject: "", html: "" });
        } catch (error) {
            console.error("Hiba történt a hírlevél küldése során:", error);
            sendFail();
        } finally {
            setIsSending(false);
        }
    };

    return (
        <>
            <ToastContainer />
            <div className="max-w-2xl mx-auto p-6 bg-white border shadow-lg rounded-lg">
                <h2 className="text-xl font-bold mb-4">📨 Hírlevél küldése</h2>
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        setShowConfirmModal(true);
                    }}
                    className="space-y-4"
                >
                    <input
                        {...register("subject", { required: true })}
                        value={formData.subject}
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                        placeholder="Tárgy"
                        className="w-full p-2 border rounded"
                    />

                    <textarea
                        {...register("html", { required: true })}
                        value={formData.html}
                        onChange={(e) => setFormData({ ...formData, html: e.target.value })}
                        placeholder="Hírlevél tartalma (HTML kód is mehet)"
                        className="w-full p-2 border rounded h-40"
                    />

                    <button
                        type="submit"
                        disabled={isSending}
                        className="w-full bg-primary text-white py-2 rounded"
                    >
                        {isSending ? "📤 Küldés folyamatban..." : "Hírlevél küldése"}
                    </button>
                </form>

                {showConfirmModal && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                        <div className="bg-white p-6 rounded-lg shadow-lg w-96 text-center">
                            <h2 className="text-lg font-bold mb-4">Biztosan elküldöd a hírlevelet?</h2>
                            <div className="flex justify-between">
                                <button
                                    onClick={onSubmit}
                                    className="px-4 py-2 bg-primary text-white rounded"
                                >
                                    Küldés
                                </button>
                                <button
                                    onClick={() => setShowConfirmModal(false)}
                                    className="px-4 py-2 bg-red-600 text-white rounded"
                                >
                                    Megszakítás
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
};

export default NewsletterSender;