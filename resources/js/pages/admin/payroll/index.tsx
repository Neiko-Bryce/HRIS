import { Head, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { CreditCard, Plus, Edit2, Trash2, Search } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import React, { useState } from 'react';
import {
    Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Switch } from '@/components/ui/switch';

interface PayslipRecord {
    id: number; user_id: number; period_start: string; period_end: string;
    basic_pay: number; allowances: number; overtime_pay: number;
    sss: number; philhealth: number; pagibig: number; tax: number; other_deductions: number;
    net_pay: number; remarks: string | null;
    user: { id: number; name: string; employee?: { employee_id: string } };
}
interface UserOption { id: number; name: string; }

const fmt = (n: number) => '₱' + Number(n).toLocaleString('en-PH', { minimumFractionDigits: 2 });

export default function PayrollIndex({ payslips, users }: { payslips: PayslipRecord[]; users: UserOption[] }) {
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [current, setCurrent] = useState<PayslipRecord | null>(null);
    const [search, setSearch] = useState('');

    const defaults = {
        user_id: '', period_start: '', period_end: '', basic_pay: '',
        allowances: '0', overtime_pay: '0', sss: '0', philhealth: '0',
        pagibig: '0', tax: '0', other_deductions: '0', remarks: '',
        auto_calc: false
    };
    const form = useForm(defaults);

    const openCreate = () => { form.setData(defaults); form.clearErrors(); setIsCreateOpen(true); };
    const openEdit = (p: PayslipRecord) => {
        setCurrent(p);
        form.setData({
            user_id: p.user_id.toString(),
            period_start: p.period_start.substring(0, 10),
            period_end: p.period_end.substring(0, 10),
            basic_pay: p.basic_pay.toString(),
            allowances: p.allowances.toString(),
            overtime_pay: p.overtime_pay.toString(),
            sss: p.sss.toString(),
            philhealth: p.philhealth.toString(),
            pagibig: p.pagibig.toString(),
            tax: p.tax.toString(),
            other_deductions: p.other_deductions.toString(),
            remarks: p.remarks || '',
            auto_calc: false
        });
        form.clearErrors(); setIsEditOpen(true);
    };

    const submitCreate = (e: React.FormEvent) => { e.preventDefault(); form.post(route('admin.payroll.store'), { onSuccess: () => { setIsCreateOpen(false); form.reset(); } }); };
    const submitEdit = (e: React.FormEvent) => { e.preventDefault(); if (!current) return; form.put(route('admin.payroll.update', current.id), { onSuccess: () => setIsEditOpen(false) }); };
    const handleDelete = () => {
        if (!current) return;
        form.delete(route('admin.payroll.destroy', current.id), {
            onSuccess: () => {
                setIsDeleteOpen(false);
            }
        });
    };

    const totalNet = payslips.reduce((s, p) => s + Number(p.net_pay), 0);
    const filtered = payslips.filter(p => p.user.name.toLowerCase().includes(search.toLowerCase()));

    const formFields = (
        <div className="grid gap-4 py-4">
            {!isEditOpen && (
                <div className="space-y-2">
                    <Label>Employee</Label>
                    <Select value={form.data.user_id} onValueChange={v => form.setData('user_id', v)}>
                        <SelectTrigger className="rounded-xl"><SelectValue placeholder="Select" /></SelectTrigger>
                        <SelectContent className="rounded-xl">{users.map(u => <SelectItem key={u.id} value={u.id.toString()}>{u.name}</SelectItem>)}</SelectContent>
                    </Select>
                </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2"><Label>Period Start</Label><Input className="rounded-xl" type="date" value={form.data.period_start} onChange={e => form.setData('period_start', e.target.value)} required /></div>
                <div className="space-y-2"><Label>Period End</Label><Input className="rounded-xl" type="date" value={form.data.period_end} onChange={e => form.setData('period_end', e.target.value)} required /></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2"><Label>Basic Pay</Label><Input className="rounded-xl" type="number" step="0.01" value={form.data.basic_pay} onChange={e => form.setData('basic_pay', e.target.value)} required /></div>
                <div className="space-y-2"><Label>Allowances</Label><Input className="rounded-xl" type="number" step="0.01" value={form.data.allowances} onChange={e => form.setData('allowances', e.target.value)} /></div>
                <div className="space-y-2"><Label>Overtime</Label><Input className="rounded-xl" type="number" step="0.01" value={form.data.overtime_pay} onChange={e => form.setData('overtime_pay', e.target.value)} /></div>
            </div>
            <div className="flex items-center justify-between mt-2">
                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">Government Contributions</p>
                <div className="flex items-center gap-2">
                    <Label htmlFor="auto_calc" className="text-xs font-bold">Auto-calc</Label>
                    <Switch id="auto_calc" checked={form.data.auto_calc} onCheckedChange={v => form.setData('auto_calc', v)} />
                </div>
            </div>
            <div className={`grid grid-cols-2 lg:grid-cols-4 gap-3 transition-opacity ${form.data.auto_calc ? 'opacity-40 cursor-not-allowed pointer-events-none' : ''}`}>
                <div className="space-y-1"><Label className="text-[10px] font-black uppercase text-muted-foreground">SSS</Label><Input className="h-9 rounded-lg" type="number" step="0.01" value={form.data.sss} onChange={e => form.setData('sss', e.target.value)} disabled={form.data.auto_calc} /></div>
                <div className="space-y-1"><Label className="text-[10px] font-black uppercase text-muted-foreground">PhilHealth</Label><Input className="h-9 rounded-lg" type="number" step="0.01" value={form.data.philhealth} onChange={e => form.setData('philhealth', e.target.value)} disabled={form.data.auto_calc} /></div>
                <div className="space-y-1"><Label className="text-[10px] font-black uppercase text-muted-foreground">Pag-IBIG</Label><Input className="h-9 rounded-lg" type="number" step="0.01" value={form.data.pagibig} onChange={e => form.setData('pagibig', e.target.value)} disabled={form.data.auto_calc} /></div>
                <div className="space-y-1"><Label className="text-[10px] font-black uppercase text-muted-foreground">Tax</Label><Input className="h-9 rounded-lg" type="number" step="0.01" value={form.data.tax} onChange={e => form.setData('tax', e.target.value)} disabled={form.data.auto_calc} /></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2"><Label>Other Deductions</Label><Input className="rounded-xl" type="number" step="0.01" value={form.data.other_deductions} onChange={e => form.setData('other_deductions', e.target.value)} /></div>
                <div className="space-y-2"><Label>Remarks</Label><Input className="rounded-xl" value={form.data.remarks} onChange={e => form.setData('remarks', e.target.value)} /></div>
            </div>
        </div>
    );

    return (
        <AppLayout>
            <Head title="Payroll" />
            <div className="p-4 md:p-8">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 md:mb-8">
                    <div>
                        <h1 className="text-xl md:text-2xl font-black text-foreground tracking-tight">Payroll Management</h1>
                        <p className="text-muted-foreground mt-1 text-xs md:text-sm font-medium italic opacity-80">Manage payslips and government contributions.</p>
                    </div>
                    <Button onClick={openCreate} className="w-full md:w-auto bg-primary hover:bg-primary/90 font-semibold px-6 shadow-sm"><Plus className="mr-2 h-4 w-4" /> Create Payslip</Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-8">
                    <StatCard label="Total Payslips" value={payslips.length.toString()} icon={<CreditCard size={20} />} color="primary" />
                    <StatCard label="Total Net Pay" value={fmt(totalNet)} icon={<CreditCard size={20} />} color="green-500" />
                </div>

                <div className="mb-6">
                    <div className="relative w-full">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                        <input type="text" placeholder="Search by name..." value={search} onChange={e => setSearch(e.target.value)}
                            className="w-full bg-card border border-border rounded-xl pl-10 h-10 md:h-12 text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all shadow-sm" />
                    </div>
                </div>

                <div className="space-y-4">
                    {/* Mobile View */}
                    <div className="grid grid-cols-1 gap-4 md:hidden">
                        {filtered.map((p) => {
                            const ded = Number(p.sss) + Number(p.philhealth) + Number(p.pagibig) + Number(p.tax) + Number(p.other_deductions);
                            return (
                                <div key={p.id} className="bg-card border border-border rounded-2xl p-4 shadow-sm relative overflow-hidden">
                                    <div className="absolute top-0 right-0 p-2 flex gap-1">
                                        <Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-400" onClick={() => openEdit(p)}><Edit2 size={14} /></Button>
                                        <Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-400 hover:text-red-500" onClick={() => { setCurrent(p); setIsDeleteOpen(true); }}><Trash2 size={14} /></Button>
                                    </div>
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="w-10 h-10 rounded-lg bg-zinc-100 flex items-center justify-center font-black text-zinc-900 border border-zinc-200">
                                            {p.user.name.charAt(0)}
                                        </div>
                                        <div>
                                            <p className="font-bold text-zinc-900">{p.user.name}</p>
                                            <p className="text-[10px] text-zinc-500 font-mono tracking-widest">{p.user.employee?.employee_id || 'ID N/A'}</p>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4 border-t border-zinc-100 pt-4 mb-3">
                                        <div>
                                            <p className="text-[10px] font-black text-zinc-400 uppercase mb-1">Period</p>
                                            <p className="text-[10px] font-bold text-zinc-700">{new Date(p.period_start).toLocaleDateString()} — {new Date(p.period_end).toLocaleDateString()}</p>
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black text-zinc-400 uppercase mb-1">Basic Pay</p>
                                            <p className="text-xs font-bold text-zinc-700">{fmt(p.basic_pay)}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between bg-zinc-50 p-3 rounded-xl border border-zinc-100">
                                        <div>
                                            <p className="text-[9px] font-black text-zinc-400 uppercase">Deductions</p>
                                            <p className="text-xs font-bold text-red-600">{fmt(ded)}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-[9px] font-black text-zinc-400 uppercase">Net Pay</p>
                                            <p className="text-sm font-black text-green-600">{fmt(p.net_pay)}</p>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Desktop View */}
                    <div className="hidden md:block bg-card border border-border rounded-xl shadow-sm overflow-hidden text-sm">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead><tr className="bg-muted/50">
                                    {['Employee', 'Period', 'Basic Pay', 'Deductions', 'Net Pay', 'Actions'].map(h => (
                                        <th key={h} className={`px-6 py-4 text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] ${h === 'Actions' ? 'text-right' : ''}`}>{h}</th>
                                    ))}
                                </tr></thead>
                                <tbody className="divide-y divide-border">
                                    {filtered.map(p => {
                                        const ded = Number(p.sss) + Number(p.philhealth) + Number(p.pagibig) + Number(p.tax) + Number(p.other_deductions);
                                        return (
                                            <tr key={p.id} className="hover:bg-primary/[0.02] transition-colors">
                                                <td className="px-6 py-4"><p className="font-bold">{p.user.name}</p><p className="text-[11px] text-muted-foreground">{p.user.employee?.employee_id}</p></td>
                                                <td className="px-6 py-4 text-xs">{new Date(p.period_start).toLocaleDateString()} — {new Date(p.period_end).toLocaleDateString()}</td>
                                                <td className="px-6 py-4 font-mono text-xs">{fmt(p.basic_pay)}</td>
                                                <td className="px-6 py-4 font-mono text-xs text-red-600">{fmt(ded)}</td>
                                                <td className="px-6 py-4 font-black text-green-600">{fmt(p.net_pay)}</td>
                                                <td className="px-6 py-4 text-right">
                                                    <div className="flex justify-end gap-1">
                                                        <Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-400 hover:text-primary" onClick={() => openEdit(p)}><Edit2 size={14} /></Button>
                                                        <Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-400 hover:text-destructive" onClick={() => { setCurrent(p); setIsDeleteOpen(true); }}><Trash2 size={14} /></Button>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                    {filtered.length === 0 && <div className="p-12 text-center text-muted-foreground bg-card border border-border rounded-xl">No payslips found.</div>}
                </div>
            </div>

            <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                <DialogContent className="sm:max-w-[600px] bg-card border-border p-0 overflow-hidden">
                    <form onSubmit={submitCreate}>
                        <div className="p-6 pb-0">
                            <DialogHeader><DialogTitle className="text-xl font-black flex items-center gap-2"><Plus className="text-primary" size={20} /> Create Payslip</DialogTitle><DialogDescription>Net pay auto-calculates based on earnings and deductions.</DialogDescription></DialogHeader>
                        </div>
                        <div className="p-6 max-h-[70vh] overflow-y-auto">
                            {formFields}
                        </div>
                        <div className="p-6 bg-muted/20 border-t border-border flex justify-end gap-3">
                            <Button type="button" variant="outline" className="rounded-xl" onClick={() => setIsCreateOpen(false)}>Cancel</Button>
                            <Button type="submit" disabled={form.processing} className="rounded-xl bg-primary hover:bg-primary/90 px-8 shadow-sm">{form.processing ? 'Creating...' : 'Create'}</Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>

            <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
                <DialogContent className="sm:max-w-[600px] bg-card border-border p-0 overflow-hidden">
                    <form onSubmit={submitEdit}>
                        <div className="p-6 pb-0">
                            <DialogHeader><DialogTitle className="text-xl font-black flex items-center gap-2"><Edit2 className="text-primary" size={20} /> Edit Payslip</DialogTitle></DialogHeader>
                        </div>
                        <div className="p-6 max-h-[70vh] overflow-y-auto">
                            {formFields}
                        </div>
                        <div className="p-6 bg-muted/20 border-t border-border flex justify-end gap-3">
                            <Button type="button" variant="outline" className="rounded-xl" onClick={() => setIsEditOpen(false)}>Cancel</Button>
                            <Button type="submit" disabled={form.processing} className="rounded-xl bg-primary hover:bg-primary/90 px-8 shadow-sm">{form.processing ? 'Saving...' : 'Save Changes'}</Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Delete Modal */}
            <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
                <DialogContent className="sm:max-w-[400px] bg-card border-border p-0 overflow-hidden">
                    <div className="p-6">
                        <DialogHeader>
                            <DialogTitle className="text-xl font-black flex items-center gap-2">
                                <Trash2 className="text-destructive" size={20} />
                                Delete Payslip
                            </DialogTitle>
                            <DialogDescription className="py-2">
                                Are you sure you want to delete the payslip for <strong>{current?.user.name}</strong> for the period {current && new Date(current.period_start).toLocaleDateString()}?
                            </DialogDescription>
                        </DialogHeader>
                    </div>
                    <div className="p-6 bg-muted/20 border-t border-border flex justify-end gap-3">
                        <Button type="button" variant="outline" className="rounded-xl px-6" onClick={() => setIsDeleteOpen(false)}>Cancel</Button>
                        <Button
                            type="button"
                            disabled={form.processing}
                            onClick={handleDelete}
                            className="rounded-xl px-8 shadow-sm font-black tracking-wider bg-destructive hover:bg-destructive/90"
                        >
                            {form.processing ? 'Deleting...' : 'DELETE PAYSLIP'}
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </AppLayout >
    );
}

function StatCard({ label, value, icon, color }: { label: string; value: string; icon: React.ReactNode; color: string }) {
    return (
        <div className={`bg-card border border-border rounded-xl p-4 md:p-6 shadow-sm border-l-4 border-l-${color}`}>
            <div className="flex items-center gap-3 md:gap-4">
                <div className={`p-2.5 md:p-3 bg-${color}/10 text-${color} rounded-lg`}>
                    {React.cloneElement(icon as React.ReactElement<{ size?: number }>, { size: 18 })}
                </div>
                <div>
                    <p className="text-[10px] font-black text-muted-foreground uppercase tracking-wider">{label}</p>
                    <p className="text-xl md:text-2xl font-black text-foreground leading-none mt-1">{value}</p>
                </div>
            </div>
        </div>
    );
}
