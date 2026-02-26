import React from 'react';
import { Head } from '@inertiajs/react';
import { FileDown, Users, Clock, CreditCard } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';

export default function ReportsIndex() {
    return (
        <AppLayout>
            <Head title="Reports & Analytics" />
            <div className="p-4 md:p-8">
                <div className="mb-6 md:mb-8">
                    <h1 className="text-xl md:text-2xl font-black text-foreground tracking-tight">Reports & Exports</h1>
                    <p className="text-muted-foreground mt-1 text-xs md:text-sm font-medium italic opacity-80">Export system data to CSV formats for external processing.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                    <ReportCard
                        title="Employee Masterlist"
                        description="Complete list of all employees with their department and position details."
                        icon={<Users size={20} />}
                        href="/admin/reports/employees"
                    />
                    <ReportCard
                        title="Attendance History"
                        description="Daily time records, including hours worked and late/undertime status."
                        icon={<Clock size={20} />}
                        href="/admin/reports/attendance"
                    />
                    <ReportCard
                        title="Payroll Summary"
                        description="Consolidated payroll data including deductions and net pay (PDF planned)."
                        icon={<CreditCard size={20} />}
                        href="#"
                        disabled
                    />
                </div>
            </div>
        </AppLayout>
    );
}

function ReportCard({ title, description, icon, href, disabled }: { title: string; description: string; icon: React.ReactNode; href: string; disabled?: boolean }) {
    return (
        <div className="bg-card border border-border rounded-2xl p-6 shadow-sm hover:shadow-md transition-all group relative overflow-hidden">
            <div className="flex items-center gap-4 mb-4">
                <div className="p-3 bg-primary/10 text-primary rounded-xl group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
                    {icon}
                </div>
                <h3 className="font-bold text-lg tracking-tight text-zinc-900">{title}</h3>
            </div>
            <p className="text-sm text-zinc-500 mb-8 font-medium leading-relaxed">{description}</p>
            <Button className="w-full font-black uppercase text-[10px] tracking-widest h-11 rounded-xl shadow-sm" variant={disabled ? "secondary" : "default"} disabled={disabled} asChild={!disabled}>
                {disabled ? "Coming Soon" : <a href={href} className="flex items-center justify-center gap-2"><FileDown size={16} /> Download CSV</a>}
            </Button>
            {disabled && <div className="absolute inset-0 bg-zinc-50/50 backdrop-blur-[1px] pointer-events-none flex items-center justify-center">
                <span className="bg-zinc-900 text-white text-[9px] font-black uppercase px-2 py-1 rounded tracking-tighter rotate-12">In Development</span>
            </div>}
        </div>
    );
}
