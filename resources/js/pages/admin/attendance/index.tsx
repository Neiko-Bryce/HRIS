import { Head, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Clock, Plus, Edit2, Trash2, Search, Calendar } from 'lucide-react';
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

interface AttRecord {
    id: number;
    user_id: number;
    date: string;
    time_in: string | null;
    time_out: string | null;
    hours_worked: number;
    status: string;
    remarks: string | null;
    user: { id: number; name: string; employee?: { employee_id: string } };
}

interface UserOption { id: number; name: string; }

export default function AttendanceIndex({ attendances, users }: { attendances: AttRecord[]; users: UserOption[] }) {
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [current, setCurrent] = useState<AttRecord | null>(null);
    const [search, setSearch] = useState('');

    const form = useForm({ user_id: '', date: '', time_in: '', time_out: '', remarks: '' });

    const openCreate = () => { form.reset(); form.clearErrors(); setIsCreateOpen(true); };
    const openEdit = (r: AttRecord) => {
        setCurrent(r);
        form.setData({ user_id: r.user_id.toString(), date: r.date.substring(0, 10), time_in: r.time_in?.substring(0, 5) || '', time_out: r.time_out?.substring(0, 5) || '', remarks: r.remarks || '' });
        form.clearErrors();
        setIsEditOpen(true);
    };

    const submitCreate = (e: React.FormEvent) => {
        e.preventDefault();
        form.post(route('admin.attendance.store'), { onSuccess: () => { setIsCreateOpen(false); form.reset(); } });
    };
    const submitEdit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!current) return;
        form.put(route('admin.attendance.update', current.id), { onSuccess: () => setIsEditOpen(false) });
    };
    const handleDelete = (id: number) => { if (confirm('Delete this record?')) form.delete(route('admin.attendance.destroy', id)); };

    const statusColors: Record<string, string> = {
        present: 'text-green-600 bg-green-100 border-green-200', absent: 'text-red-600 bg-red-100 border-red-200',
        late: 'text-amber-600 bg-amber-100 border-amber-200', undertime: 'text-orange-600 bg-orange-100 border-orange-200', 'half-day': 'text-blue-600 bg-blue-100 border-blue-200',
    };

    const filtered = attendances.filter(a => a.user.name.toLowerCase().includes(search.toLowerCase()));

    return (
        <AppLayout>
            <Head title="Virtual DTR" />
            <div className="p-4 md:p-8">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 md:mb-8">
                    <div>
                        <h1 className="text-xl md:text-2xl font-black text-foreground tracking-tight">Virtual DTR</h1>
                        <p className="text-muted-foreground mt-1 text-xs md:text-sm font-medium italic opacity-80">Daily Time Records — manage attendance logs.</p>
                    </div>
                    <Button onClick={openCreate} className="w-full md:w-auto bg-primary hover:bg-primary/90 font-semibold px-6 shadow-sm"><Plus className="mr-2 h-4 w-4" /> Add Record</Button>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-6 mb-8">
                    <StatCard label="Total Logs" count={attendances.length} color="primary" icon={<Calendar size={20} />} />
                    <StatCard label="Present" count={attendances.filter(a => a.date.substring(0, 10) === new Date().toISOString().substring(0, 10) && a.status === 'present').length} color="green-500" icon={<Clock size={20} />} />
                    <StatCard label="Late" count={attendances.filter(a => a.date.substring(0, 10) === new Date().toISOString().substring(0, 10) && a.status === 'late').length} color="amber-500" icon={<Clock size={20} />} />
                </div>

                <div className="mb-6">
                    <div className="relative w-full">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                        <input type="text" placeholder="Search by employee..." value={search} onChange={e => setSearch(e.target.value)}
                            className="w-full bg-card border border-border rounded-xl pl-10 h-10 md:h-12 text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all shadow-sm" />
                    </div>
                </div>

                <div className="space-y-4">
                    {/* Mobile View */}
                    <div className="grid grid-cols-1 gap-4 md:hidden">
                        {filtered.map((a) => (
                            <div key={a.id} className="bg-card border border-border rounded-2xl p-4 shadow-sm relative">
                                <div className="absolute top-0 right-0 p-2 flex gap-1">
                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-400" onClick={() => openEdit(a)}><Edit2 size={14} /></Button>
                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-400 hover:text-red-500" onClick={() => handleDelete(a.id)}><Trash2 size={14} /></Button>
                                </div>
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-10 h-10 rounded-lg bg-zinc-100 flex items-center justify-center font-black text-zinc-900 border border-zinc-200">
                                        {a.user.name.charAt(0)}
                                    </div>
                                    <div>
                                        <p className="font-bold text-zinc-900">{a.user.name}</p>
                                        <p className="text-[10px] text-zinc-500 font-mono tracking-wider">{a.user.employee?.employee_id || 'ID N/A'}</p>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4 border-t border-zinc-100 pt-4">
                                    <div>
                                        <p className="text-[10px] font-black text-zinc-400 uppercase mb-1">Time In — Out</p>
                                        <p className="text-xs font-bold text-zinc-700">{a.time_in || '--'} — {a.time_out || '--'}</p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black text-zinc-400 uppercase mb-1">Hours / Status</p>
                                        <div className="flex items-center gap-2">
                                            <span className="text-xs font-bold text-zinc-700">{a.hours_worked}h</span>
                                            <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded border ${statusColors[a.status]}`}>{a.status}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="mt-3 text-[10px] text-zinc-400 font-bold uppercase tracking-widest text-right">
                                    {new Date(a.date).toLocaleDateString(undefined, { dateStyle: 'long' })}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Desktop View */}
                    <div className="hidden md:block bg-card border border-border rounded-xl shadow-sm overflow-hidden text-sm">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead><tr className="bg-muted/50">
                                    {['Employee', 'Date', 'Time In', 'Time Out', 'Hours', 'Status', 'Actions'].map(h => (
                                        <th key={h} className={`px-6 py-4 text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] ${h === 'Actions' ? 'text-right' : ''}`}>{h}</th>
                                    ))}
                                </tr></thead>
                                <tbody className="divide-y divide-border">
                                    {filtered.map(a => (
                                        <tr key={a.id} className="hover:bg-primary/[0.02] transition-colors">
                                            <td className="px-6 py-4">
                                                <p className="font-bold text-foreground leading-none mb-1">{a.user.name}</p>
                                                <p className="text-[11px] text-muted-foreground">{a.user.employee?.employee_id}</p>
                                            </td>
                                            <td className="px-6 py-4 text-xs font-medium">{new Date(a.date).toLocaleDateString()}</td>
                                            <td className="px-6 py-4 font-mono font-semibold">{a.time_in || '--'}</td>
                                            <td className="px-6 py-4 font-mono font-semibold">{a.time_out || '--'}</td>
                                            <td className="px-6 py-4 font-bold">{a.hours_worked}h</td>
                                            <td className="px-6 py-4"><span className={`text-[10px] font-black uppercase px-2.5 py-1 rounded-md border ${statusColors[a.status]}`}>{a.status}</span></td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex justify-end gap-1">
                                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-400 hover:text-primary" onClick={() => openEdit(a)}><Edit2 size={14} /></Button>
                                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-400 hover:text-destructive" onClick={() => handleDelete(a.id)}><Trash2 size={14} /></Button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                    {filtered.length === 0 && <div className="p-12 text-center text-muted-foreground bg-card border border-border rounded-xl">No records found.</div>}
                </div>
            </div>

            {/* Create Modal */}
            <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                <DialogContent className="sm:max-w-[450px] bg-card border-border p-0 overflow-hidden">
                    <form onSubmit={submitCreate}>
                        <div className="p-6 pb-0">
                            <DialogHeader>
                                <DialogTitle className="text-xl font-black flex items-center gap-2"><Plus className="text-primary" size={20} /> Add DTR Record</DialogTitle>
                                <DialogDescription>Record a new manual attendance entry.</DialogDescription>
                            </DialogHeader>
                        </div>
                        <div className="grid gap-4 p-6">
                            <div className="space-y-2"><Label>Employee</Label>
                                <Select value={form.data.user_id} onValueChange={v => form.setData('user_id', v)}>
                                    <SelectTrigger className="rounded-xl"><SelectValue placeholder="Select employee" /></SelectTrigger>
                                    <SelectContent className="rounded-xl">{users.map(u => <SelectItem key={u.id} value={u.id.toString()}>{u.name}</SelectItem>)}</SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2"><Label>Date</Label><Input className="rounded-xl" type="date" value={form.data.date} onChange={e => form.setData('date', e.target.value)} required /></div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2"><Label>Time In</Label><Input className="rounded-xl" type="time" value={form.data.time_in} onChange={e => form.setData('time_in', e.target.value)} /></div>
                                <div className="space-y-2"><Label>Time Out</Label><Input className="rounded-xl" type="time" value={form.data.time_out} onChange={e => form.setData('time_out', e.target.value)} /></div>
                            </div>
                            <div className="bg-primary/5 p-3 rounded-xl text-[10px] font-black uppercase text-center text-primary border border-dashed border-primary/20">Status & Hours will be auto-calculated</div>
                            <div className="space-y-2"><Label>Remarks</Label><Input className="rounded-xl" placeholder="e.g. Manual entry" value={form.data.remarks} onChange={e => form.setData('remarks', e.target.value)} /></div>
                        </div>
                        <div className="p-6 bg-muted/20 border-t border-border flex justify-end gap-3">
                            <Button type="button" variant="outline" className="rounded-xl" onClick={() => setIsCreateOpen(false)}>Cancel</Button>
                            <Button type="submit" disabled={form.processing} className="rounded-xl bg-primary hover:bg-primary/90 px-8 shadow-sm">{form.processing ? 'Saving...' : 'Save Record'}</Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Edit Modal */}
            <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
                <DialogContent className="sm:max-w-[450px] bg-card border-border p-0 overflow-hidden">
                    <form onSubmit={submitEdit}>
                        <div className="p-6 pb-0">
                            <DialogHeader>
                                <DialogTitle className="text-xl font-black flex items-center gap-2"><Edit2 className="text-primary" size={20} /> Edit Record</DialogTitle>
                            </DialogHeader>
                        </div>
                        <div className="grid gap-4 p-6">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2"><Label>Time In</Label><Input className="rounded-xl" type="time" value={form.data.time_in} onChange={e => form.setData('time_in', e.target.value)} /></div>
                                <div className="space-y-2"><Label>Time Out</Label><Input className="rounded-xl" type="time" value={form.data.time_out} onChange={e => form.setData('time_out', e.target.value)} /></div>
                            </div>
                            <div className="bg-primary/5 p-3 rounded-xl text-[10px] font-black uppercase text-center text-primary border border-dashed border-primary/20">Status & Hours will be auto-calculated</div>
                            <div className="space-y-2"><Label>Remarks</Label><Input className="rounded-xl" value={form.data.remarks} onChange={e => form.setData('remarks', e.target.value)} /></div>
                        </div>
                        <div className="p-6 bg-muted/20 border-t border-border flex justify-end gap-3">
                            <Button type="button" variant="outline" className="rounded-xl" onClick={() => setIsEditOpen(false)}>Cancel</Button>
                            <Button type="submit" disabled={form.processing} className="rounded-xl bg-primary hover:bg-primary/90 px-8 shadow-sm">{form.processing ? 'Saving...' : 'Save Changes'}</Button>
                        </div>
                    </form>
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
