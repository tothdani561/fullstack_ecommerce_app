import { useEffect } from "react";

const GoogleLoginButton = () => {
    const handleGoogleLogin = () => {
        window.location.href = '/api/auth/google/login';
    };

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const token = urlParams.get("token");

        if (token) {
            localStorage.setItem("access_token", token);
            window.location.href = "https://drotvarazs.hu";
        }
    }, []);

    return (
        <>
            <button onClick={handleGoogleLogin}>Google Login</button>
        </>
    );
};

export default GoogleLoginButton;