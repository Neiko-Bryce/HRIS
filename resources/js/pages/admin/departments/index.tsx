import { Head, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Building2, Plus, Edit2, Trash2, Users } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import React, { useState } from 'react';
import {
    Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface Department {
    id: number;
    name: string;
    code: string | null;
    description: string | null;
    employees_count: number;
}

export default function DepartmentIndex({ departments }: { departments: Department[] }) {
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [current, setCurrent] = useState<Department | null>(null);

    const { data, setData, post, put, delete: destroy, processing, reset, errors, clearErrors } = useForm({
        name: '',
        code: '',
        description: '',
    });

    const openCreate = () => { reset(); clearErrors(); setIsCreateOpen(true); };

    const openEdit = (dept: Department) => {
        setCurrent(dept);
        setData({ name: dept.name, code: dept.code || '', description: dept.description || '' });
        clearErrors();
        setIsEditOpen(true);
    };

    const submitCreate = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('admin.departments.store'), { onSuccess: () => { setIsCreateOpen(false); reset(); } });
    };

    const submitEdit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!current) return;
        put(route('admin.departments.update', current.id), { onSuccess: () => { setIsEditOpen(false); reset(); } });
    };

    const handleDelete = () => {
        if (!current) return;
        destroy(route('admin.departments.destroy', current.id), {
            onSuccess: () => {
                setIsDeleteOpen(false);
                reset();
            }
        });
    };

    return (
        <AppLayout>
            <Head title="Departments" />
            <div className="p-4 md:p-8">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 md:mb-8">
                    <div>
                        <h1 className="text-xl md:text-2xl font-black text-foreground tracking-tight">Department Management</h1>
                        <p className="text-muted-foreground mt-1 text-xs md:text-sm font-medium italic opacity-80">Organize your workforce by departments.</p>
                    </div>
                    <Button onClick={openCreate} className="w-full md:w-auto bg-primary hover:bg-primary/90 font-semibold px-6 shadow-sm">
                        <Plus className="mr-2 h-4 w-4" /> Add Department
                    </Button>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-8">
                    <StatCard label="Total Departments" value={departments.length.toString()} icon={<Building2 size={20} />} color="primary" />
                    <StatCard label="Total Employees" value={departments.reduce((sum, d) => sum + d.employees_count, 0).toString()} icon={<Users size={20} />} color="green-500" />
                </div>

                {/* Tables / Cards */}
                <div className="space-y-4">
                    {/* Mobile View */}
                    <div className="grid grid-cols-1 gap-4 md:hidden">
                        {departments.map((dept) => (
                            <div key={dept.id} className="bg-card border border-border rounded-2xl p-4 shadow-sm relative overflow-hidden group">
                                <div className="absolute top-0 right-0 p-2 flex gap-1">
                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-400" onClick={() => openEdit(dept)}><Edit2 size={14} /></Button>
                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-400 hover:text-red-500" onClick={() => { setCurrent(dept); setIsDeleteOpen(true); }}><Trash2 size={14} /></Button>
                                </div>
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20 shadow-sm">
                                        <Building2 size={20} />
                                    </div>
                                    <div>
                                        <p className="font-bold text-zinc-900">{dept.name}</p>
                                        <p className="text-[10px] text-zinc-500 font-black uppercase tracking-[0.1em]">{dept.code || 'NO CODE'}</p>
                                    </div>
                                </div>
                                <div className="space-y-3 border-t border-zinc-100 pt-4">
                                    <div>
                                        <p className="text-[10px] font-black text-zinc-400 uppercase tracking-wider mb-1">Description</p>
                                        <p className="text-xs font-medium text-zinc-600 line-clamp-2">{dept.description || 'No description provided.'}</p>
                                    </div>
                                    <div className="flex items-center justify-between bg-zinc-50 p-2.5 rounded-xl border border-zinc-100">
                                        <p className="text-[10px] font-black text-zinc-400 uppercase">Headcount</p>
                                        <p className="text-sm font-black text-zinc-900">{dept.employees_count}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Desktop View */}
                    <div className="hidden md:block bg-card border border-border rounded-xl shadow-sm overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-muted/50">
                                        <th className="px-6 py-4 text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">Department</th>
                                        <th className="px-6 py-4 text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">Code</th>
                                        <th className="px-6 py-4 text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">Description</th>
                                        <th className="px-6 py-4 text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">Employees</th>
                                        <th className="px-6 py-4 text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border text-sm">
                                    {departments.map(dept => (
                                        <tr key={dept.id} className="hover:bg-primary/[0.02] transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary border border-primary/20"><Building2 size={18} /></div>
                                                    <p className="font-bold text-foreground">{dept.name}</p>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4"><span className="text-xs font-mono font-bold bg-muted px-2 py-1 rounded text-muted-foreground">{dept.code || '--'}</span></td>
                                            <td className="px-6 py-4 text-sm text-foreground/70 max-w-xs truncate">{dept.description || '--'}</td>
                                            <td className="px-6 py-4"><span className="font-black text-foreground">{dept.employees_count}</span></td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex justify-end gap-1">
                                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-400 hover:text-primary" onClick={() => openEdit(dept)}><Edit2 size={14} /></Button>
                                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-400 hover:text-destructive" onClick={() => { setCurrent(dept); setIsDeleteOpen(true); }}><Trash2 size={14} /></Button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                    {departments.length === 0 && (
                                        <tr><td colSpan={5} className="px-6 py-12 text-center text-muted-foreground">No departments yet. Create one to get started.</td></tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

            {/* Create Modal */}
            <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                <DialogContent className="sm:max-w-[450px] bg-card border-border p-0 overflow-hidden">
                    <form onSubmit={submitCreate}>
                        <div className="p-6 pb-0">
                            <DialogHeader>
                                <DialogTitle className="text-xl font-black flex items-center gap-2"><Plus className="text-primary" size={20} /> New Department</DialogTitle>
                                <DialogDescription>Create a new organizational department.</DialogDescription>
                            </DialogHeader>
                        </div>
                        <div className="p-6 grid gap-4">
                            <div className="space-y-2">
                                <Label>Department Name</Label>
                                <Input className="rounded-xl" value={data.name} onChange={e => setData('name', e.target.value)} required placeholder="e.g. Human Resources" />
                                {errors.name && <p className="text-xs text-red-500 font-medium">{errors.name}</p>}
                            </div>
                            <div className="space-y-2">
                                <Label>Code (Optional)</Label>
                                <Input className="rounded-xl" value={data.code} onChange={e => setData('code', e.target.value)} placeholder="e.g. HR" maxLength={10} />
                            </div>
                            <div className="space-y-2">
                                <Label>Description (Optional)</Label>
                                <textarea className="flex min-h-[80px] w-full rounded-xl border border-input bg-background px-3 py-2 text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all" value={data.description} onChange={e => setData('description', e.target.value)} placeholder="Brief description" />
                            </div>
                        </div>
                        <div className="p-6 bg-muted/20 border-t border-border flex justify-end gap-3">
                            <Button type="button" variant="outline" className="rounded-xl" onClick={() => setIsCreateOpen(false)}>Cancel</Button>
                            <Button type="submit" disabled={processing} className="rounded-xl bg-primary hover:bg-primary/90 px-8 shadow-sm">{processing ? 'Creating...' : 'Create'}</Button>
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
                                <DialogTitle className="text-xl font-black flex items-center gap-2"><Edit2 className="text-primary" size={20} /> Edit Department</DialogTitle>
                            </DialogHeader>
                        </div>
                        <div className="p-6 grid gap-4">
                            <div className="space-y-2">
                                <Label>Department Name</Label>
                                <Input className="rounded-xl" value={data.name} onChange={e => setData('name', e.target.value)} required />
                                {errors.name && <p className="text-xs text-red-500 font-medium">{errors.name}</p>}
                            </div>
                            <div className="space-y-2">
                                <Label>Code</Label>
                                <Input className="rounded-xl" value={data.code} onChange={e => setData('code', e.target.value)} maxLength={10} />
                            </div>
                            <div className="space-y-2">
                                <Label>Description</Label>
                                <textarea className="flex min-h-[80px] w-full rounded-xl border border-input bg-background px-3 py-2 text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all" value={data.description} onChange={e => setData('description', e.target.value)} />
                            </div>
                        </div>
                        <div className="p-6 bg-muted/20 border-t border-border flex justify-end gap-3">
                            <Button type="button" variant="outline" className="rounded-xl" onClick={() => setIsEditOpen(false)}>Cancel</Button>
                            <Button type="submit" disabled={processing} className="rounded-xl bg-primary hover:bg-primary/90 px-8 shadow-sm font-bold">{processing ? 'Saving...' : 'Save Changes'}</Button>
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
                                Delete Department
                            </DialogTitle>
                            <DialogDescription className="py-2">
                                Are you sure you want to delete <strong>{current?.name}</strong>? This action cannot be undone and is only possible if there are no associated employees.
                            </DialogDescription>
                        </DialogHeader>
                    </div>
                    <div className="p-6 bg-muted/20 border-t border-border flex justify-end gap-3">
                        <Button type="button" variant="outline" className="rounded-xl px-6" onClick={() => setIsDeleteOpen(false)}>Cancel</Button>
                        <Button
                            type="button"
                            disabled={processing}
                            onClick={handleDelete}
                            className="rounded-xl px-8 shadow-sm font-black tracking-wider bg-destructive hover:bg-destructive/90"
                        >
                            {processing ? 'Deleting...' : 'DELETE'}
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
