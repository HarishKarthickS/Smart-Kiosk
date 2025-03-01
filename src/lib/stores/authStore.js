import { writable } from 'svelte/store';

// Initial auth state
const initialState = {
    isAuthenticated: false,
    user: null,
    role: null,
    token: null
};

function createAuthStore() {
    const { subscribe, set, update } = writable(initialState);

    return {
        subscribe,
        login: (userData) => {
            // Simulate JWT token creation
            const token = btoa(JSON.stringify({ ...userData, exp: Date.now() + 3600000 }));
            localStorage.setItem('auth_token', token);
            
            set({
                isAuthenticated: true,
                user: userData,
                role: userData.role,
                token
            });
        },
        logout: () => {
            localStorage.removeItem('auth_token');
            set(initialState);
        },
        checkAuth: () => {
            const token = localStorage.getItem('auth_token');
            if (token) {
                try {
                    const userData = JSON.parse(atob(token));
                    if (userData.exp > Date.now()) {
                        set({
                            isAuthenticated: true,
                            user: userData,
                            role: userData.role,
                            token
                        });
                        return true;
                    }
                } catch (e) {
                    console.error('Invalid token:', e);
                }
            }
            return false;
        }
    };
}

export const authStore = createAuthStore(); 