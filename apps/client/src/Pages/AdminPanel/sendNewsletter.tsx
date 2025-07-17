import AdminPanelSidebar from "../../components/AdminPanel/AdminPanelSidebar";
import NewsletterSender from "../../components/AdminPanel/NewsletterSender";

export default function SendNewsletter() {

    return (
        <div className="flex flex-col md:flex-row min-h-screen">
            <AdminPanelSidebar />

            <div className="flex-1 md:ml-64 pb-16 md:pb-0 p-6 w-full">
                <h1 className="text-2xl font-bold text-gray-800 mb-4 text-center">Hírlevél küldés</h1>
                <p className="text-gray-600 text-center mb-5">Írj hírlevelet, amit az összes hírlevélre feliratkozott ember megkap.</p>

                <NewsletterSender />
            </div>
        </div>
    );
}