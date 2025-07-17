import { CgProfile } from "react-icons/cg";
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

const ProfileIcon = () => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const navigate = useNavigate();
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const checkAuth = async () => {
            const token = localStorage.getItem("accessToken");
            if (!token) {
                setIsLoggedIn(false);
                return;
            } else {
                setIsLoggedIn(true);
            }
        };

        checkAuth();
    }, []);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        setIsLoggedIn(false);
        navigate("/login");
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                className="relative focus:outline-none"
                onClick={() => setIsDropdownOpen((prev) => !prev)}
            >
                <CgProfile className="text-2xl text-gray-600 mt-1 hover:text-primary transition-all duration-300" />
            </button>

            <div
                className={`absolute right-0 mt-2 w-64 bg-white shadow-lg rounded-md overflow-hidden z-10 
                            transition-all duration-300 ease-in-out transform 
                            ${isDropdownOpen ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-95 -translate-y-2 pointer-events-none"}`}
            >
                {isLoggedIn ? (
                    <>
                        <div className="border-b border-gray-200 px-4 py-2 flex justify-center items-center">
                            <span className="font-medium text-primary">Saját profil</span>
                        </div>
                        <button 
                            className="w-full text-left text-gray-700 hover:bg-gray-100 transition-all duration-300 px-3 py-2 border-b border-gray-200"
                            onClick={() => navigate("/profile")}
                        >
                            Saját fiók
                        </button>
                        <div className="px-3 py-2 flex gap-2">
                            <button className="w-full bg-primary text-white py-1 rounded-md" onClick={handleLogout}>
                                Kijelentkezés
                            </button>
                        </div>
                    </>
                ) : (
                    <>
                        <div className="border-b border-gray-200 px-4 py-2 flex justify-center items-center">
                            <span className="text-sm text-gray-700">Saját profil</span>
                        </div>
                        <div className="px-4 py-2">
                            <button 
                                className="w-full bg-primary text-white py-1 rounded-md"
                                onClick={() => navigate("/login")}
                            >
                                Bejelentkezés
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default ProfileIcon;