import { Head } from '@inertiajs/react';
import Navbar from '@/components/landing/Navbar';
import Hero from '@/components/landing/Hero';
import Metrics from '@/components/landing/Metrics';
import Features from '@/components/landing/Features';
import Analytics from '@/components/landing/Analytics';
import Testimonials from '@/components/landing/Testimonials';
import Footer from '@/components/landing/Footer';
import { QRCodeSVG } from 'qrcode.react';
import { QrCode, Smartphone, CheckCircle2 } from 'lucide-react';

export default function Welcome() {
    // This could be a dynamic URL to a mobile app or check-in page
    const checkInUrl = window.location.origin + '/attendance/scan';

    return (
        <div className="min-h-screen bg-background font-sans antialiased text-foreground">
            <Head title="Enterprise HRIS | HRIS Pro" />

            <Navbar />

            <main>
                <Hero />

                {/* QR DTR Section */}
                <section className="py-20 bg-zinc-950 text-white overflow-hidden relative">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.1),transparent_70%)] pointer-events-none" />
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative">
                        <div className="flex flex-col items-center text-center mb-12">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-widest mb-4">
                                <QrCode size={12} />
                                Virtual Presence
                            </div>
                            <h2 className="text-3xl md:text-5xl font-black tracking-tight mb-4">Clock-in via <span className="text-primary italic">QR Code</span></h2>
                            <p className="text-zinc-400 max-w-2xl font-medium leading-relaxed">
                                Simply scan the code below with your company mobile app or smartphone camera
                                to instantly record your attendance. Fast, secure, and touchless.
                            </p>
                        </div>

                        <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-16">
                            {/* The "Balanced" QR Card */}
                            <div className="relative group">
                                <div className="absolute -inset-4 bg-primary/20 rounded-[2.5rem] blur-2xl opacity-50 group-hover:opacity-100 transition duration-1000 group-hover:duration-200" />
                                <div className="relative bg-white p-8 rounded-[2rem] shadow-2xl flex flex-col items-center">
                                    <div className="p-4 bg-zinc-50 rounded-2xl border border-zinc-100 mb-4">
                                        <QRCodeSVG
                                            value={checkInUrl}
                                            size={220}
                                            level="H"
                                            includeMargin={false}
                                            imageSettings={{
                                                src: "/logo.svg", // Assuming logo.svg exists or just use a placeholder
                                                x: undefined,
                                                y: undefined,
                                                height: 40,
                                                width: 40,
                                                excavate: true,
                                            }}
                                        />
                                    </div>
                                    <div className="text-zinc-950 text-center">
                                        <p className="font-black text-sm uppercase tracking-tighter">Registered Employees Only</p>
                                        <p className="text-[10px] font-bold text-zinc-400 mt-0.5">Scans refresh every 60 seconds</p>
                                    </div>
                                </div>
                            </div>

                            {/* Instructions */}
                            <div className="flex flex-col gap-6 max-w-xs">
                                <div className="flex gap-4">
                                    <div className="w-10 h-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shrink-0">
                                        <Smartphone size={20} />
                                    </div>
                                    <div>
                                        <p className="font-bold text-white text-sm">Open Scanner</p>
                                        <p className="text-zinc-500 text-xs mt-1">Use the built-in scanner in your employee dashboard or mobile device.</p>
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <div className="w-10 h-10 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500 shrink-0">
                                        <CheckCircle2 size={20} />
                                    </div>
                                    <div>
                                        <p className="font-bold text-white text-sm">Instant Verified</p>
                                        <p className="text-zinc-500 text-xs mt-1">Your location and identity are verified instantly upon successful scan.</p>
                                    </div>
                                </div>
                                <div className="pt-4 border-t border-zinc-800">
                                    <div className="flex flex-col gap-2">
                                        <div className="w-full h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                                            <div className="w-1/3 h-full bg-primary animate-[shimmer_2s_infinite]" />
                                        </div>
                                        <p className="text-[9px] font-black text-zinc-600 uppercase tracking-widest text-center">System Live · GMT+8</p>
                                    </div>
                                </div>
                            </div>
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
