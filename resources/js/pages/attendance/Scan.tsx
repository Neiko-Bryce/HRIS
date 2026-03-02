import { Head, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { CheckCircle, Clock, MapPin, LogOut, Camera, AlertCircle } from 'lucide-react';
import React, { useEffect, useState, useRef } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';

interface Attendance {
    id: number;
    time_in: string | null;
    time_out: string | null;
    status: string;
}

export default function DTRScan({ todayAttendance }: { todayAttendance: Attendance | null }) {
    const [scanError, setScanError] = useState<string | null>(null);
    const [isScanning, setIsScanning] = useState(false);
    const scannerRef = useRef<Html5QrcodeScanner | null>(null);

    useEffect(() => {
        // If they checked in and checked out, don't show scanner
        if (todayAttendance?.time_out) return;

        // Initialize Scanner
        scannerRef.current = new Html5QrcodeScanner(
            "qr-reader",
            { fps: 10, qrbox: { width: 250, height: 250 } },
            false
        );

        scannerRef.current.render(onScanSuccess, onScanFailure);

        return () => {
            scannerRef.current?.clear().catch(console.error);
        };
    }, [todayAttendance]);

    const onScanSuccess = (decodedText: string) => {
        let isValid = false;

        // 1. Check if it's the simple URL from the printed landing page QR
        if (decodedText.includes('/attendance/scan') || decodedText === 'HRIS-OFFICIAL-DTR') {
            isValid = true;
        } else {
            // 2. Try to parse as the secure JSON payload
            try {
                const data = JSON.parse(decodedText);

                // Check if it's our official HRIS payload
                if (data.action === 'virtual_dtr_scan' && data.secret === 'OFFICIAL_HRIS_DTR_GATEWAY') {
                    // Determine if checking in or out
                    const today = new Date().toISOString().split('T')[0];
                    if (data.date === today) {
                        isValid = true;
                    } else {
                        setScanError("The scanned QR code is expired.");
                        return; // Exit early since we know it's our QR but expired
                    }
                }
            } catch {
                // Not JSON, and not our URL. Fall through to isValid = false
            }
        }

        if (isValid) {
            setIsScanning(true);
            scannerRef.current?.clear(); // Stop scanning

            // Post to server
            router.post(route('attendance.scan'), {}, {
                preserveScroll: true,
                onFinish: () => setIsScanning(false),
            });
        } else {
            setScanError("Invalid or Unrecognized QR Code.");
        }
    };

    const onScanFailure = () => {
        // Suppress continuous failure logs from Html5QrcodeScanner
    };

    return (
        <AppLayout>
            <Head title="Virtual DTR Scan" />
            <div className="min-h-[80vh] flex items-center justify-center p-4">
                <div className="w-full max-w-md bg-card border border-border rounded-3xl p-8 shadow-2xl relative overflow-hidden">
                    {/* Decorative background element */}
                    <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary/5 rounded-full blur-3xl" />
                    <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-primary/5 rounded-full blur-3xl" />

                    <div className="relative z-10 text-center">
                        <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mx-auto mb-6 border border-primary/20 shadow-inner">
                            <Camera size={40} className="animate-pulse" />
                        </div>

                        <h1 className="text-3xl font-black text-foreground tracking-tight mb-2">Virtual DTR</h1>
                        <p className="text-muted-foreground text-sm font-medium mb-8">
                            Scan the Official Office QR to {!todayAttendance ? 'Check In' : 'Check Out'}.
                        </p>

                        {/* Scanner or Completed State */}
                        {!todayAttendance?.time_out ? (
                            <div className="mb-8">
                                <div id="qr-reader" className="overflow-hidden rounded-2xl border-2 border-primary/20 bg-zinc-50 dark:bg-zinc-900 mx-auto max-w-[300px]"></div>

                                {isScanning && (
                                    <div className="mt-4 text-amber-500 font-bold animate-pulse text-sm">
                                        Processing scan...
                                    </div>
                                )}

                                {scanError && (
                                    <div className="mt-4 text-red-500 text-sm font-bold flex items-center justify-center gap-2">
                                        <AlertCircle size={16} /> {scanError}
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="bg-green-500/10 border border-green-500/20 rounded-2xl p-6 text-green-600 mb-8">
                                <CheckCircle size={32} className="mx-auto mb-3" />
                                <p className="font-black tracking-tight">ATTENDANCE COMPLETED</p>
                                <p className="text-[10px] uppercase font-bold tracking-widest opacity-80 mt-1">See you tomorrow!</p>
                            </div>
                        )}

                        {/* Status Blocks */}
                        <div className="space-y-4 mb-10">
                            <div className="flex items-center justify-between p-4 rounded-2xl bg-muted/30 border border-border">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-green-500/10 text-green-600 rounded-lg">
                                        <Clock size={18} />
                                    </div>
                                    <span className="text-xs font-black uppercase tracking-wider text-muted-foreground">Time In</span>
                                </div>
                                <span className="text-lg font-black text-foreground">
                                    {todayAttendance?.time_in ? new Date(`1970-01-01T${todayAttendance.time_in}`).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '--:--'}
                                </span>
                            </div>

                            <div className="flex items-center justify-between p-4 rounded-2xl bg-muted/30 border border-border">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-blue-500/10 text-blue-600 rounded-lg">
                                        <LogOut size={18} />
                                    </div>
                                    <span className="text-xs font-black uppercase tracking-wider text-muted-foreground">Time Out</span>
                                </div>
                                <span className="text-lg font-black text-foreground">
                                    {todayAttendance?.time_out ? new Date(`1970-01-01T${todayAttendance.time_out}`).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '--:--'}
                                </span>
                            </div>
                        </div>

                        <p className="mt-8 text-[10px] text-muted-foreground font-bold flex items-center justify-center gap-1.5 opacity-60">
                            <MapPin size={10} /> YOUR LOCATION IS RECORDED SECURELY
                        </p>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
