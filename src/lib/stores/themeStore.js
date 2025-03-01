import { writable } from 'svelte/store';

function createThemeStore() {
    // Check if theme preference exists in localStorage
    const storedTheme = typeof window !== 'undefined' 
        ? localStorage.getItem('theme') 
        : 'light';
    
    const { subscribe, set, update } = writable(storedTheme || 'light');

    return {
        subscribe,
        toggleTheme: () => {
            update(currentTheme => {
                const newTheme = currentTheme === 'light' ? 'dark' : 'light';
                if (typeof window !== 'undefined') {
                    localStorage.setItem('theme', newTheme);
                    document.documentElement.classList.toggle('dark');
                }
                return newTheme;
            });
        },
        setTheme: (theme) => {
            if (theme === 'dark' || theme === 'light') {
                if (typeof window !== 'undefined') {
                    localStorage.setItem('theme', theme);
                    document.documentElement.classList.toggle('dark', theme === 'dark');
                }
                set(theme);
            }
        },
        initialize: () => {
            if (typeof window !== 'undefined') {
                const theme = localStorage.getItem('theme') || 'light';
                document.documentElement.classList.toggle('dark', theme === 'dark');
                set(theme);
            }
        }
    };
}

export const themeStore = createThemeStore(); 