import { Head, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { ClipboardList, Plus, CheckCircle, XCircle, Trash2, Search } from 'lucide-react';
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

interface LeaveReq {
    id: number;
    user_id: number;
    type: string;
    start_date: string;
    end_date: string;
    total_days: number;
    reason: string;
    status: string;
    reviewed_by: number | null;
    user: { id: number; name: string; email: string; employee?: { employee_id: string } };
    reviewer?: { name: string } | null;
}

interface UserOption { id: number; name: string; email: string; }

export default function LeaveIndex({ leaves, users }: { leaves: LeaveReq[]; users: UserOption[] }) {
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [confirmType, setConfirmType] = useState<{ id: number, action: 'head' | 'hr' | 'deny', status?: string } | null>(null);
    const [current, setCurrent] = useState<LeaveReq | null>(null);

    const form = useForm({
        user_id: '',
        type: 'sick',
        start_date: '',
        end_date: '',
        reason: '',
        status: 'pending'
    });

    const openCreate = () => { form.reset(); form.clearErrors(); setIsCreateOpen(true); };

    const submitCreate = (e: React.FormEvent) => {
        e.preventDefault();
        form.post(route('admin.leaves.store'), { onSuccess: () => { setIsCreateOpen(false); form.reset(); } });
    };

    const openConfirm = (id: number, action: 'head' | 'hr' | 'deny', status?: string) => {
        setConfirmType({ id, action, status });
        setConfirmOpen(true);
    };

    const handleConfirm = () => {
        if (!confirmType) return;
        const { id, action, status } = confirmType;
        if (action === 'head') {
            form.post(route('admin.leaves.head-approve', id), { onSuccess: () => setConfirmOpen(false) });
        } else if (action === 'hr') {
            form.post(route('admin.leaves.hr-approve', id), { onSuccess: () => setConfirmOpen(false) });
        } else if (action === 'deny' && status) {
            form.setData('status', status);
            form.put(route('admin.leaves.update', id), { onSuccess: () => setConfirmOpen(false) });
        }
    };

    const handleDelete = () => {
        if (!current) return;
        form.delete(route('admin.leaves.destroy', current.id), {
            onSuccess: () => {
                setIsDeleteOpen(false);
            }
        });
    };

    const statusStyles: Record<string, string> = {
        pending: 'bg-amber-100 text-amber-800 border-amber-200',
        head_approved: 'bg-blue-100 text-blue-800 border-blue-200',
        approved: 'bg-green-100 text-green-800 border-green-200',
        denied: 'bg-red-100 text-red-800 border-red-200',
    };

    const filtered = leaves.filter(l => {
        const ms = l.user.name.toLowerCase().includes(search.toLowerCase()) || l.type.includes(search.toLowerCase());
        return ms && (statusFilter === 'all' || l.status === statusFilter);
    });

    return (
        <AppLayout>
            <Head title="Leave Management" />
            <div className="p-4 md:p-8">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 md:mb-8">
                    <div>
                        <h1 className="text-xl md:text-2xl font-black text-foreground tracking-tight">Leave Management</h1>
                        <p className="text-muted-foreground mt-1 text-xs md:text-sm font-medium italic opacity-80">Review and manage employee leave requests.</p>
                    </div>
                    <Button onClick={openCreate} className="w-full md:w-auto bg-primary hover:bg-primary/90 font-semibold px-6 shadow-sm">
                        <Plus className="mr-2 h-4 w-4" /> New Leave Request
                    </Button>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 md:gap-6 mb-8">
                    <StatCard label="Total" count={leaves.length} color="primary" icon={<ClipboardList size={20} />} />
                    <StatCard label="Pending" count={leaves.filter(l => l.status === 'pending').length} color="amber-500" icon={<ClipboardList size={20} />} />
                    <StatCard label="Head Ok" count={leaves.filter(l => l.status === 'head_approved').length} color="blue-500" icon={<CheckCircle size={20} />} />
                    <StatCard label="HR Ok" count={leaves.filter(l => l.status === 'approved').length} color="green-500" icon={<CheckCircle size={20} />} />
                    <StatCard label="Denied" count={leaves.filter(l => l.status === 'denied').length} color="red-500" icon={<XCircle size={20} />} />
                </div>

                <div className="mb-6 space-y-3">
                    <div className="flex flex-col md:flex-row gap-3">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                            <input type="text" placeholder="Search employee..." value={search} onChange={e => setSearch(e.target.value)}
                                className="w-full bg-card border border-border rounded-xl pl-10 h-10 md:h-12 text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all shadow-sm" />
                        </div>
                        <Select value={statusFilter} onValueChange={setStatusFilter}>
                            <SelectTrigger className="w-full md:w-48 h-10 md:h-12 rounded-xl bg-card border-border shadow-sm"><SelectValue /></SelectTrigger>
                            <SelectContent className="rounded-xl">
                                <SelectItem value="all">All Status</SelectItem>
                                <SelectItem value="pending">Pending</SelectItem>
                                <SelectItem value="head_approved">Head Approved</SelectItem>
                                <SelectItem value="approved">HR Approved</SelectItem>
                                <SelectItem value="denied">Denied</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <div className="space-y-4">
                    {/* Mobile View */}
                    <div className="grid grid-cols-1 gap-4 md:hidden">
                        {filtered.map((l) => (
                            <div key={l.id} className="bg-card border border-border rounded-2xl p-4 shadow-sm relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-2">
                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-400 hover:text-red-500" onClick={() => { setCurrent(l); setIsDeleteOpen(true); }}><Trash2 size={14} /></Button>
                                </div>
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-10 h-10 rounded-lg bg-zinc-100 flex items-center justify-center font-black text-zinc-900 border border-zinc-200">
                                        {l.user.name.charAt(0)}
                                    </div>
                                    <div>
                                        <p className="font-bold text-zinc-900">{l.user.name}</p>
                                        <p className="text-[10px] text-zinc-500 font-mono uppercase tracking-widest">{l.type}</p>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4 border-t border-zinc-100 pt-4 mb-4">
                                    <div>
                                        <p className="text-[10px] font-black text-zinc-400 uppercase mb-1">Duration</p>
                                        <p className="text-xs font-semibold text-zinc-700">{l.total_days} Days</p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black text-zinc-400 uppercase mb-1">Status</p>
                                        <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded border ${statusStyles[l.status]}`}>{l.status.replace('_', ' ')}</span>
                                    </div>
                                </div>
                                <div className="text-xs text-zinc-500 mb-4 bg-zinc-50 p-2 rounded-lg border border-zinc-100 italic">
                                    "{l.reason}"
                                </div>
                                <div className="flex gap-2">
                                    {l.status === 'pending' && (
                                        <>
                                            <Button size="sm" className="flex-1 bg-blue-600 hover:bg-blue-700 font-extrabold h-9 shadow-md" onClick={() => openConfirm(l.id, 'head')}>
                                                HEAD APPROVE
                                            </Button>
                                            <Button size="sm" variant="outline" className="flex-1 text-red-600 border-red-200 hover:bg-red-50 font-extrabold h-9 shadow-sm" onClick={() => openConfirm(l.id, 'deny', 'denied')}>
                                                DENY
                                            </Button>
                                        </>
                                    )}
                                    {l.status === 'head_approved' && (
                                        <>
                                            <Button size="sm" className="flex-1 bg-green-600 hover:bg-green-700 font-extrabold h-9 shadow-md" onClick={() => openConfirm(l.id, 'hr')}>
                                                HR APPROVE
                                            </Button>
                                            <Button size="sm" variant="outline" className="flex-1 text-red-600 border-red-200 hover:bg-red-50 font-extrabold h-9 shadow-sm" onClick={() => openConfirm(l.id, 'deny', 'denied')}>
                                                DENY
                                            </Button>
                                        </>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Desktop View */}
                    <div className="hidden md:block bg-card border border-border rounded-xl shadow-sm overflow-hidden text-sm">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead><tr className="bg-muted/50">
                                    {['Employee', 'Type', 'Dates', 'Days', 'Status', 'Actions'].map(h => (
                                        <th key={h} className={`px-6 py-4 text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] ${h === 'Actions' ? 'text-right' : ''}`}>{h}</th>
                                    ))}
                                </tr></thead>
                                <tbody className="divide-y divide-border">
                                    {filtered.map(l => (
                                        <tr key={l.id} className="hover:bg-primary/[0.02] transition-colors">
                                            <td className="px-6 py-4">
                                                <p className="font-bold text-foreground leading-none mb-1">{l.user.name}</p>
                                                <p className="text-[11px] text-muted-foreground">{l.user.employee?.employee_id || l.user.email}</p>
                                            </td>
                                            <td className="px-6 py-4"><span className="text-[10px] font-black uppercase bg-muted px-2 py-1 rounded tracking-wider">{l.type}</span></td>
                                            <td className="px-6 py-4 text-xs font-medium">{new Date(l.start_date).toLocaleDateString()} — {new Date(l.end_date).toLocaleDateString()}</td>
                                            <td className="px-6 py-4 font-bold">{l.total_days}</td>
                                            <td className="px-6 py-4"><span className={`text-[10px] font-black uppercase px-2.5 py-1 rounded-md border ${statusStyles[l.status]}`}>{l.status.replace('_', ' ')}</span></td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex justify-end gap-1">
                                                    {l.status === 'pending' && <>
                                                        <Button size="sm" variant="ghost" className="text-blue-600 hover:bg-blue-50 text-[10px] font-black uppercase tracking-wider h-8" onClick={() => openConfirm(l.id, 'head')}><CheckCircle size={14} className="mr-1" />Head Approve</Button>
                                                        <Button size="sm" variant="ghost" className="text-red-600 hover:bg-red-50 text-[10px] font-black uppercase tracking-wider h-8" onClick={() => openConfirm(l.id, 'deny', 'denied')}><XCircle size={14} className="mr-1" />Deny</Button>
                                                    </>}
                                                    {l.status === 'head_approved' && <>
                                                        <Button size="sm" variant="ghost" className="text-green-600 hover:bg-green-50 text-[10px] font-black uppercase tracking-wider h-8" onClick={() => openConfirm(l.id, 'hr')}><CheckCircle size={14} className="mr-1" />HR Approve</Button>
                                                        <Button size="sm" variant="ghost" className="text-red-600 hover:bg-red-50 text-[10px] font-black uppercase tracking-wider h-8" onClick={() => openConfirm(l.id, 'deny', 'denied')}><XCircle size={14} className="mr-1" />Deny</Button>
                                                    </>}
                                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive" onClick={() => { setCurrent(l); setIsDeleteOpen(true); }}><Trash2 size={14} /></Button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                    {filtered.length === 0 && <div className="p-12 text-center text-muted-foreground bg-card border border-border rounded-xl">No leave requests found.</div>}
                </div>
            </div>

            <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                <DialogContent onOpenAutoFocus={(e) => e.preventDefault()} className="sm:max-w-[500px] bg-card border-border p-0 overflow-hidden">
                    <form onSubmit={submitCreate}>
                        <div className="p-6 pb-0">
                            <DialogHeader>
                                <DialogTitle className="text-xl font-bold flex items-center gap-2"><Plus className="text-primary" size={20} /> New Leave Request</DialogTitle>
                                <DialogDescription>File a leave request on behalf of an employee.</DialogDescription>
                            </DialogHeader>
                        </div>
                        <div className="grid gap-4 p-6">
                            <div className="space-y-2">
                                <Label>Employee</Label>
                                <Select value={form.data.user_id} onValueChange={(v) => form.setData('user_id', v)}>
                                    <SelectTrigger className="rounded-xl"><SelectValue placeholder="Select employee" /></SelectTrigger>
                                    <SelectContent className="rounded-xl">{users.map(u => <SelectItem key={u.id} value={u.id.toString()}>{u.name}</SelectItem>)}</SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label>Leave Type</Label>
                                <Select value={form.data.type} onValueChange={(v) => form.setData('type', v)}>
                                    <SelectTrigger className="rounded-xl"><SelectValue /></SelectTrigger>
                                    <SelectContent className="rounded-xl">
                                        {['sick', 'vacation', 'emergency', 'maternity', 'paternity'].map(t => <SelectItem key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2"><Label>Start Date</Label><Input className="rounded-xl" type="date" value={form.data.start_date} onChange={e => form.setData('start_date', e.target.value)} required /></div>
                                <div className="space-y-2"><Label>End Date</Label><Input className="rounded-xl" type="date" value={form.data.end_date} onChange={e => form.setData('end_date', e.target.value)} required /></div>
                            </div>
                            <div className="space-y-2">
                                <Label>Reason</Label>
                                <textarea className="flex min-h-[100px] w-full rounded-xl border border-input bg-background px-3 py-2 text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all" value={form.data.reason} onChange={e => form.setData('reason', e.target.value)} required />
                            </div>
                        </div>
                        <div className="p-6 bg-muted/20 border-t border-border flex justify-end gap-3">
                            <Button type="button" variant="outline" className="rounded-xl" onClick={() => setIsCreateOpen(false)}>Cancel</Button>
                            <Button type="submit" disabled={form.processing} className="rounded-xl bg-primary hover:bg-primary/90 px-8 shadow-sm">{form.processing ? 'Submitting...' : 'Submit Request'}</Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>

            <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
                <DialogContent className="sm:max-w-[400px] bg-card border-border p-0 overflow-hidden">
                    <div className="p-6">
                        <DialogHeader>
                            <DialogTitle className="text-xl font-bold flex items-center gap-2">
                                {confirmType?.action === 'deny' ? <XCircle className="text-red-500" /> : <CheckCircle className="text-primary" />}
                                Confirm Action
                            </DialogTitle>
                            <DialogDescription className="py-2">
                                Are you sure you want to {confirmType?.action === 'deny' ? 'deny' : 'approve'} this leave request? This will be recorded as a final action.
                            </DialogDescription>
                        </DialogHeader>
                    </div>
                    <div className="p-6 bg-muted/20 border-t border-border flex justify-end gap-3">
                        <Button type="button" variant="outline" className="rounded-xl px-6" onClick={() => setConfirmOpen(false)}>Cancel</Button>
                        <Button
                            type="button"
                            disabled={form.processing}
                            onClick={handleConfirm}
                            className={`rounded-xl px-8 shadow-sm font-black tracking-wider ${confirmType?.action === 'deny' ? 'bg-red-600 hover:bg-red-700' : 'bg-primary hover:bg-primary/90'}`}
                        >
                            {form.processing ? 'Processing...' : 'CONFIRM'}
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>

            <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
                <DialogContent className="sm:max-w-[400px] bg-card border-border p-0 overflow-hidden">
                    <div className="p-6">
                        <DialogHeader>
                            <DialogTitle className="text-xl font-bold flex items-center gap-2">
                                <Trash2 className="text-red-500" size={20} />
                                Delete Leave Request
                            </DialogTitle>
                            <DialogDescription className="py-2">
                                Are you sure you want to delete the leave request for <strong>{current?.user.name}</strong>? This action cannot be undone.
                            </DialogDescription>
                        </DialogHeader>
                    </div>
                    <div className="p-6 bg-muted/20 border-t border-border flex justify-end gap-3">
                        <Button type="button" variant="outline" className="rounded-xl px-6" onClick={() => setIsDeleteOpen(false)}>Cancel</Button>
                        <Button
                            type="button"
                            disabled={form.processing}
                            onClick={handleDelete}
                            className="rounded-xl px-8 shadow-sm font-black tracking-wider bg-red-600 hover:bg-red-700"
                        >
                            {form.processing ? 'DELETING...' : 'DELETE'}
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
}

function StatCard({ label, count, icon, color }: { label: string; count: number; icon: React.ReactNode; color: string }) {
    return (
        <div className={`bg-card border border-border rounded-xl p-4 md:p-6 shadow-sm border-l-4 border-l-${color}`}>
            <div className="flex items-center gap-3 md:gap-4">
                <div className={`p-2.5 md:p-3 bg-${color}/10 text-${color} rounded-lg`}>
                    {React.cloneElement(icon as React.ReactElement<{ size?: number }>, { size: 18 })}
                </div>
                <div>
                    <p className="text-[10px] font-black text-muted-foreground uppercase tracking-wider">{label}</p>
                    <p className="text-xl md:text-2xl font-black text-foreground leading-none mt-1">{count}</p>
                </div>
            </div>
        </div>
    );
}
