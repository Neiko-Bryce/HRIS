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

import { Toaster } from 'sonner';

createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    resolve: (name) => resolvePageComponent(`./pages/${name}.tsx`, import.meta.glob('./pages/**/*.tsx')),
    setup({ el, App, props }) {
        const root = createRoot(el);

        root.render(
            <>
                <App {...props} />
                <Toaster
                    position="top-right"
                    visibleToasts={1}
                    expand={false}
                    richColors={true}
                    closeButton
                    toastOptions={{
                        classNames: {
                            toast: 'group !bg-white/90 !backdrop-blur-xl !border-emerald-500/20 !rounded-2xl !p-5 !shadow-[0_15px_40px_rgba(0,0,0,0.08)] !flex !items-center !gap-4 !scale-110 !mt-4 !mr-4 border-l-4 !border-l-emerald-500 transition-all duration-300',
                            title: 'text-[11px] font-black uppercase tracking-[0.1em] text-emerald-950 leading-none mb-1',
                            description: 'text-[10px] font-bold text-emerald-800/60 uppercase tracking-widest leading-none',
                            success: '!bg-emerald-50/90 !border-l-emerald-500 !border-emerald-500/10',
                            error: '!bg-rose-50/90 !border-l-rose-500 !border-rose-500/10 !text-rose-950',
                        },
                    }}
                />
            </>
        );
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
