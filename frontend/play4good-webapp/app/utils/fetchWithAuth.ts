export const fetchWithAuth = async (url: string, options: RequestInit = {}) => {
    const defaultOptions: RequestInit = {
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
            ...options.headers,
        },
    };

    const response = await fetch(url, {
        ...defaultOptions,
        ...options,
    });

    if (response.status === 401) {
        // Redirect to login page if unauthorized
        window.location.href = '/auth';
        throw new Error('Please log in to continue');
    }

    return response;
};