import React from 'react';
import { Head, Link } from '@inertiajs/react';
import { Users, ClipboardList, Clock, Briefcase, TrendingUp, Building2, ChevronRight } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';

// Types passed from Controller
interface DashProps {
    userRole: string;
    employeeData?: {
        today_attendance?: { time_in: string; time_out: string } | null;
        recent_leaves?: Array<{ id: number; start_date: string; type: string; status: string }>;
    };
    headData?: {
        team_present: number;
        team_total: number;
        team_pending_leaves?: Array<{ id: number; user: { name: string }; start_date: string; type: string }>;
    };
    adminData?: {
        stats: { total_employees: number; total_users: number; pending_leaves: number; present_today: number; active_postings: number };
        department_stats: Array<{ id: number; name: string; employees_count: number }>;
        recent_leaves: Array<{ id: number; user: { name: string }; start_date: string; type: string; status: string }>;
    };
}

export default function Dashboard({ userRole, employeeData, headData, adminData }: DashProps) {
    return (
        <AppLayout>
            <Head title="HRIS Dashboard" />
            <div className="p-4 md:p-8">

                {/* 1. Employee Dashboard */}
                {(userRole === 'Employee' || userRole === 'Head Employee') && (
                    <div className="mb-12">
                        <div className="mb-6 md:mb-8">
                            <h1 className="text-xl md:text-2xl font-black text-foreground tracking-tight">My Portal</h1>
                            <p className="text-muted-foreground mt-1 text-xs md:text-sm font-medium italic opacity-80">Welcome back! Here is your daily overview.</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Personal Attendance Status */}
                            <div className="bg-card border border-border rounded-xl shadow-sm p-6 flex flex-col justify-center items-center text-center">
                                <div className="size-16 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-4">
                                    <Clock size={32} />
                                </div>
                                <h2 className="text-xl font-black mb-1">Today's Attendance</h2>
                                {employeeData?.today_attendance ? (
                                    <div className="flex gap-4 mt-4">
                                        <div className="text-center">
                                            <p className="text-xs font-bold text-muted-foreground uppercase">In</p>
                                            <p className="text-lg font-black">{employeeData.today_attendance.time_in || '--:--'}</p>
                                        </div>
                                        <div className="text-center">
                                            <p className="text-xs font-bold text-muted-foreground uppercase">Out</p>
                                            <p className="text-lg font-black">{employeeData.today_attendance.time_out || '--:--'}</p>
                                        </div>
                                    </div>
                                ) : (
                                    <p className="text-amber-600 font-bold bg-amber-500/10 px-4 py-2 rounded-full mt-2 text-sm">Not checked in yet.</p>
                                )}
                                <Link href="/attendance/check" className="mt-6 inline-flex items-center gap-2 text-xs font-black bg-primary text-white px-6 py-2 rounded-full hover:bg-primary/90 transition-colors">
                                    Scan DTR <ChevronRight size={14} />
                                </Link>
                            </div>

                            {/* Recent Leaves */}
                            <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
                                <div className="p-4 border-b border-border bg-muted/30">
                                    <h2 className="text-sm font-bold flex items-center gap-2"><ClipboardList size={16} /> My Recent Leaves</h2>
                                </div>
                                <div className="p-4 space-y-3">
                                    {employeeData?.recent_leaves && employeeData.recent_leaves.length > 0 ? (
                                        employeeData.recent_leaves.map((leave) => (
                                            <div key={leave.id} className="flex justify-between items-center text-sm p-3 bg-muted/10 rounded-lg border border-border">
                                                <div>
                                                    <p className="font-bold">{new Date(leave.start_date).toLocaleDateString()}</p>
                                                    <p className="text-[10px] uppercase text-muted-foreground">{leave.type}</p>
                                                </div>
                                                <span className={`text-[10px] font-black uppercase px-2 py-1 rounded border ${leave.status === 'pending' || leave.status === 'head_approved' ? 'bg-amber-100 text-amber-800 border-amber-200' :
                                                    leave.status === 'approved' ? 'bg-green-100 text-green-800 border-green-200' :
                                                        'bg-red-100 text-red-800 border-red-200'
                                                    }`}>
                                                    {leave.status === 'head_approved' ? 'Pending HR' : leave.status}
                                                </span>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-sm text-muted-foreground italic text-center py-4">No recent leave requests.</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* 2. Head Employee Dashboard */}
                {userRole === 'Head Employee' && headData && (
                    <div className="mb-12 pt-8 border-t border-border">
                        <div className="mb-6 md:mb-8">
                            <h1 className="text-xl md:text-2xl font-black text-foreground tracking-tight">Team Management</h1>
                            <p className="text-muted-foreground mt-1 text-xs md:text-sm font-medium italic opacity-80">Overview of your department.</p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6 mb-8">
                            <StatCard label="Team Members Present" value={`${headData.team_present} / ${headData.team_total}`} icon={<Users />} color="blue-500" />
                            <StatCard label="Pending Team Leaves" value={headData.team_pending_leaves?.length || 0} icon={<ClipboardList />} color="amber-500" />
                        </div>
                    </div>
                )}

                {/* 3. HR / Admin Dashboard */}
                {(userRole === 'Super Administrator' || userRole === 'HR Administrator') && adminData && (
                    <div>
                        <div className="mb-6 md:mb-8">
                            <h1 className="text-xl md:text-2xl font-black text-foreground tracking-tight">Analytics Dashboard</h1>
                            <p className="text-muted-foreground mt-1 text-xs md:text-sm font-medium italic opacity-80">Overview of your organization's workforce and operational status.</p>
                        </div>

                        {/* Main Stats */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
                            <StatCard label="Total Employees" value={adminData.stats.total_employees} icon={<Users />} color="primary" />
                            <StatCard label="Present Today" value={adminData.stats.present_today} icon={<Clock />} color="green-500" />
                            <StatCard label="Pending Action (Leaves)" value={adminData.stats.pending_leaves} icon={<ClipboardList />} color="amber-500" />
                            <StatCard label="Job Openings" value={adminData.stats.active_postings} icon={<Briefcase />} color="blue-500" />
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
                                        {adminData.department_stats.map((dept) => (
                                            <div key={dept.id} className="space-y-1.5">
                                                <div className="flex justify-between text-sm">
                                                    <span className="font-medium">{dept.name}</span>
                                                    <span className="font-bold">{dept.employees_count}</span>
                                                </div>
                                                <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                                                    <div
                                                        className="h-full bg-primary transition-all duration-500"
                                                        style={{ width: `${adminData.stats.total_employees > 0 ? (dept.employees_count / adminData.stats.total_employees) * 100 : 0}%` }}
                                                    />
                                                </div>
                                            </div>
                                        ))}
                                        {adminData.department_stats.length === 0 && <p className="text-sm text-muted-foreground italic">No department data available.</p>}
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
                                        {adminData.recent_leaves.map((leave) => (
                                            <div key={leave.id} className="flex items-center justify-between gap-3 text-sm">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary text-xs shrink-0">
                                                        {leave.user.name.charAt(0)}
                                                    </div>
                                                    <div className="truncate min-w-0">
                                                        <p className="font-bold leading-none truncate">{leave.user.name}</p>
                                                        <p className="text-[10px] text-muted-foreground uppercase mt-0.5 truncate">{leave.type}</p>
                                                    </div>
                                                </div>
                                                <span className={`shrink-0 text-[10px] font-black uppercase px-2 py-0.5 rounded border ${leave.status === 'pending' || leave.status === 'head_approved' ? 'bg-amber-100 text-amber-800 border-amber-200' :
                                                    leave.status === 'approved' ? 'bg-green-100 text-green-800 border-green-200' :
                                                        'bg-red-100 text-red-800 border-red-200'
                                                    }`}>
                                                    {leave.status === 'head_approved' ? 'Pending HR' : leave.status}
                                                </span>
                                            </div>
                                        ))}
                                        {adminData.recent_leaves.length === 0 && <p className="text-sm text-muted-foreground italic">No recent requests.</p>}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}

function StatCard({ label, value, icon, color }: { label: string; value: number | string; icon: React.ReactNode; color: string }) {
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
