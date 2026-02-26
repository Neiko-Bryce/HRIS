import { Head, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { CheckCircle, Clock, MapPin, UserCheck, LogOut } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import React from 'react';

interface Attendance {
    id: number;
    check_in: string | null;
    check_out: string | null;
    status: string;
}

export default function DTRScan({ todayAttendance }: { todayAttendance: Attendance | null }) {
    const { post, processing } = useForm({});

    const handleScanAction = () => {
        post(route('attendance.scan'));
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
                            <UserCheck size={40} className="animate-pulse" />
                        </div>

                        <h1 className="text-3xl font-black text-foreground tracking-tight mb-2">Virtual DTR</h1>
                        <p className="text-muted-foreground text-sm font-medium mb-8">
                            Confirm your attendance for <strong>{new Date().toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</strong>
                        </p>

                        <div className="space-y-4 mb-10">
                            <div className="flex items-center justify-between p-4 rounded-2xl bg-muted/30 border border-border">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-green-500/10 text-green-600 rounded-lg">
                                        <Clock size={18} />
                                    </div>
                                    <span className="text-xs font-black uppercase tracking-wider text-muted-foreground">Check In</span>
                                </div>
                                <span className="text-lg font-black text-foreground">
                                    {todayAttendance?.check_in ? new Date(`1970-01-01T${todayAttendance.check_in}`).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '--:--'}
                                </span>
                            </div>

                            <div className="flex items-center justify-between p-4 rounded-2xl bg-muted/30 border border-border">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-blue-500/10 text-blue-600 rounded-lg">
                                        <LogOut size={18} />
                                    </div>
                                    <span className="text-xs font-black uppercase tracking-wider text-muted-foreground">Check Out</span>
                                </div>
                                <span className="text-lg font-black text-foreground">
                                    {todayAttendance?.check_out ? new Date(`1970-01-01T${todayAttendance.check_out}`).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '--:--'}
                                </span>
                            </div>
                        </div>

                        {!todayAttendance?.check_out ? (
                            <Button
                                size="lg"
                                disabled={processing}
                                onClick={handleScanAction}
                                className={`w-full h-16 rounded-2xl text-lg font-black tracking-widest shadow-lg transition-all active:scale-[0.98] ${todayAttendance ? 'bg-amber-500 hover:bg-amber-600' : 'bg-primary hover:bg-primary/90'
                                    }`}
                            >
                                {processing ? (
                                    'PROCESSING...'
                                ) : (
                                    <>
                                        {todayAttendance ? <LogOut className="mr-3" /> : <UserCheck className="mr-3" />}
                                        {todayAttendance ? 'CONFIRM CHECK-OUT' : 'CONFIRM CHECK-IN'}
                                    </>
                                )}
                            </Button>
                        ) : (
                            <div className="bg-green-500/10 border border-green-500/20 rounded-2xl p-6 text-green-600">
                                <CheckCircle size={32} className="mx-auto mb-3" />
                                <p className="font-black tracking-tight">ATTENDANCE COMPLETED</p>
                                <p className="text-[10px] uppercase font-bold tracking-widest opacity-80 mt-1">See you tomorrow!</p>
                            </div>
                        )}

                        <p className="mt-8 text-[10px] text-muted-foreground font-bold flex items-center justify-center gap-1.5 opacity-60">
                            <MapPin size={10} /> YOUR LOCATION IS RECORDED SECURELY
                        </p>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
