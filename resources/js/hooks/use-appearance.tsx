import { useCallback, useEffect, useState } from 'react';

export type Appearance = 'light' | 'dark' | 'system';


const applyTheme = () => {
    // Force light mode regardless of preference
    document.documentElement.classList.remove('dark');
};

const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

const handleSystemThemeChange = () => {
    applyTheme();
};

export function initializeTheme() {
    applyTheme();

    // Add the event listener for system theme changes...
    mediaQuery.addEventListener('change', handleSystemThemeChange);
}

export function useAppearance() {
    const [appearance, setAppearance] = useState<Appearance>('system');

    const updateAppearance = useCallback((mode: Appearance) => {
        setAppearance(mode);
        localStorage.setItem('appearance', mode);
        applyTheme();
    }, []);

    useEffect(() => {
        const savedAppearance = localStorage.getItem('appearance') as Appearance | null;
        updateAppearance(savedAppearance || 'system');

        return () => mediaQuery.removeEventListener('change', handleSystemThemeChange);
    }, [updateAppearance]); // Added updateAppearance to dependency array for linting, though it's stable.

    return { appearance, updateAppearance };
}
