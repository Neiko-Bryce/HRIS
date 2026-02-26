import React from 'react';
import { Head } from '@inertiajs/react';
import { Users, ClipboardList, Clock, Briefcase, TrendingUp, Building2 } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';

interface DashStats {
    total_employees: number;
    total_users: number;
    pending_leaves: number;
    present_today: number;
    active_postings: number;
}

interface DeptStat {
    id: number;
    name: string;
    employees_count: number;
}

interface Leave {
    id: number;
    type: string;
    status: string;
    user: { name: string };
}

export default function Dashboard({ stats, department_stats, recent_leaves }: { stats: DashStats; department_stats: DeptStat[]; recent_leaves: Leave[] }) {
    return (
        <AppLayout>
            <Head title="HRIS Dashboard" />
            <div className="p-4 md:p-8">
                <div className="mb-6 md:mb-8">
                    <h1 className="text-xl md:text-2xl font-black text-foreground tracking-tight">Analytics Dashboard</h1>
                    <p className="text-muted-foreground mt-1 text-xs md:text-sm font-medium italic opacity-80">Overview of your organization's workforce and operational status.</p>
                </div>

                {/* Main Stats */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
                    <StatCard label="Total Employees" value={stats.total_employees} icon={<Users />} color="primary" />
                    <StatCard label="Present Today" value={stats.present_today} icon={<Clock />} color="green-500" />
                    <StatCard label="Pending Leaves" value={stats.pending_leaves} icon={<ClipboardList />} color="amber-500" />
                    <StatCard label="Job Openings" value={stats.active_postings} icon={<Briefcase />} color="blue-500" />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Department Distribution */}
                    <div className="lg:col-span-2 bg-card border border-border rounded-xl shadow-sm overflow-hidden">
                        <div className="p-6 border-b border-border flex items-center justify-between">
                            <h2 className="text-sm font-bold flex items-center gap-2"><Building2 size={16} /> Department Distribution</h2>
                            <TrendingUp size={16} className="text-muted-foreground" />
                        </div>
                        <div className="p-6">
                            <div className="space-y-4">
                                {department_stats.map(dept => (
                                    <div key={dept.id} className="space-y-1.5">
                                        <div className="flex justify-between text-sm">
                                            <span className="font-medium">{dept.name}</span>
                                            <span className="font-bold">{dept.employees_count}</span>
                                        </div>
                                        <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-primary transition-all duration-500"
                                                style={{ width: `${stats.total_employees > 0 ? (dept.employees_count / stats.total_employees) * 100 : 0}%` }}
                                            />
                                        </div>
                                    </div>
                                ))}
                                {department_stats.length === 0 && <p className="text-sm text-muted-foreground italic">No department data available.</p>}
                            </div>
                        </div>
                    </div>

                    {/* Recent Activities */}
                    <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
                        <div className="p-6 border-b border-border">
                            <h2 className="text-sm font-bold flex items-center gap-2"><ClipboardList size={16} /> Recent Leave Requests</h2>
                        </div>
                        <div className="p-6">
                            <div className="space-y-4">
                                {recent_leaves.map(leave => (
                                    <div key={leave.id} className="flex items-center justify-between gap-3 text-sm">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary text-xs">
                                                {leave.user.name.charAt(0)}
                                            </div>
                                            <div>
                                                <p className="font-bold leading-none">{leave.user.name}</p>
                                                <p className="text-[10px] text-muted-foreground uppercase mt-0.5">{leave.type}</p>
                                            </div>
                                        </div>
                                        <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded border ${leave.status === 'pending' ? 'bg-amber-100 text-amber-800 border-amber-200' :
                                            leave.status === 'approved' ? 'bg-green-100 text-green-800 border-green-200' :
                                                'bg-red-100 text-red-800 border-red-200'
                                            }`}>
                                            {leave.status}
                                        </span>
                                    </div>
                                ))}
                                {recent_leaves.length === 0 && <p className="text-sm text-muted-foreground italic">No recent requests.</p>}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}

function StatCard({ label, value, icon, color }: { label: string; value: number; icon: React.ReactNode; color: string }) {
    return (
        <div className={`bg-card border border-border rounded-xl p-4 md:p-6 shadow-sm border-l-4 border-l-${color}`}>
            <div className="flex items-center gap-3 md:gap-4">
                <div className={`p-2.5 md:p-3 bg-${color}/10 text-${color} rounded-lg`}>
                    {React.cloneElement(icon as React.ReactElement<{ size?: number }>, { size: 20 })}
                </div>
                <div>
                    <p className="text-[10px] md:text-xs font-bold text-muted-foreground uppercase tracking-wider">{label}</p>
                    <p className="text-2xl md:text-3xl font-black text-foreground">{value}</p>
                </div>
            </div>
        </div>
    );
}
