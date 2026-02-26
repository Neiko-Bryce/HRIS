import { Head, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Briefcase, Plus, Edit2, Trash2, UserPlus, ChevronDown, ChevronUp } from 'lucide-react';
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

interface Applicant { id: number; name: string; email: string; phone: string | null; status: string; notes: string | null; }
interface JobPosting {
    id: number; title: string; department_id: number | null; description: string; requirements: string | null;
    type: string; slots: number; status: string; closing_date: string | null;
    department?: { id: number; name: string } | null; applicants: Applicant[];
}
interface Dept { id: number; name: string; }

const statusStyles: Record<string, string> = {
    open: 'bg-green-100 text-green-800 border-green-200', closed: 'bg-red-100 text-red-800 border-red-200', 'on-hold': 'bg-amber-100 text-amber-800 border-amber-200',
    applied: 'bg-blue-100 text-blue-800 border-blue-200', interviewed: 'bg-purple-100 text-purple-800 border-purple-200', hired: 'bg-green-100 text-green-800 border-green-200', rejected: 'bg-red-100 text-red-800 border-red-200',
};

export default function RecruitmentIndex({ jobPostings, departments }: { jobPostings: JobPosting[]; departments: Dept[] }) {
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isApplicantOpen, setIsApplicantOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [current, setCurrent] = useState<JobPosting | null>(null);
    const [expanded, setExpanded] = useState<number | null>(null);

    const form = useForm({ title: '', department_id: '', description: '', requirements: '', type: 'external', slots: '1', status: 'open', closing_date: '' });
    const appForm = useForm({ job_posting_id: '', name: '', email: '', phone: '', notes: '' });
    const statusForm = useForm({ applicant_id: '', applicant_status: '', notes: '' });

    const openCreate = () => { form.reset(); form.clearErrors(); setIsCreateOpen(true); };
    const openEdit = (jp: JobPosting) => {
        setCurrent(jp);
        form.setData({ title: jp.title, department_id: jp.department_id?.toString() || '', description: jp.description, requirements: jp.requirements || '', type: jp.type, slots: jp.slots.toString(), status: jp.status, closing_date: jp.closing_date?.substring(0, 10) || '' });
        setIsEditOpen(true);
    };
    const openAddApplicant = (jp: JobPosting) => {
        setCurrent(jp);
        appForm.setData({ job_posting_id: jp.id.toString(), name: '', email: '', phone: '', notes: '' });
        setIsApplicantOpen(true);
    };

    const submitCreate = (e: React.FormEvent) => { e.preventDefault(); form.post(route('admin.recruitment.store'), { onSuccess: () => { setIsCreateOpen(false); form.reset(); } }); };
    const submitEdit = (e: React.FormEvent) => { e.preventDefault(); if (!current) return; form.put(route('admin.recruitment.update', current.id), { onSuccess: () => setIsEditOpen(false) }); };
    const submitApplicant = (e: React.FormEvent) => { e.preventDefault(); appForm.post(route('admin.recruitment.applicants.store'), { onSuccess: () => { setIsApplicantOpen(false); appForm.reset(); } }); };
    const handleDelete = () => {
        if (!current) return;
        form.delete(route('admin.recruitment.destroy', current.id), {
            onSuccess: () => {
                setIsDeleteOpen(false);
            }
        });
    };

    const updateApplicantStatus = (applicantId: number, jpId: number, newStatus: string) => {
        statusForm.setData({ applicant_id: applicantId.toString(), applicant_status: newStatus, notes: '' });
        statusForm.put(route('admin.recruitment.update', jpId));
    };

    return (
        <AppLayout>
            <Head title="Recruitment" />
            <div className="p-4 md:p-8">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 md:mb-8">
                    <div>
                        <h1 className="text-xl md:text-2xl font-black text-foreground tracking-tight">Recruitment</h1>
                        <p className="text-muted-foreground mt-1 text-xs md:text-sm font-medium italic opacity-80">Manage job postings and track applicants.</p>
                    </div>
                    <Button onClick={openCreate} className="w-full md:w-auto bg-primary hover:bg-primary/90 font-semibold px-6 shadow-sm"><Plus className="mr-2 h-4 w-4" /> New Job Posting</Button>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6 mb-8">
                    <StatCard label="Postings" value={jobPostings.length.toString()} color="primary" icon={<Briefcase size={20} />} />
                    <StatCard label="Open" value={jobPostings.filter(j => j.status === 'open').length.toString()} color="green-500" icon={<Briefcase size={20} />} />
                    <StatCard label="Applicants" value={jobPostings.reduce((s, j) => s + j.applicants.length, 0).toString()} color="blue-500" icon={<UserPlus size={20} />} />
                </div>

                <div className="space-y-4">
                    {jobPostings.map(jp => (
                        <div key={jp.id} className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden transition-all hover:border-primary/20">
                            <div className="p-4 md:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 cursor-pointer" onClick={() => setExpanded(expanded === jp.id ? null : jp.id)}>
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20"><Briefcase size={22} /></div>
                                    <div>
                                        <p className="font-bold text-zinc-900 md:text-lg tracking-tight">{jp.title}</p>
                                        <p className="text-[10px] md:text-xs text-muted-foreground font-medium uppercase tracking-wider">
                                            {jp.department?.name || 'Unassigned'} · {jp.slots} Slots · {jp.applicants.length} Applicants
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between md:justify-end gap-2 border-t md:border-t-0 pt-3 md:pt-0">
                                    <div className="flex items-center gap-2">
                                        <span className={`text-[10px] font-black uppercase px-2.5 py-1 rounded-md border ${statusStyles[jp.status]}`}>{jp.status}</span>
                                        <div className="flex gap-1">
                                            <Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-400" onClick={e => { e.stopPropagation(); openEdit(jp); }}><Edit2 size={14} /></Button>
                                            <Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-400" onClick={e => { e.stopPropagation(); openAddApplicant(jp); }}><UserPlus size={14} /></Button>
                                            <Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-400 hover:text-red-500" onClick={e => { e.stopPropagation(); setCurrent(jp); setIsDeleteOpen(true); }}><Trash2 size={14} /></Button>
                                        </div>
                                    </div>
                                    {expanded === jp.id ? <ChevronUp size={18} className="text-zinc-400" /> : <ChevronDown size={18} className="text-zinc-400" />}
                                </div>
                            </div>
                            {expanded === jp.id && (
                                <div className="border-t border-border px-4 md:px-6 py-6 bg-muted/10 animate-in fade-in slide-in-from-top-2 duration-300">
                                    <div className="mb-6">
                                        <h4 className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-2">Description</h4>
                                        <p className="text-sm text-zinc-600 leading-relaxed font-medium">{jp.description}</p>
                                    </div>

                                    <h4 className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-3">Applicants ({jp.applicants.length})</h4>
                                    {jp.applicants.length > 0 ? (
                                        <div className="space-y-3">
                                            {/* Mobile Applicants */}
                                            <div className="grid grid-cols-1 gap-3 md:hidden">
                                                {jp.applicants.map(a => (
                                                    <div key={a.id} className="bg-background border border-border p-3 rounded-xl shadow-sm">
                                                        <div className="flex justify-between items-start mb-2">
                                                            <div>
                                                                <p className="font-bold text-zinc-900 text-sm">{a.name}</p>
                                                                <p className="text-[10px] text-zinc-500">{a.email}</p>
                                                            </div>
                                                            <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded border ${statusStyles[a.status]}`}>{a.status}</span>
                                                        </div>
                                                        <Select value={a.status} onValueChange={v => updateApplicantStatus(a.id, jp.id, v)}>
                                                            <SelectTrigger className="h-8 w-full text-[10px] font-black uppercase rounded-lg"><SelectValue /></SelectTrigger>
                                                            <SelectContent className="rounded-xl">{['applied', 'interviewed', 'hired', 'rejected'].map(s => <SelectItem key={s} value={s} className="text-xs uppercase font-bold">{s}</SelectItem>)}</SelectContent>
                                                        </Select>
                                                    </div>
                                                ))}
                                            </div>
                                            {/* Desktop Applicants */}
                                            <div className="hidden md:block overflow-hidden border border-border rounded-xl bg-background">
                                                <table className="w-full text-left text-sm">
                                                    <thead><tr className="bg-muted/30 border-b border-border">
                                                        {['Name', 'Email', 'Status', 'Actions'].map(h => <th key={h} className="px-4 py-3 text-[10px] font-black text-muted-foreground uppercase tracking-widest">{h}</th>)}
                                                    </tr></thead>
                                                    <tbody className="divide-y divide-border">
                                                        {jp.applicants.map(a => (
                                                            <tr key={a.id} className="hover:bg-primary/[0.02] transition-colors">
                                                                <td className="px-4 py-3 font-bold text-zinc-800">{a.name}</td>
                                                                <td className="px-4 py-3 text-zinc-500 text-xs font-medium">{a.email}</td>
                                                                <td className="px-4 py-3"><span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded border ${statusStyles[a.status]}`}>{a.status}</span></td>
                                                                <td className="px-4 py-3">
                                                                    <Select value={a.status} onValueChange={v => updateApplicantStatus(a.id, jp.id, v)}>
                                                                        <SelectTrigger className="h-8 w-32 text-[10px] font-black uppercase rounded-lg border-zinc-200"><SelectValue /></SelectTrigger>
                                                                        <SelectContent className="rounded-xl">{['applied', 'interviewed', 'hired', 'rejected'].map(s => <SelectItem key={s} value={s} className="text-xs uppercase font-bold">{s}</SelectItem>)}</SelectContent>
                                                                    </Select>
                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    ) : <p className="text-sm text-zinc-400 italic bg-background p-4 rounded-xl border border-dashed border-border text-center">No candidates have applied yet.</p>}
                                </div>
                            )}
                        </div>
                    ))}
                    {jobPostings.length === 0 && <div className="bg-card border-2 border-dashed border-border rounded-2xl p-16 text-center text-muted-foreground font-medium">No job postings available. Click the button above to start recruiting.</div>}
                </div>
            </div>

            {/* Create Job Posting */}
            <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                <DialogContent className="sm:max-w-[550px] bg-card border-border p-0 overflow-hidden">
                    <form onSubmit={submitCreate}>
                        <div className="p-6 pb-0">
                            <DialogHeader><DialogTitle className="text-xl font-black flex items-center gap-2"><Plus className="text-primary" size={20} /> New Job Posting</DialogTitle><DialogDescription>Define a new role for recruitment.</DialogDescription></DialogHeader>
                        </div>
                        <div className="p-6 grid gap-5 overflow-y-auto max-h-[70vh]">
                            <div className="space-y-2"><Label>Job Title</Label><Input className="rounded-xl" value={form.data.title} onChange={e => form.setData('title', e.target.value)} required placeholder="e.g. Senior Software Engineer" /></div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2"><Label>Department</Label><Select value={form.data.department_id} onValueChange={v => form.setData('department_id', v)}><SelectTrigger className="rounded-xl"><SelectValue placeholder="Select" /></SelectTrigger><SelectContent className="rounded-xl">{departments.map(d => <SelectItem key={d.id} value={d.id.toString()}>{d.name}</SelectItem>)}</SelectContent></Select></div>
                                <div className="space-y-2"><Label>Type</Label><Select value={form.data.type} onValueChange={v => form.setData('type', v)}><SelectTrigger className="rounded-xl"><SelectValue /></SelectTrigger><SelectContent className="rounded-xl"><SelectItem value="internal">Internal Only</SelectItem><SelectItem value="external">External / Shared</SelectItem></SelectContent></Select></div>
                            </div>
                            <div className="space-y-2"><Label>Description</Label><textarea className="flex min-h-[100px] w-full rounded-xl border border-input bg-background px-3 py-2 text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all" value={form.data.description} onChange={e => form.setData('description', e.target.value)} required placeholder="Roles and responsibilities..." /></div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2"><Label>Available Slots</Label><Input className="rounded-xl" type="number" min="1" value={form.data.slots} onChange={e => form.setData('slots', e.target.value)} /></div>
                                <div className="space-y-2"><Label>Closing Date</Label><Input className="rounded-xl" type="date" value={form.data.closing_date} onChange={e => form.setData('closing_date', e.target.value)} /></div>
                            </div>
                        </div>
                        <div className="p-6 bg-muted/20 border-t border-border flex justify-end gap-3">
                            <Button type="button" variant="outline" className="rounded-xl" onClick={() => setIsCreateOpen(false)}>Cancel</Button>
                            <Button type="submit" disabled={form.processing} className="rounded-xl bg-primary hover:bg-primary/90 px-8 shadow-sm">{form.processing ? 'Creating...' : 'Post Job'}</Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Edit Job Posting */}
            <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
                <DialogContent className="sm:max-w-[550px] bg-card border-border p-0 overflow-hidden">
                    <form onSubmit={submitEdit}>
                        <div className="p-6 pb-0">
                            <DialogHeader><DialogTitle className="text-xl font-black flex items-center gap-2"><Edit2 className="text-primary" size={20} /> Edit Job Posting</DialogTitle></DialogHeader>
                        </div>
                        <div className="p-6 grid gap-5 overflow-y-auto max-h-[70vh]">
                            <div className="space-y-2"><Label>Job Title</Label><Input className="rounded-xl" value={form.data.title} onChange={e => form.setData('title', e.target.value)} required /></div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2"><Label>Hiring Status</Label><Select value={form.data.status} onValueChange={v => form.setData('status', v)}><SelectTrigger className="rounded-xl"><SelectValue /></SelectTrigger><SelectContent className="rounded-xl"><SelectItem value="open">Open</SelectItem><SelectItem value="closed">Closed</SelectItem><SelectItem value="on-hold">On Hold</SelectItem></SelectContent></Select></div>
                                <div className="space-y-2"><Label>Slots</Label><Input className="rounded-xl" type="number" min="1" value={form.data.slots} onChange={e => form.setData('slots', e.target.value)} /></div>
                            </div>
                            <div className="space-y-2"><Label>Description</Label><textarea className="flex min-h-[100px] w-full rounded-xl border border-input bg-background px-3 py-2 text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all" value={form.data.description} onChange={e => form.setData('description', e.target.value)} required /></div>
                        </div>
                        <div className="p-6 bg-muted/20 border-t border-border flex justify-end gap-3">
                            <Button type="button" variant="outline" className="rounded-xl" onClick={() => setIsEditOpen(false)}>Cancel</Button>
                            <Button type="submit" disabled={form.processing} className="rounded-xl bg-primary hover:bg-primary/90 px-8 shadow-sm font-bold">{form.processing ? 'Saving...' : 'Save Changes'}</Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Add Applicant */}
            <Dialog open={isApplicantOpen} onOpenChange={setIsApplicantOpen}>
                <DialogContent className="sm:max-w-[450px] bg-card border-border p-0 overflow-hidden">
                    <form onSubmit={submitApplicant}>
                        <div className="p-6 pb-0">
                            <DialogHeader><DialogTitle className="text-xl font-black flex items-center gap-2"><UserPlus className="text-primary" size={20} /> Add Applicant</DialogTitle><DialogDescription>Filing manual application for: <span className="text-zinc-900 font-bold">{current?.title}</span></DialogDescription></DialogHeader>
                        </div>
                        <div className="p-6 grid gap-4">
                            <div className="space-y-2"><Label>Full Name</Label><Input className="rounded-xl" value={appForm.data.name} onChange={e => appForm.setData('name', e.target.value)} required placeholder="Candidate's legal name" /></div>
                            <div className="space-y-2"><Label>Email</Label><Input className="rounded-xl" type="email" value={appForm.data.email} onChange={e => appForm.setData('email', e.target.value)} required placeholder="candidate@example.com" /></div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2"><Label>Phone</Label><Input className="rounded-xl" value={appForm.data.phone} onChange={e => appForm.setData('phone', e.target.value)} placeholder="+63 XXX" /></div>
                            </div>
                            <div className="space-y-2"><Label>Internal Notes</Label><Input className="rounded-xl" value={appForm.data.notes} onChange={e => appForm.setData('notes', e.target.value)} placeholder="Initial impressions..." /></div>
                        </div>
                        <div className="p-6 bg-muted/20 border-t border-border flex justify-end gap-3">
                            <Button type="button" variant="outline" className="rounded-xl" onClick={() => setIsApplicantOpen(false)}>Cancel</Button>
                            <Button type="submit" disabled={appForm.processing} className="rounded-xl bg-primary hover:bg-primary/90 px-8 shadow-sm">{appForm.processing ? 'Adding...' : 'Add Applicant'}</Button>
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
                                Delete Job Posting
                            </DialogTitle>
                            <DialogDescription className="py-2">
                                Are you sure you want to delete <strong>{current?.title}</strong>? This will permanently remove the posting and all associated applicants.
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
                            {form.processing ? 'Deleting...' : 'DELETE POSTING'}
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
                    <p className="text-xl md:text-2xl font-black text-zinc-900 leading-none mt-1">{value}</p>
                </div>
            </div>
        </div>
    );
}
