import AppLogoIcon from '@/components/app-logo-icon';
import { Link } from '@inertiajs/react';
import { useEffect } from 'react';
import { ShieldCheck, Zap, BadgeCheck, ArrowLeft } from 'lucide-react';

interface AuthLayoutProps {
    children: React.ReactNode;
    name?: string;
    title?: string;
    description?: string;
}

const features = [
    { icon: ShieldCheck, color: 'text-emerald-400', text: 'Enterprise-grade security' },
    { icon: Zap, color: 'text-yellow-400', text: 'Real-time workforce analytics' },
    { icon: BadgeCheck, color: 'text-sky-400', text: 'Verified and audited platform' },
];

export default function AuthSimpleLayout({ children, description }: AuthLayoutProps) {
    useEffect(() => {
        const html = document.documentElement;
        const wasDark = html.classList.contains('dark');
        html.classList.remove('dark');
        return () => { if (wasDark) html.classList.add('dark'); };
    }, []);

    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-[#e8eaed] font-sans p-4 sm:p-6">

            {/* ── Card ── */}
            <div className="w-full max-w-[900px] flex flex-col md:flex-row rounded-[1.75rem] overflow-hidden shadow-2xl bg-white min-h-[520px]">

                {/* ══ LEFT PANEL ══ */}
                <div className="relative w-full md:w-1/2 flex flex-col p-8 md:p-10 overflow-hidden
                                bg-gradient-to-br from-zinc-900 via-[#1a1f2e] to-zinc-950">
                    {/* Glows */}
                    <div className="pointer-events-none absolute top-0 left-0 w-full h-full"
                        style={{ background: 'radial-gradient(ellipse at 30% 20%, rgba(59,130,246,0.18) 0%, transparent 65%)' }} />
                    <div className="pointer-events-none absolute bottom-0 right-0 w-64 h-64 rounded-full blur-[90px]"
                        style={{ background: 'rgba(59,130,246,0.12)' }} />

                    {/* Logo icon */}
                    <div className="relative z-10">
                        <div className="inline-flex items-center justify-center w-11 h-11 rounded-xl
                                        bg-white/10 border border-white/20 shadow-lg backdrop-blur-sm">
                            <AppLogoIcon className="size-5 fill-current text-white" />
                        </div>
                    </div>

                    {/* Main copy */}
                    <div className="relative z-10 mt-8 md:mt-10 flex-1 flex flex-col justify-center">
                        <h2 className="text-[1.75rem] md:text-[2rem] font-black text-white leading-[1.1] tracking-tight">
                            Human Resources<br />Management<br />
                            <span className="text-primary italic">System</span>
                        </h2>
                        <p className="mt-4 text-sm text-zinc-400 font-medium leading-relaxed max-w-[260px]">
                            Secure, efficient, and intelligent HR operations for modern enterprises.
                        </p>

                        <p className="mt-8 text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500">
                            HRIS Enterprise
                        </p>

                        <ul className="mt-4 space-y-3">
                            {features.map(({ icon: Icon, color, text }) => (
                                <li key={text} className="flex items-center gap-3">
                                    <Icon size={15} className={`${color} shrink-0`} />
                                    <span className="text-sm font-semibold text-zinc-300">{text}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* ══ RIGHT PANEL ══ */}
                <div className="w-full md:w-1/2 flex flex-col bg-white p-8 md:px-12 md:py-10">
                    {/* Heading */}
                    <div className="text-center mb-6 md:mb-8">
                        <h1 className="text-2xl font-black text-zinc-950 tracking-tight">Welcome Back</h1>
                        <p className="mt-1.5 text-sm text-zinc-400 font-medium">
                            {description ?? 'Sign in to access your dashboard'}
                        </p>
                    </div>

                    {/* Form */}
                    <div className="flex-1">
                        {children}
                    </div>

                    {/* Back to home at bottom */}
                    <div className="mt-6 flex justify-center">
                        <Link
                            href={route('home')}
                            className="inline-flex items-center gap-2 text-xs font-bold text-zinc-400 hover:text-primary transition-colors"
                        >
                            <ArrowLeft size={12} />
                            Back to home
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
