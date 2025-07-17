import axios, { AxiosRequestConfig } from "axios";

const API_BASE_URL = "/api";

const getStorage = () => localStorage;
const getAccessToken = () => getStorage().getItem("accessToken");
const getRefreshToken = () => getStorage().getItem("refreshToken");
const setAccessToken = (token: string) => getStorage().setItem("accessToken", token);
const removeTokens = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
};

export const redirectToLogin = () => {
    if (window.location.pathname !== "/login") {
        removeTokens();
        window.location.href = "/login";
    }
};

const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

apiClient.interceptors.request.use(
    (config) => {
        const accessToken = getAccessToken();
        if (accessToken) {
            config.headers.Authorization = `Bearer ${accessToken}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response && (error.response.status === 401 || error.response.status === 403)) {
            const refreshToken = getRefreshToken();

            if (!refreshToken) {
                console.warn("Nincs refreshToken, nem tudjuk frissíteni a tokent. Irányítás a /login oldalra.");
                redirectToLogin();
                return Promise.reject(error);
            }

            try {
                console.log("Token frissítés folyamatban...");
                const refreshResponse = await axios.post(`${API_BASE_URL}/auth/refresh`, 
                    { refreshToken },
                    { headers: { Authorization: `Bearer ${refreshToken}` } }
                );

                if (refreshResponse.status === 200) {
                    const { accessToken } = refreshResponse.data;
                    setAccessToken(accessToken);

                    console.log("Token frissítve, újrapróbáljuk az eredeti kérést.");
                    originalRequest.headers.Authorization = `Bearer ${accessToken}`;
                    return apiClient(originalRequest);
                }
            } catch (refreshError) {
                console.error("Token frissítés sikertelen, irányítás a /login oldalra:", refreshError);
                redirectToLogin();
            }
        }

        return Promise.reject(error);
    }
);

export const apiRequest = async (url: string, options: AxiosRequestConfig = {}) => {
    const accessToken = getAccessToken();

    if (!accessToken) {
        console.warn("⚠️ Nincs accessToken, nem indítunk API hívást.");
        redirectToLogin();
        return null;
    }

    try {
        const response = await apiClient({ url, ...options });
        return response.data;
    } catch (error) {
        console.error("API hiba:", error);
        throw error;
    }
};

export default apiClient;