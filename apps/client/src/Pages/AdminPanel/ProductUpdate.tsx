import { useNavigate } from "react-router-dom";
import AdminPanelSidebar from "../../components/AdminPanel/AdminPanelSidebar";
import ProductEditComponent from "../../components/AdminPanel/ProductEdit";

export default function ProductUpdate() {
    const navigate = useNavigate();

    return (
        <div className="flex flex-col md:flex-row min-h-screen">
            <AdminPanelSidebar />

            <div className="flex-1 md:ml-64 pb-16 md:pb-0 p-6 w-full">
                <div className="flex justify-center space-x-2 md:space-x-4 mb-6">
                    <button 
                        className="px-4 py-2 md:px-6 md:py-3 text-sm md:text-base font-semibold text-white bg-primary rounded"
                        onClick={() => navigate("/adminpanel/upload-product")}
                    >
                        📤 Termékfeltöltés
                    </button>
                    <button 
                        className="px-4 py-2 md:px-6 md:py-3 text-sm md:text-base font-semibold text-white bg-primary rounded"
                        onClick={() => navigate("/adminpanel/edit-product")}
                    >
                        ✏️ Termékfrissítés
                    </button>
                </div>
                
                <h1 className="text-2xl font-bold text-gray-800 mb-4 text-center">Termékfrissítés</h1>
                <p className="text-gray-600 text-center mb-5">Frissíts egy terméket az űrlap segítségével.</p>

                <ProductEditComponent />
            </div>
        </div>
    );
}