import { useState, useEffect } from "react";
import { FaFacebook, FaInstagram } from "react-icons/fa";
import { FaTiktok } from "react-icons/fa6";
import { RxHamburgerMenu } from "react-icons/rx";
import CartIcon from "./CartIcon";
import ProfileIcon from "./ProfileIcon";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };

        window.addEventListener("scroll", handleScroll);
        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);

    return (
        <>
            <nav
                className={`fixed shadow-md top-0 left-0 w-full z-50 transition-all duration-300
                            ${isScrolled ? "bg-white bg-opacity-50 backdrop-blur-md shadow-lg" : "bg-secondary"}`}
            >
                <div className="container mx-auto flex justify-between items-center px-10 lg:px-10 py-4 relative">
                    <div className="flex items-center gap-5">
                        <RxHamburgerMenu
                            className="block lg:hidden text-2xl cursor-pointer"
                            onClick={() => setIsDrawerOpen(!isDrawerOpen)}
                        />
                        <img src="/DROTVARAZS_LOGO.png" alt="DROTVARAZS_LOGO" className="h-14" onClick={() => navigate("/")}/>
                    </div>

                    <div className="hidden lg:block absolute left-1/2 transform -translate-x-1/2">
                        <ul className="flex justify-center space-x-4 text-gray-600">
                            <li className="px-1">
                                <a href="#about" className="hover:underline transition-all duration-300">
                                    Rólunk
                                </a>
                            </li>
                            <li className="px-1 hover:underline transition-all duration-300 hover:cursor-pointer" onClick={() => navigate("/products-list")}>
                                Termékek
                            </li>
                            <li className="px-1">
                                <a href="#footer" className="hover:underline transition-all duration-300">
                                    Kapcsolat
                                </a>
                            </li>
                        </ul>
                    </div>

                    <div className="flex items-center space-x-4 flex-shrink-0">
                        <a href="https://www.facebook.com/groups/drotvarazs" target="_blank" rel="noreferrer">
                            <FaFacebook className="hidden lg:block text-2xl hover:text-primary transition-all duration-300" />
                        </a>
                        <a href="#" target="_blank" rel="noreferrer">
                            <FaInstagram className="hidden lg:block text-2xl hover:text-primary transition-all duration-300" />
                        </a>
                        <a href="#" target="_blank" rel="noreferrer">
                            <FaTiktok className="hidden lg:block text-2xl hover:text-primary transition-all duration-300" />
                        </a>
                        <ProfileIcon />
                        <CartIcon />
                    </div>
                </div>
            </nav>

            <main className="pt-[72px]"></main>

            <div
                className={`fixed top-[5.5rem] left-0 w-full bg-white shadow-lg z-50 
                            transition-all duration-500 ease-in-out transform ${
                                isDrawerOpen ? "max-h-[300px] opacity-100 translate-y-0" : "max-h-0 opacity-0 -translate-y-5"
                            } overflow-hidden`}
            >
                <div className="container mx-auto p-4">
                    <h2 className="text-lg font-semibold">Menü</h2>
                    <ul className="space-y-2 mt-4">
                        <li className="block text-gray-700 hover:text-gray-900 transition cursor-pointer" onClick={() => setIsDrawerOpen(false)}>
                            <a href="#about">
                                Rólunk
                            </a>
                        </li>
                        <li className="block text-gray-700 hover:text-gray-900 transition cursor-pointer" onClick={() => { navigate("/products-list"); setIsDrawerOpen(false); }}>
                            Termékek
                        </li>
                        <li className="block text-gray-700 hover:text-gray-900 transition" onClick={() => setIsDrawerOpen(false)}>
                            <a href="#footer">
                                Kapcsolat
                            </a>
                        </li>
                    </ul>
                    <button
                        className="mt-4 text-sm text-red-500 hover:underline"
                        onClick={() => setIsDrawerOpen(false)}
                    >
                        Bezárás
                    </button>
                </div>
            </div>
        </>
    );
};

export default Navbar;