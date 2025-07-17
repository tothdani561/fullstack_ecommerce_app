import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { authEventEmitter } from "../../utils/authEventEmitter";
import { getValueFromToken } from "../../utils/getValueFromToken";

const LoginTokenHandler = () => {
    const navigate = useNavigate();
    const [navigated, setNavigated] = useState(false);

    useEffect(() => {
        if (navigated) return;
    
        const queryParams = new URLSearchParams(window.location.search);
        const token = queryParams.get("token");
        const refreshToken = queryParams.get("refreshToken");
    
        console.log("Google login token received:", token);
        console.log("Google refreshToken received:", refreshToken);
    
        if (token) {
            localStorage.setItem("accessToken", token);
        }
    
        if (refreshToken) { 
            localStorage.setItem("refreshToken", refreshToken);
        }
    
        const userId = getValueFromToken(token, "sub");
        console.log("Decoded userId from token:", userId);
    
        if (!userId) {
            console.error("Google login token is missing userId!");
            return;
        }
    
        authEventEmitter.emit("login");
    
        setNavigated(true);
    
        navigate("/");
    }, [navigate, navigated]);    

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <div className="flex items-center gap-3 mb-4">
                <img src="/DROTVARAZS_LOGO.png" alt="Drótvarázs" className="w-14 h-14" />
                <span className="text-4xl font-bold text-gray-600">+</span>
                <img src="/google.png" alt="Google" className="w-12 h-12" />
            </div>

            <p className="text-xl text-gray-700">Bejelentkezés folyamatban...</p>
        </div>
    );
};

export default LoginTokenHandler;