import { Head } from '@inertiajs/react';
import { useEffect } from 'react';
import Navbar from '@/components/landing/Navbar';
import Hero from '@/components/landing/Hero';
import Metrics from '@/components/landing/Metrics';
import Features from '@/components/landing/Features';
import Analytics from '@/components/landing/Analytics';
import Testimonials from '@/components/landing/Testimonials';
import Footer from '@/components/landing/Footer';
import { QrCode } from 'lucide-react';

export default function Welcome() {

    // Lock the landing page to light mode regardless of the user's theme setting
    useEffect(() => {
        const html = document.documentElement;
        const wasDark = html.classList.contains('dark');
        html.classList.remove('dark');

        return () => {
            // Restore the user's theme when leaving the landing page
            if (wasDark) {
                html.classList.add('dark');
            }
        };
    }, []);

    return (
        <div className="min-h-screen bg-white font-sans antialiased text-zinc-900">
            <Head title="Enterprise HRIS | HRIS Pro" />

            <Navbar />

            <main>
                <Hero />


                {/* QR Kiosk CTA */}
                <section className="py-20 bg-zinc-950 text-white overflow-hidden relative">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.08),transparent_70%)] pointer-events-none" />
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative">
                        <div className="flex flex-col items-center text-center">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-widest mb-6">
                                <QrCode size={12} />
                                Virtual Presence
                            </div>
                            <h2 className="text-3xl md:text-5xl font-black tracking-tight mb-4">
                                Clock-in via <span className="text-primary italic">QR Code</span>
                            </h2>
                            <p className="text-zinc-400 max-w-xl font-medium leading-relaxed mb-10">
                                A dedicated kiosk display is available for your lobby or office entrance —
                                employees simply scan the QR code with their phone to record attendance instantly.
                            </p>
                            <a
                                href="/attendance/kiosk"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-3 px-8 h-14 rounded-2xl bg-primary text-white font-black text-sm shadow-2xl hover:bg-primary/90 transition-all hover:scale-105 active:scale-95"
                            >
                                <QrCode size={18} />
                                Open Attendance Kiosk
                            </a>
                            <p className="mt-4 text-[11px] text-zinc-600 font-bold uppercase tracking-widest">
                                Opens full-screen · No login required
                            </p>
                        </div>
                    </div>
                </section>


                <Metrics />
                <Features />
                <Analytics />
                <Testimonials />
            </main>

            <Footer />
        </div>
    );
}
