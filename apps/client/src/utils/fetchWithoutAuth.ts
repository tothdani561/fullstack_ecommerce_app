const API_BASE_URL = '/api/auth';

const fetchWithoutAuth = async (url: string, options: RequestInit = {}) => {
    try {
        const response = await fetch(`${API_BASE_URL}${url}`, {
            ...options,
        });

        if (!response.ok) {
            console.error(`Request failed with status ${response.status}: ${response.statusText}`);
        }

        return response;
    } catch (error) {
        console.error('Error occurred during the request:', error);
        throw error;
    }
};

export default fetchWithoutAuth;
