import { useEffect, useState } from 'react';
import {
    ResponsiveContainer,
    BarChart,
    Bar,
    XAxis,
    CartesianGrid,
    Tooltip,
    LineChart,
    Line,
    PieChart,
    Pie,
    Cell
} from 'recharts';
import { CheckCircle2, ArrowUpRight } from 'lucide-react';
import { motion } from 'framer-motion';

const attendanceData = [
    { name: 'Mon', value: 92 },
    { name: 'Tue', value: 95 },
    { name: 'Wed', value: 98 },
    { name: 'Thu', value: 94 },
    { name: 'Fri', value: 91 },
];

const perfData = [
    { name: 'Jan', score: 65 },
    { name: 'Feb', score: 68 },
    { name: 'Mar', score: 75 },
    { name: 'Apr', score: 72 },
    { name: 'May', score: 85 },
];

const deptData = [
    { name: 'Ops', value: 40 },
    { name: 'Eng', value: 30 },
    { name: 'Sales', value: 20 },
    { name: 'HR', value: 10 },
];

const COLORS = ['#1E3A8A', '#3B82F6', '#111827', '#9CA3AF'];

export default function Analytics() {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted) return <section id="analytics" className="py-24 bg-background h-[600px]" />;

    return (
        <section id="analytics" className="py-32 bg-background overflow-hidden relative border-y border-zinc-200/50">
            <div className="absolute bottom-[-10%] right-[-5%] size-[30%] bg-accent/5 rounded-full blur-[120px] pointer-events-none" />

            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative">
                <div className="flex flex-col lg:flex-row items-center gap-20">
                    {/* Content */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="flex-1"
                    >
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-widest mb-6">
                            Insights Engine
                        </div>
                        <h2 className="text-4xl font-black text-zinc-950 tracking-tight sm:text-5xl mb-8 leading-[1.1]">
                            Data-Driven <br /><span className="text-primary italic">Intelligence.</span>
                        </h2>
                        <p className="text-lg text-zinc-500 mb-12 leading-relaxed font-medium">
                            Don't just manage. Understand. HRIS Pro transforms complex workforce data
                            into clear, actionable strategies with real-time analytics.
                        </p>

                        <div className="space-y-6">
                            {[
                                'Live attendance heatmaps',
                                'AI-powered turnover predictions',
                                'Departmental efficiency scores',
                                'Global workforce distribution'
                            ].map((bullet, i) => (
                                <div key={i} className="flex items-center gap-4 group">
                                    <div className="flex-shrink-0 size-6 rounded-full bg-zinc-950 flex items-center justify-center text-white scale-90 group-hover:scale-100 transition-transform">
                                        <CheckCircle2 size={14} />
                                    </div>
                                    <span className="text-base font-bold text-zinc-900">{bullet}</span>
                                </div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Preview Cards */}
                    <div className="flex-1 w-full grid grid-cols-2 gap-6 relative">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="col-span-2 glass-card rounded-[2rem] border-white/60 p-10 shadow-2xl h-80 relative overflow-hidden group"
                        >
                            <div className="flex items-center justify-between mb-8">
                                <span className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em]">
                                    Attendance Trends (%)
                                </span>
                                <ArrowUpRight size={16} className="text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                            </div>
                            <div className="h-[180px] w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={attendanceData}>
                                        <defs>
                                            <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="0%" stopColor="var(--color-primary)" stopOpacity={1} />
                                                <stop offset="100%" stopColor="var(--color-primary)" stopOpacity={0.6} />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="currentColor" opacity={0.05} />
                                        <XAxis dataKey="name" fontSize={10} axisLine={false} tickLine={false} tick={{ fill: 'currentColor', opacity: 0.4 }} />
                                        <Tooltip
                                            cursor={{ fill: 'currentColor', opacity: 0.03 }}
                                            contentStyle={{
                                                backgroundColor: 'rgba(255, 255, 255, 0.8)',
                                                backdropFilter: 'blur(10px)',
                                                borderRadius: '16px',
                                                border: '1px solid rgba(255, 255, 255, 0.4)',
                                                boxShadow: '0 20px 40px -15px rgba(0,0,0,0.1)'
                                            }}
                                        />
                                        <Bar dataKey="value" fill="url(#barGradient)" radius={[6, 6, 0, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.2 }}
                            className="glass-card rounded-[2rem] border-white/60 p-8 shadow-2xl h-64 flex flex-col"
                        >
                            <span className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em] mb-6 block">
                                Performance
                            </span>
                            <div className="flex-1 h-full w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={perfData}>
                                        <Line
                                            type="monotone"
                                            dataKey="score"
                                            stroke="var(--color-primary)"
                                            strokeWidth={4}
                                            dot={{ r: 0, fill: 'var(--color-primary)' }}
                                            activeDot={{ r: 6, strokeWidth: 0 }}
                                        />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.3 }}
                            className="bg-zinc-950 rounded-[2rem] p-8 shadow-2xl h-64 flex flex-col items-center"
                        >
                            <span className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em] mb-6 block w-full text-left">
                                Headcount
                            </span>
                            <div className="flex-1 h-full w-full relative">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={deptData}
                                            innerRadius={40}
                                            outerRadius={60}
                                            paddingAngle={8}
                                            dataKey="value"
                                            stroke="none"
                                        >
                                            {deptData.map((entry, index) => (
                                                <Cell key={`cell - ${index} `} fill={COLORS[index % COLORS.length]} />
                                            ))}
                                        </Pie>
                                    </PieChart>
                                </ResponsiveContainer>
                                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                    <span className="text-xl font-black text-white">82%</span>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </section>
    );
}
