import { FaSignOutAlt } from "react-icons/fa";
import { RiCoupon2Line, RiMailSendLine } from "react-icons/ri";
import { MdDashboard } from "react-icons/md";
import { GiNecklace } from "react-icons/gi";
import { useNavigate } from "react-router-dom";

const AdminPanelSidebar = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        navigate("/login");
    };

    return (
        <>
            <div className="hidden md:flex flex-col bg-gray-200 h-screen fixed top-0 left-0 p-4 items-center shadow-md 
                            w-16 md:w-64 transition-all">
                
                <div className="text-lg font-bold mb-8">
                    <img src="/DROTVARAZS_LOGO.png" alt="DROTVARAZS_LOGO" className="h-20"/>
                </div>

                <nav className="flex flex-col gap-4 flex-grow w-full">
                    <button className="flex items-center gap-3 p-3 bg-gray-300 rounded w-full" onClick={() => navigate("/adminpanel")}>
                        <MdDashboard /> <span className="hidden md:block">Statisztikák</span>
                    </button>
                    <button className="flex items-center gap-3 p-3 bg-gray-300 rounded w-full" onClick={() => navigate("/adminpanel/upload-product")}>
                        <GiNecklace /> <span className="hidden md:block">Termékek</span>
                    </button>
                    <button className="flex items-center gap-3 p-3 bg-gray-300 rounded w-full" onClick={() => navigate("/adminpanel/create-coupon")}>
                        <RiCoupon2Line /> <span className="hidden md:block">Kupon</span>
                    </button>
                    <button className="flex items-center gap-3 p-3 bg-gray-300 rounded w-full" onClick={() => navigate("/adminpanel/send-newsletter")}>
                        <RiMailSendLine /> <span className="hidden md:block">Hírlevél</span>
                    </button>
                </nav>

                <button className="flex items-center gap-3 p-3 bg-primary text-white rounded w-full" onClick={handleLogout}>
                    <FaSignOutAlt /> <span className="hidden md:block">Kijelentkezés</span>
                </button>
            </div>

            <div className="md:hidden fixed bottom-0 left-0 w-full bg-gray-200 flex justify-around p-4 shadow-md">
                <button className="p-1 text-2xl" onClick={() => navigate("/adminpanel")}><MdDashboard /></button>
                <button className="p-1 text-2xl" onClick={() => navigate("/adminpanel/upload-product")}><GiNecklace /></button>
                <button className="p-1 text-2xl" onClick={() => navigate("/adminpanel/create-coupon")}><RiCoupon2Line /></button>
                <button className="p-1 text-2xl" onClick={() => navigate("/adminpanel/send-newsletter")}><RiMailSendLine /></button>
                <button className="p-1 text-2xl text-red-500" onClick={handleLogout}><FaSignOutAlt /></button>
            </div>
        </>
    );
};

export default AdminPanelSidebar;