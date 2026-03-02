import React from 'react';
import { Head } from '@inertiajs/react';
import { BadgeCheck, Calendar, Clock, FileText, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';

function StatCard({ label, value, icon, color }: { label: string; value: string | number; icon: React.ReactNode; color: string }) {
    return (
        <div className={`bg-card border border-border rounded-xl p-6 shadow-sm border-l-4 border-l-${color}`}>
            <div className="flex items-center gap-4">
                <div className={`p-3 bg-${color}/10 text-${color} rounded-lg`}>
                    {React.cloneElement(icon as React.ReactElement<{ size?: number }>, { size: 24 })}
                </div>
                <div>
                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">{label}</p>
                    <p className="text-2xl font-black text-foreground mt-1 leading-none">{value}</p>
                </div>
            </div>
        </div>
    );
}

interface LeaveRequest {
    id: number;
    type: string;
    start_date: string;
    end_date: string;
    total_days: number;
    reason: string;
    status: string;
}

export default function MyLeaves({ leaves }: { leaves: LeaveRequest[] }) {
    return (
        <AppLayout>
            <Head title="My Leaves" />
            <div className="p-4 md:p-8 max-w-[1600px] mx-auto space-y-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-black text-foreground tracking-tight">My Leaves</h1>
                        <p className="text-muted-foreground text-sm font-medium mt-1">Manage your time off and track request statuses.</p>
                    </div>
                    <Button className="rounded-xl bg-primary hover:bg-primary/90 shadow-sm px-6">
                        <Plus className="mr-2 h-4 w-4" /> Request Leave
                    </Button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <StatCard label="Total Requests" value={leaves.length} icon={<FileText />} color="indigo-500" />
                    <StatCard label="Approved" value={leaves.filter(l => l.status === 'approved').length} icon={<BadgeCheck />} color="emerald-500" />
                    <StatCard label="Pending" value={leaves.filter(l => l.status === 'pending' || l.status === 'head_approved').length} icon={<Clock />} color="amber-500" />
                    <StatCard label="Total Days Used" value={leaves.filter(l => l.status === 'approved').reduce((acc, curr) => acc + curr.total_days, 0)} icon={<Calendar />} color="blue-500" />
                </div>

                <div className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden">
                    <div className="px-6 py-4 border-b border-border bg-muted/30">
                        <h2 className="font-bold text-sm">Leave History</h2>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left border-collapse">
                            <thead>
                                <tr className="bg-muted/20">
                                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Type</th>
                                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Period</th>
                                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Duration</th>
                                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Reason</th>
                                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                                {leaves.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-24 text-center text-muted-foreground">
                                            <div className="flex flex-col items-center opacity-40">
                                                <FileText className="h-12 w-12 mb-4" />
                                                <p className="font-black uppercase tracking-tighter text-xl italic">No records found</p>
                                                <p className="text-xs font-medium mt-1">You haven't filed any leave requests yet.</p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    leaves.map((l) => (
                                        <tr key={l.id} className="hover:bg-muted/30 transition-colors">
                                            <td className="px-6 py-5 font-bold">
                                                <span className="px-2 py-1 bg-muted rounded text-[10px] uppercase tracking-wider">{l.type.replace('_', ' ')}</span>
                                            </td>
                                            <td className="px-6 py-5">
                                                <div className="font-semibold text-foreground">
                                                    {new Date(l.start_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                                </div>
                                                <div className="text-[10px] text-muted-foreground uppercase font-bold mt-1">
                                                    to {new Date(l.end_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                                </div>
                                            </td>
                                            <td className="px-6 py-5">
                                                <span className="font-black text-lg">{l.total_days}</span>
                                                <span className="ml-1 text-[10px] font-bold text-muted-foreground uppercase">{l.total_days === 1 ? 'day' : 'days'}</span>
                                            </td>
                                            <td className="px-6 py-5 text-muted-foreground max-w-[250px]">
                                                <p className="truncate text-xs font-medium italic" title={l.reason}>{l.reason}</p>
                                            </td>
                                            <td className="px-6 py-5">
                                                <span className={`
                                                    text-[10px] font-black uppercase px-3 py-1 rounded-full border
                                                    ${l.status === 'approved' ? 'bg-emerald-100 text-emerald-800 border-emerald-200' :
                                                        l.status === 'denied' ? 'bg-red-100 text-red-800 border-red-200' :
                                                            l.status === 'head_approved' ? 'bg-blue-100 text-blue-800 border-blue-200' :
                                                                'bg-amber-100 text-amber-800 border-amber-200'}
                                                `}>
                                                    {l.status === 'head_approved' ? 'Head Approved' : l.status.replace('_', ' ')}
                                                </span>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
