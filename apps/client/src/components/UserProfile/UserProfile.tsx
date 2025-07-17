import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import apiClient, { apiRequest } from "../../utils/axiosInstance";
import { getValueFromToken } from "../../utils/getValueFromToken";

const UserProfile = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState({
        firstname: "",
        lastname: "",
        email: "",
        createdAt: "",
    });
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmNewPassword, setConfirmNewPassword] = useState("");
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchUserData = async () => {
            const accessToken = localStorage.getItem("accessToken");
            const email = getValueFromToken(accessToken, "email");

            if (!email || !accessToken) {
                console.error("Nincs elérhető email vagy token.");
                navigate("/login");
                return;
            }

            try {
                const response = await apiClient.get(`/users/${email}`, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                });

                if (response.data) {
                    setUser({
                        firstname: response.data.firstname,
                        lastname: response.data.lastname,
                        email: response.data.email,
                        createdAt: response.data.createdAt,
                    });
                }
            } catch (error) {
                console.error("Hiba történt az adatok lekérésekor:", error);
                navigate("/login");
            }
        };

        fetchUserData();
    }, [navigate]);

    const getDisplayName = () => {
        if (user.firstname && user.lastname) {
            return `${user.lastname} ${user.firstname}`;
        }
        return user.email.split("@")[0];
    };

    const handlePasswordChange = async () => {
        setError("");
    
        if (!oldPassword || !newPassword || !confirmNewPassword) {
            setError("Minden mező kitöltése kötelező.");
            return;
        }
    
        if (newPassword !== confirmNewPassword) {
            setError("Az új jelszavak nem egyeznek.");
            return;
        }
    
        try {
            const response = await apiRequest("/auth/change-password", {
                method: "PUT",
                data: {
                    oldPassword,
                    newPassword,
                },
                headers: {
                    "Content-Type": "application/json",
                },
            });
    
            if (response?.message === "Password updated successfully") {
                setIsModalOpen(false);
                setOldPassword("");
                setNewPassword("");
                setConfirmNewPassword("");
                localStorage.removeItem("accessToken");
                localStorage.removeItem("refreshToken");
                navigate("/login");
            }
        } catch (error) {
            setError("Hiba történt a jelszó módosítása során. Ellenőrizd a jelenlegi jelszót.");
        }
    };

    return (
        <div className="flex flex-col">
            <div className="flex-grow container mx-auto p-6 my-5">
                <h2 className="text-2xl font-semibold mb-6">Felhasználói profil</h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white border shadow-md rounded-lg p-6 w-full">
                        <h2 className="text-lg font-semibold mb-2">Személyes adatok</h2>
                        <p className="text-gray-700">{getDisplayName()}</p>
                        <p className="text-gray-500 text-sm mt-2">Regisztráció dátuma: {new Date(user.createdAt).toLocaleDateString()}</p>
                    </div>

                    <div className="bg-white border shadow-md rounded-lg p-6 w-full">
                        <h2 className="text-lg font-semibold mb-2">E-mail cím</h2>
                        <p className="text-gray-700">{user.email}</p>
                    </div>

                    <div className="bg-white border shadow-md rounded-lg p-6 w-full">
                        <h2 className="text-lg font-semibold mb-2">Jelszó</h2>
                        <p className="text-gray-700">************</p>
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="mt-3 text-black font-semibold hover:underline"
                        >
                            Jelszó módosítása
                        </button>
                    </div>
                </div>
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50">
                    <div className="bg-white p-6 rounded-md shadow-lg w-96">
                        <h2 className="text-xl font-semibold mb-4">Jelszó módosítása</h2>

                        {error && <p className="text-red-500 text-sm mb-2">{error}</p>}

                        <label className="block text-sm font-medium text-gray-700 mb-1">Jelenlegi jelszó</label>
                        <input
                            type="password"
                            className="w-full p-2 border border-gray-300 rounded-md mb-2"
                            value={oldPassword}
                            onChange={(e) => setOldPassword(e.target.value)}
                        />

                        <label className="block text-sm font-medium text-gray-700 mb-1">Új jelszó</label>
                        <input
                            type="password"
                            className="w-full p-2 border border-gray-300 rounded-md mb-2"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                        />

                        <label className="block text-sm font-medium text-gray-700 mb-1">Új jelszó újra</label>
                        <input
                            type="password"
                            className="w-full p-2 border border-gray-300 rounded-md mb-4"
                            value={confirmNewPassword}
                            onChange={(e) => setConfirmNewPassword(e.target.value)}
                        />

                        <div className="flex justify-between">
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
                            >
                                Mégse
                            </button>
                            <button
                                onClick={handlePasswordChange}
                                className="bg-pink-600 text-white px-4 py-2 rounded-md hover:bg-pink-700"
                            >
                                Jelszó frissítése
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserProfile;