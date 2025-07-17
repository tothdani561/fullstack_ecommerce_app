const getStorage = () => (localStorage);

export const getValueFromToken = (token: string | null, key: string) => {
    if (!token || typeof token !== "string") {
        console.warn("Token is null or invalid, attempting to retrieve from storage");
        const storage = getStorage();
        token = storage.getItem("accessToken");
        if (!token || typeof token !== "string") {
            console.error("Invalid token provided");
            return false;
        }
    }

    try {
        const base64Payload = token.split(".")[1];

        if (!base64Payload) {
            console.error("Invalid JWT structure");
            return false;
        }

        const payload = JSON.parse(atob(base64Payload));
        return payload[key] !== undefined ? payload[key] : false;
    } catch (error) {
        console.error("Error decoding token:", error);
        return false;
    }
};