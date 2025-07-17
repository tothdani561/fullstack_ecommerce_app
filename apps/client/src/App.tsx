import { BrowserRouter, Route, Routes } from "react-router-dom";
import HomePage from "./Pages/Home/HomePage";
import Login from "./Pages/Login/Login";
import ProductPage from "./Pages/Product/Product";
import LoginTokenHandler from "./Pages/Login/LoginTokenHandler";
import YourCart from "./Pages/Cart/YourCart";
import PaymentStepper from "./Pages/PaymentStepper/PaymentStepper";
import ShippingPage from "./Pages/Shipping/Shipping";
import ProductsList from "./Pages/ProductsList/ProductsList";
import Register from "./Pages/Register/Register";
import Profile from "./Pages/Profile/Profile";
import ShippingStatusPage from "./Pages/Shipping/ShippingStatus";
import ForgotPassword from "./Pages/ForgotPassword/ForgotPassword";
import CheckYourEmail from "./Pages/ForgotPassword/CheckYourEmail";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import ResetPasswordPage from "./Pages/ForgotPassword/ResetPasswordPage";
import AdminRoute from "./routes/AdminRoute";
import AdminPanel from "./Pages/AdminPanel/AdminPanel";
import ProductUpload from "./Pages/AdminPanel/ProductUpload";
import ProductUpdate from "./Pages/AdminPanel/ProductUpdate";
import CouponCreate from "./Pages/AdminPanel/CouponCreate";
import SendNewsletter from "./Pages/AdminPanel/sendNewsletter";
import ShippingSuccessPage from "./Pages/Shipping/ShippingSuccessPage";

const queryClient = new QueryClient();

export default function App() {
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <Routes>
            <Route path="*" element={<HomePage />}/>
            <Route path="/" element={<HomePage />}/>
            <Route path="/login" element={<Login />} />
            <Route path="/product/:id" element={<ProductPage />} />
            <Route path="/logintoken" element={<LoginTokenHandler />} />
            <Route path="/your-cart" element={<YourCart />} />
            <Route path="/payment-stepper" element={<PaymentStepper />} />
            <Route path="/shipping" element={<ShippingPage />} />
            <Route path="/shipping-status" element={<ShippingStatusPage />} />
            <Route path="/shipping-success" element={<ShippingSuccessPage />} />
            <Route path="/products-list" element={<ProductsList />} />
            <Route path="/register" element={<Register />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/check-email" element={<CheckYourEmail />} />
            <Route path="/reset-password" element={<ResetPasswordPage />} />

            <Route element={<AdminRoute />}>
                <Route path="/adminpanel" element={<AdminPanel />} />
                <Route path="/adminpanel/upload-product" element={<ProductUpload />} />
                <Route path="/adminpanel/edit-product" element={<ProductUpdate />} />
                <Route path="/adminpanel/create-coupon" element={<CouponCreate />} />
                <Route path="/adminpanel/send-newsletter" element={<SendNewsletter />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </QueryClientProvider>
    </>
  );
}