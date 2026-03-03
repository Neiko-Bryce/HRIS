import { Head } from '@inertiajs/react';
import { useEffect, useRef, useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { QrCode, Clock, Users, CheckCircle2, MinusCircle } from 'lucide-react';
import AppLogoIcon from '@/components/app-logo-icon';

interface LogEntry {
    id: number;
    name: string;
    time_in: string | null;
    time_out: string | null;
    status: string;
}

interface Props {
    logs: LogEntry[];
    total: number;
    scanUrl: string;
}

function formatTime(t: string | null) {
    if (!t) return '—';
    return new Date(`1970-01-01T${t}`).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

const STATUS_STYLES: Record<string, { label: string; classes: string }> = {
    present: { label: 'Present', classes: 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/20' },
    late: { label: 'Late', classes: 'bg-amber-500/15  text-amber-400  border border-amber-500/20' },
    'half-day': { label: 'Half Day', classes: 'bg-orange-500/15 text-orange-400 border border-orange-500/20' },
    undertime: { label: 'Undertime', classes: 'bg-sky-500/15   text-sky-400    border border-sky-500/20' },
    absent: { label: 'Absent', classes: 'bg-rose-500/15   text-rose-400   border border-rose-500/20' },
};

function initials(name: string) {
    return name.split(' ').slice(0, 2).map(p => p[0]).join('').toUpperCase();
}

const AVATAR_COLORS = [
    'bg-violet-500', 'bg-sky-500', 'bg-emerald-500',
    'bg-amber-500', 'bg-rose-500', 'bg-indigo-500',
    'bg-teal-500', 'bg-pink-500',
];

export default function Kiosk({ logs: initialLogs, total: initialTotal, scanUrl }: Props) {
    const [time, setTime] = useState(new Date());
    const [logs, setLogs] = useState<LogEntry[]>(initialLogs);
    const [total, setTotal] = useState(initialTotal);
    const [lastRefresh, setLastRefresh] = useState(new Date());
    const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
    const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

    // Live clock
    useEffect(() => {
        timerRef.current = setInterval(() => setTime(new Date()), 1000);
        return () => { if (timerRef.current) clearInterval(timerRef.current); };
    }, []);

    // Poll logs every 30 seconds
    useEffect(() => {
        pollRef.current = setInterval(async () => {
            try {
                const res = await fetch('/attendance/kiosk-logs');
                const data = await res.json();
                setLogs(data.logs);
                setTotal(data.total);
                setLastRefresh(new Date());
            } catch { /* silent */ }
        }, 30_000);
        return () => { if (pollRef.current) clearInterval(pollRef.current); };
    }, []);

    // Lock to its own light-ish style (dark but explicit — not affected by user theme)
    useEffect(() => {
        const html = document.documentElement;
        const wasDark = html.classList.contains('dark');
        html.classList.remove('dark');
        return () => { if (wasDark) html.classList.add('dark'); };
    }, []);

    const dateStr = time.toLocaleDateString('en-PH', {
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
    });
    const timeStr = time.toLocaleTimeString('en-PH', {
        hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true,
    });

    return (
        <>
            <Head title="Attendance Kiosk | HRIS Enterprise" />

            <div className="min-h-screen bg-zinc-950 text-white flex flex-col font-sans select-none overflow-hidden">

                {/* ── Top Bar ── */}
                <header className="flex items-center justify-between px-8 py-5 border-b border-white/[0.06]">
                    <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-white/10 border border-white/15">
                            <AppLogoIcon className="size-4 fill-current text-white" />
                        </div>
                        <div>
                            <p className="text-white font-black text-sm leading-none tracking-tight">HRIS Enterprise</p>
                            <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-[0.2em] mt-0.5">Virtual DTR Kiosk</p>
                        </div>
                    </div>

                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-widest text-zinc-400">
                        <QrCode size={10} />
                        Virtual Presence
                    </div>

                    <div className="flex items-center gap-2 text-[11px] font-bold text-zinc-500">
                        <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                        System Live · GMT+8
                    </div>
                </header>

                {/* ── Main Content ── */}
                <main className="flex-1 flex items-center justify-center px-8 py-10">
                    <div className="w-full max-w-6xl grid grid-cols-2 gap-6">

                        {/* ── LEFT: QR Panel ── */}
                        <div className="relative bg-white/[0.04] border border-white/[0.08] rounded-3xl p-10 flex flex-col items-center justify-center overflow-hidden">
                            {/* Background glow */}
                            <div className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-80 h-80 bg-primary/10 rounded-full blur-3xl" />

                            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500 mb-8">
                                Clock-in via QR Code
                            </p>

                            {/* QR with pulsing ring */}
                            <div className="relative mb-8">
                                <div className="absolute inset-0 rounded-3xl bg-primary/20 animate-ping opacity-30 scale-105" />
                                <div className="relative bg-white p-6 rounded-3xl shadow-2xl">
                                    <QRCodeSVG
                                        value={scanUrl}
                                        size={220}
                                        level="H"
                                        includeMargin={false}
                                        imageSettings={{
                                            src: '/logo.svg',
                                            x: undefined,
                                            y: undefined,
                                            height: 40,
                                            width: 40,
                                            excavate: true,
                                        }}
                                    />
                                </div>
                            </div>

                            <p className="text-xs font-black uppercase tracking-[0.2em] text-zinc-300 mb-1">
                                Registered Employees Only
                            </p>
                            <p className="text-[10px] font-bold text-zinc-600">
                                Scan with your phone camera · Refreshes every 60s
                            </p>

                            {/* How to steps */}
                            <div className="mt-8 w-full grid grid-cols-2 gap-3">
                                <div className="bg-white/[0.04] border border-white/[0.06] rounded-2xl p-4 flex items-start gap-3">
                                    <CheckCircle2 size={16} className="text-emerald-400 mt-0.5 shrink-0" />
                                    <div>
                                        <p className="text-xs font-black text-white">Open Scanner</p>
                                        <p className="text-[10px] text-zinc-500 mt-0.5">Use phone camera or employee app</p>
                                    </div>
                                </div>
                                <div className="bg-white/[0.04] border border-white/[0.06] rounded-2xl p-4 flex items-start gap-3">
                                    <CheckCircle2 size={16} className="text-emerald-400 mt-0.5 shrink-0" />
                                    <div>
                                        <p className="text-xs font-black text-white">Instant Verified</p>
                                        <p className="text-[10px] text-zinc-500 mt-0.5">Location &amp; identity confirmed</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* ── RIGHT: Clock + Log Panel ── */}
                        <div className="bg-white/[0.04] border border-white/[0.08] rounded-3xl p-10 flex flex-col overflow-hidden">

                            {/* Live Clock */}
                            <div className="mb-8 pb-8 border-b border-white/[0.06]">
                                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500 mb-3 flex items-center gap-2">
                                    <Clock size={10} /> Live Time
                                </p>
                                <p className="text-5xl font-black tracking-tight text-white tabular-nums leading-none">
                                    {timeStr}
                                </p>
                                <p className="mt-2 text-sm font-bold text-zinc-500">{dateStr}</p>
                            </div>

                            {/* Attendance Log */}
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-2">
                                    <Users size={14} className="text-primary" />
                                    <p className="text-sm font-black text-white tracking-tight">Today's Log</p>
                                </div>
                                <span className="text-[10px] font-bold text-zinc-600">
                                    Last updated {lastRefresh.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                            </div>

                            <div className="flex-1 flex flex-col gap-2 overflow-y-auto pr-1 scrollbar-hide">
                                {logs.length === 0 ? (
                                    <div className="flex-1 flex flex-col items-center justify-center text-zinc-600 gap-3 py-12">
                                        <MinusCircle size={32} />
                                        <p className="text-sm font-bold">No attendance records yet today</p>
                                    </div>
                                ) : (
                                    logs.map((entry, i) => {
                                        const badge = STATUS_STYLES[entry.status] ?? STATUS_STYLES.absent;
                                        const avatarColor = AVATAR_COLORS[i % AVATAR_COLORS.length];
                                        return (
                                            <div
                                                key={entry.id}
                                                className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-white/[0.03] border border-white/[0.05] hover:bg-white/[0.06] transition-colors"
                                            >
                                                {/* Avatar */}
                                                <div className={`w-9 h-9 rounded-xl ${avatarColor} flex items-center justify-center text-white text-[11px] font-black shrink-0`}>
                                                    {initials(entry.name)}
                                                </div>

                                                {/* Name */}
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-bold text-white truncate leading-none">{entry.name}</p>
                                                    <p className="text-[10px] text-zinc-600 mt-0.5 font-medium">
                                                        In {formatTime(entry.time_in)}
                                                        {entry.time_out ? <span className="ml-2">· Out {formatTime(entry.time_out)}</span> : ''}
                                                    </p>
                                                </div>

                                                {/* Status badge */}
                                                <span className={`shrink-0 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${badge.classes}`}>
                                                    {badge.label}
                                                </span>
                                            </div>
                                        );
                                    })
                                )}
                            </div>

                            {/* Footer count */}
                            <div className="mt-4 pt-4 border-t border-white/[0.06] flex items-center justify-between">
                                <p className="text-[11px] font-black text-zinc-500 uppercase tracking-widest">
                                    Total clocked in today
                                </p>
                                <p className="text-lg font-black text-primary tabular-nums">{total}</p>
                            </div>
                        </div>

                    </div>
                </main>

            </div>
        </>
    );
}
