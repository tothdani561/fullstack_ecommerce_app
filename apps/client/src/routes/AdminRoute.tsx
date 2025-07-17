import { Navigate, Outlet } from "react-router-dom";
import { getValueFromToken } from "../utils/getValueFromToken";

const AdminRoute = () => {
    const accessToken = localStorage.getItem("accessToken");
    const isAdmin = getValueFromToken(accessToken, "admin");

    return isAdmin ? <Outlet /> : <Navigate to="/" />;
};

export default AdminRoute;