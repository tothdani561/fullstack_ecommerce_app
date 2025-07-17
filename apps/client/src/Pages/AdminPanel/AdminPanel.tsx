import AdminDashboard from "../../components/AdminPanel/AdminDashboard";
import AdminPanelSidebar from "../../components/AdminPanel/AdminPanelSidebar";

export default function AdminPanel() {
    return (
        <div className="flex flex-col md:flex-row min-h-screen">
            <AdminPanelSidebar />

            <div className="flex-1 md:ml-64 pb-16 md:pb-0">
                <AdminDashboard />
            </div>
        </div>
    );
}