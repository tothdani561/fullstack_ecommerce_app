const API_BASE_URL = '/api';

const fetchWithAuth = async (url: string, options: RequestInit = {}, token?: string) => {
    const getStorage = () => (localStorage);
    const getToken = () => getStorage().getItem('accessToken');
    const setToken = (token: string) => getStorage().setItem('accessToken', token);
    const removeTokens = () => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
    };

    const handleAuthError = async () => {
        const storage = getStorage();
        const refreshToken = storage.getItem('refreshToken');
        if (!refreshToken) {
            redirectToLogin();
            return false;
        }

        try {
            const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ refreshToken }),
            });

            if (response.ok) {
                const { accessToken } = await response.json();
                setToken(accessToken);
                return true;
            }
        } catch (error) {
            console.error('Hiba történt a token frissítése során:', error);
        }

        redirectToLogin();
        return false;
    };

    const redirectToLogin = () => {
        removeTokens();
        window.location.href = '/login';
    };

    const makeRequest = async (authToken: string) => {
        const headers = {
            'Authorization': `Bearer ${authToken}`,
            ...(options.headers || {}),
        };

        return fetch(`${API_BASE_URL}${url}`, {
            ...options,
            headers,
        });
    };

    try {
        const authToken = token || getToken();
        if (!authToken) {
            throw new Error('Nincs elérhető access token.');
        }

        let response = await makeRequest(authToken);

        if (response.status === 401 || response.status === 403) {
            const refreshed = await handleAuthError();
            const newToken = getToken();
            if (refreshed && newToken) {
                response = await makeRequest(newToken);
            }
        }

        return response;
    } catch (error) {
        console.error('Hiba történt a kérés során:', error);
    }
};

export default fetchWithAuth;