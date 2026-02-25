import { useEffect, useState } from 'react';
import {
    ResponsiveContainer,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    LineChart,
    Line,
    PieChart,
    Pie,
    Cell
} from 'recharts';
import { CheckCircle2 } from 'lucide-react';

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
        <section id="analytics" className="py-24 bg-background overflow-hidden relative border-y border-border/50">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col lg:flex-row items-center gap-16">
                    {/* Content */}
                    <div className="flex-1">
                        <h2 className="text-3xl font-bold text-foreground tracking-tight sm:text-4xl mb-6">
                            Insightful People Analytics
                        </h2>
                        <p className="text-lg text-muted-foreground mb-10 leading-relaxed font-medium">
                            Navigate complexity with data. HRIS Pro provides real-time visibility
                            into attendance patterns, performance trends, and organizational health.
                        </p>

                        <div className="space-y-5">
                            {[
                                'Real-time attendance dashboards',
                                'Automated performance scoring',
                                'Organizational structure insights',
                                'Predictive turnover analysis'
                            ].map((bullet, i) => (
                                <div key={i} className="flex items-center gap-4">
                                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                        <CheckCircle2 size={16} />
                                    </div>
                                    <span className="text-base font-semibold text-foreground/90">{bullet}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Preview Cards */}
                    <div className="flex-1 w-full grid grid-cols-2 gap-6">
                        <div className="col-span-2 bg-card rounded-2xl border border-border/50 p-8 shadow-sm h-72">
                            <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-6 block">
                                Weekly Attendance (%)
                            </span>
                            <div className="h-[180px] w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={attendanceData}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="currentColor" opacity={0.1} />
                                        <XAxis dataKey="name" fontSize={10} axisLine={false} tickLine={false} tick={{ fill: 'currentColor', opacity: 0.5 }} />
                                        <YAxis domain={[0, 100]} fontSize={10} axisLine={false} tickLine={false} tick={{ fill: 'currentColor', opacity: 0.5 }} />
                                        <Tooltip
                                            cursor={{ fill: 'currentColor', opacity: 0.05 }}
                                            contentStyle={{
                                                backgroundColor: 'var(--card)',
                                                borderRadius: '8px',
                                                border: '1px solid var(--border)',
                                                boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'
                                            }}
                                        />
                                        <Bar dataKey="value" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        <div className="bg-card rounded-2xl border border-border/50 p-8 shadow-sm h-64 flex flex-col">
                            <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-6 block">
                                Performance
                            </span>
                            <div className="flex-1 h-full w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={perfData}>
                                        <Tooltip contentStyle={{ backgroundColor: 'var(--card)', borderRadius: '8px', border: '1px solid var(--border)' }} />
                                        <Line type="monotone" dataKey="score" stroke="#3B82F6" strokeWidth={3} dot={{ r: 4, strokeWidth: 2, fill: '#3B82F6' }} />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        <div className="bg-card rounded-2xl border border-border/50 p-8 shadow-sm h-64 flex flex-col items-center">
                            <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-6 block w-full text-left">
                                Headcount
                            </span>
                            <div className="flex-1 h-full w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={deptData}
                                            innerRadius={45}
                                            outerRadius={65}
                                            paddingAngle={8}
                                            dataKey="value"
                                            stroke="none"
                                        >
                                            {deptData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                            ))}
                                        </Pie>
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
