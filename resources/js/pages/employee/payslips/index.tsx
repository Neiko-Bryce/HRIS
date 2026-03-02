import React from 'react';
import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { BadgeCheck, CreditCard, Download, FileText, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';

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

interface Payslip {
    id: number;
    period_start: string;
    period_end: string;
    net_pay: number;
    created_at: string;
}

export default function MyPayslips({ payslips }: { payslips: Payslip[] }) {
    return (
        <AppLayout>
            <Head title="My Payslips" />
            <div className="p-4 md:p-8 max-w-[1600px] mx-auto space-y-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-black text-foreground tracking-tight">My Payslips</h1>
                        <p className="text-muted-foreground text-sm font-medium mt-1">View and download your official payroll records.</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <StatCard label="Total Payslips" value={payslips.length} icon={<FileText />} color="indigo-500" />
                    <StatCard label="Latest Net Pay" value={payslips.length > 0 ? `₱${Number(payslips[0].net_pay).toLocaleString()}` : '₱0.00'} icon={<CreditCard />} color="emerald-500" />
                    <StatCard label="Year to Date" value={payslips.length > 0 ? `₱${payslips.reduce((acc, curr) => acc + Number(curr.net_pay), 0).toLocaleString()}` : '₱0.00'} icon={<TrendingUp />} color="blue-500" />
                    <StatCard label="Review Status" value="All Clear" icon={<BadgeCheck />} color="amber-500" />
                </div>

                <div className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden">
                    <div className="px-6 py-4 border-b border-border bg-muted/30">
                        <h2 className="font-bold text-sm">Payroll History</h2>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left border-collapse">
                            <thead>
                                <tr className="bg-muted/20">
                                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Payroll Period</th>
                                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Issue Date</th>
                                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Net Pay</th>
                                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                                {payslips.length === 0 ? (
                                    <tr>
                                        <td colSpan={4} className="px-6 py-24 text-center text-muted-foreground">
                                            <div className="flex flex-col items-center opacity-40">
                                                <CreditCard className="h-12 w-12 mb-4" />
                                                <p className="font-black uppercase tracking-tighter text-xl italic">No records found</p>
                                                <p className="text-xs font-medium mt-1">Your payslips will appear here once processed.</p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    payslips.map((p) => (
                                        <tr key={p.id} className="hover:bg-muted/30 transition-colors">
                                            <td className="px-6 py-5">
                                                <div className="font-bold text-foreground">
                                                    {new Date(p.period_start).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                                </div>
                                                <div className="text-[10px] text-muted-foreground uppercase font-bold mt-1">
                                                    to {new Date(p.period_end).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                                </div>
                                            </td>
                                            <td className="px-6 py-5 text-muted-foreground font-medium italic">
                                                {new Date(p.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                                            </td>
                                            <td className="px-6 py-5">
                                                <span className="font-black text-lg text-emerald-600 dark:text-emerald-400">
                                                    ₱{Number(p.net_pay).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                                </span>
                                            </td>
                                            <td className="px-6 py-5 text-right">
                                                <Button variant="outline" size="sm" className="h-9 rounded-xl text-[10px] font-black uppercase tracking-wider group hover:bg-primary hover:text-white transition-all shadow-xs" onClick={() => alert('PDF downloading would be triggered here in production.')}>
                                                    <Download size={14} className="mr-2 group-hover:scale-110 transition-transform" /> Download Form
                                                </Button>
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
