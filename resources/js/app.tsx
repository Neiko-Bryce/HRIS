import '../css/app.css';

import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { createRoot } from 'react-dom/client';
import { route as routeFn } from 'ziggy-js';

declare global {
    const route: typeof routeFn;
}
const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

// @ts-expect-error - Ziggy route helper is globally injected by Laravel
window.route = routeFn;

createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    resolve: (name) => resolvePageComponent(`./pages/${name}.tsx`, import.meta.glob('./pages/**/*.tsx')),
    setup({ el, App, props }) {
        const root = createRoot(el);

        root.render(<App {...props} />);
    },
    progress: {
        color: '#4B5563',
    },
});

const applyTheme = () => {
    // Force light mode regardless of preference
    document.documentElement.classList.remove('dark');
};

const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

const handleSystemThemeChange = () => {
    applyTheme();
};

// This will set light / dark mode on load...
applyTheme();
mediaQuery.addEventListener('change', handleSystemThemeChange);
