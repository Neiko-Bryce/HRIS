import React, { useState, useEffect } from 'react';
import { Head } from '@inertiajs/react';
import { QRCodeSVG } from 'qrcode.react';
import AppLayout from '@/layouts/app-layout';
import { MonitorSmartphone, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';

export default function GenerateQR() {
    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    // Secure payload that updates with the date
    const payload = JSON.stringify({
        action: 'virtual_dtr_scan',
        date: currentTime.toISOString().split('T')[0],
        secret: 'OFFICIAL_HRIS_DTR_GATEWAY'
    });

    return (
        <AppLayout>
            <Head title="Office DTR Terminal" />
            <div className="flex-1 w-full bg-zinc-950 flex flex-col items-center justify-center min-h-[85vh] p-4 lg:p-12 relative overflow-hidden rounded-3xl mt-4 border border-zinc-800 shadow-2xl">

                {/* Visual Flair Background */}
                <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-primary/20 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-20%] right-[-10%] w-[40%] h-[40%] bg-accent/20 rounded-full blur-[100px]" />

                <div className="relative z-10 max-w-4xl w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

                    {/* Left: Clock and Instructions */}
                    <div className="text-white space-y-8 text-center lg:text-left">
                        <div>
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 mb-6 backdrop-blur-md">
                                <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                                <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-300">Terminal Active</span>
                            </div>
                            <h1 className="text-4xl md:text-5xl lg:text-7xl font-black text-white tracking-tighter leading-none mb-4">
                                Virtual <span className="text-primary italic">DTR</span>
                            </h1>
                            <p className="text-zinc-400 text-lg md:text-xl font-medium">Headquarters Terminal</p>
                        </div>

                        <div className="py-8 border-y border-white/10">
                            <p className="text-6xl md:text-8xl font-black tabular-nums tracking-tighter text-white">
                                {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', timeZone: 'Asia/Manila' })}
                            </p>
                            <p className="text-xl md:text-2xl font-bold text-zinc-500 uppercase tracking-widest mt-2">
                                {currentTime.toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', timeZone: 'Asia/Manila' })}
                            </p>
                        </div>

                        <div className="flex flex-col gap-4">
                            <div className="flex items-center gap-4 bg-white/5 p-4 rounded-2xl border border-white/10">
                                <div className="p-3 bg-primary/20 rounded-xl text-primary"><MonitorSmartphone size={24} /></div>
                                <div className="text-left">
                                    <p className="font-bold text-white text-sm">1. Open your Employee Portal</p>
                                    <p className="text-zinc-400 text-xs">Navigate to the Virtual DTR tab on your phone</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4 bg-white/5 p-4 rounded-2xl border border-white/10">
                                <div className="p-3 bg-primary/20 rounded-xl text-primary"><div className="w-6 h-6 border-2 border-current rounded-md border-dashed" /></div>
                                <div className="text-left">
                                    <p className="font-bold text-white text-sm">2. Scan this code</p>
                                    <p className="text-zinc-400 text-xs">Point your camera at the screen to log your time</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right: The QR Code */}
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="flex justify-center"
                    >
                        <div className="relative p-2 rounded-[2rem] bg-gradient-to-tr from-primary/50 to-accent/50 p-2 shadow-2xl max-w-sm w-full">
                            <div className="bg-white p-8 rounded-[1.8rem] w-full aspect-square flex items-center justify-center relative overflow-hidden">
                                {/* Corner Accents */}
                                <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-primary m-4 rounded-tl-xl" />
                                <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-primary m-4 rounded-tr-xl" />
                                <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-primary m-4 rounded-bl-xl" />
                                <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-primary m-4 rounded-br-xl" />

                                <QRCodeSVG
                                    value={payload}
                                    size={256}
                                    className="w-full h-full p-4 relative z-10"
                                    level="H"
                                    includeMargin={false}
                                />
                            </div>
                            <div className="mt-6 flex items-center justify-center gap-2 text-white/80">
                                <ShieldCheck size={16} />
                                <span className="text-xs font-bold uppercase tracking-widest">End-to-End Encrypted</span>
                            </div>
                        </div>
                    </motion.div>

                </div>
            </div>
        </AppLayout>
    );
}
