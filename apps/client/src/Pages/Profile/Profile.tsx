import Navbar from "../../components/HomePage/Navbar/Navbar";
import OrdersComponent from "../../components/Orders/OrdersComponent";
import UserProfile from "../../components/UserProfile/UserProfile";

export default function Profile() {
    return (
        <>
            <Navbar />
            <UserProfile />
            <OrdersComponent />
        </>
    );
}