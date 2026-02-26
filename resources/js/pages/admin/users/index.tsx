import { Head, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import {
    Users,
    UserPlus,
    Search,
    ShieldCheck,
    Briefcase,
    Trash2,
    Edit2
} from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import React, { useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

interface User {
    id: number;
    name: string;
    email: string;
    roles: Array<{ name: string }>;
    employee?: {
        employee_id: string;
        department: string;
        department_id: number;
        position: string;
        status: string;
        photo_path?: string | null;
        department_relation?: { name: string };
    };
}

interface Dept { id: number; name: string; }

export default function UserIndex({ users, departments }: { users: User[]; departments: Dept[] }) {
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [search, setSearch] = useState('');

    const { data, setData, post, put, delete: destroy, processing, errors, reset, clearErrors } = useForm({
        name: '',
        email: '',
        password: '',
        role: '',
        department_id: '',
        position: '',
        status: 'active',
    });

    const openCreate = () => {
        reset();
        clearErrors();
        setIsCreateOpen(true);
    };

    const openEdit = (user: User) => {
        setCurrentUser(user);
        setData((prev) => ({
            ...prev,
            name: user.name,
            email: user.email,
            password: '',
            role: user.roles?.[0]?.name || 'Employee',
            department_id: user.employee?.department_id?.toString() || '',
            position: user.employee?.position || '',
            status: user.employee?.status || 'active'
        }));
        clearErrors();
        setIsEditOpen(true);
    };

    const submitCreate = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('admin.users.store'), {
            onSuccess: () => {
                setIsCreateOpen(false);
                reset();
            },
        });
    };

    const submitEdit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!currentUser) return;
        put(route('admin.users.update', currentUser.id), {
            onSuccess: () => {
                setIsEditOpen(false);
                reset();
            },
        });
    };

    const handleDelete = () => {
        if (!currentUser) return;
        destroy(route('admin.users.destroy', currentUser.id), {
            onSuccess: () => {
                setIsDeleteOpen(false);
                reset();
            }
        });
    };

    const filtered = users.filter(u =>
        u.name.toLowerCase().includes(search.toLowerCase()) ||
        u.email.toLowerCase().includes(search.toLowerCase()) ||
        u.employee?.employee_id?.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <AppLayout>
            <Head title="User Management" />

            <div className="p-4 md:p-8">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 md:mb-8">
                    <div>
                        <h1 className="text-xl md:text-2xl font-black text-foreground tracking-tight">User Management</h1>
                        <p className="text-muted-foreground mt-1 text-xs md:text-sm font-medium italic opacity-80">Manage system roles and staff accounts.</p>
                    </div>
                    <Button onClick={openCreate} className="w-full md:w-auto bg-primary hover:bg-primary/90 font-semibold px-6 shadow-sm">
                        <UserPlus className="mr-2 h-4 w-4" /> Add New Employee
                    </Button>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-6 mb-8">
                    <StatCard label="Total Users" value={users.length.toString()} icon={<Users />} color="primary" />
                </div>

                {/* Search */}
                <div className="mb-6">
                    <div className="relative w-full">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                        <input
                            type="text"
                            placeholder="Search by name, ID, or email..."
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            className="w-full bg-card border border-border rounded-xl pl-10 h-10 md:h-12 text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all shadow-sm"
                        />
                    </div>
                </div>

                <div className="space-y-4">
                    {/* Mobile View */}
                    <div className="grid grid-cols-1 gap-4 md:hidden">
                        {filtered.map((user) => (
                            <div key={user.id} className="bg-card border border-border rounded-2xl p-4 shadow-sm relative overflow-hidden group">
                                <div className="absolute top-0 right-0 p-2 flex gap-1">
                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-400" onClick={() => openEdit(user)}><Edit2 size={14} /></Button>
                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-400 hover:text-red-500" onClick={() => { setCurrentUser(user); setIsDeleteOpen(true); }}><Trash2 size={14} /></Button>
                                </div>
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-12 h-12 rounded-xl bg-zinc-100 flex items-center justify-center font-black text-zinc-900 border border-zinc-200 overflow-hidden">
                                        {user.employee?.photo_path ? (
                                            <img src={`/storage/${user.employee.photo_path}`} className="w-full h-full object-cover" alt={user.name} />
                                        ) : (
                                            user.name.charAt(0)
                                        )}
                                    </div>
                                    <div>
                                        <p className="font-bold text-zinc-900">{user.name}</p>
                                        <div className="flex items-center gap-1.5 mt-0.5">
                                            <ShieldCheck size={10} className="text-zinc-400" />
                                            <span className="text-[10px] font-black uppercase text-zinc-400 tracking-wider">
                                                {user.roles[0]?.name || 'No Role'}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4 border-t border-zinc-100 pt-4 mb-4">
                                    <div>
                                        <p className="text-[10px] font-black text-zinc-400 uppercase tracking-wider mb-1">Employee ID</p>
                                        <p className="text-xs font-bold text-zinc-700 font-mono">{user.employee?.employee_id || 'PENDING'}</p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black text-zinc-400 uppercase tracking-wider mb-1">Status</p>
                                        <div className="flex items-center gap-1.5">
                                            <div className={`w-1.5 h-1.5 rounded-full ${user.employee?.status === 'active' ? 'bg-green-500' : 'bg-red-500'}`} />
                                            <span className={`text-[10px] font-black uppercase tracking-widest ${user.employee?.status === 'active' ? 'text-green-600' : 'text-red-600'}`}>
                                                {user.employee?.status || 'Active'}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div className="text-[10px] text-zinc-500 font-medium">
                                    {user.email}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Desktop Table */}
                    <div className="hidden md:block bg-card border border-border rounded-xl shadow-sm overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-muted/50">
                                        <th className="px-6 py-4 text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">Employee Info</th>
                                        <th className="px-6 py-4 text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">Access Level</th>
                                        <th className="px-6 py-4 text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">Department</th>
                                        <th className="px-6 py-4 text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">Status</th>
                                        <th className="px-6 py-4 text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border">
                                    {filtered.map((user) => (
                                        <tr key={user.id} className="hover:bg-primary/[0.02] transition-colors group">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-lg bg-secondary/50 flex items-center justify-center font-black text-primary border border-border overflow-hidden">
                                                        {user.employee?.photo_path ? (
                                                            <img src={`/storage/${user.employee.photo_path}`} className="w-full h-full object-cover" alt={user.name} />
                                                        ) : (
                                                            user.name.charAt(0)
                                                        )}
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-foreground leading-none mb-1">{user.name}</p>
                                                        <div className="flex items-center gap-2">
                                                            <span className="text-[11px] font-mono text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
                                                                {user.employee?.employee_id || 'PENDING'}
                                                            </span>
                                                            <span className="text-[11px] text-muted-foreground/60">{user.email}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-zinc-100 border border-zinc-200 text-zinc-900">
                                                    <ShieldCheck size={12} />
                                                    <span className="text-[11px] font-black uppercase tracking-wider">{user.roles[0]?.name || 'No Role'}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    <Briefcase className="text-muted-foreground/40" size={14} />
                                                    <span className="text-sm font-medium text-foreground/80">{user.employee?.department_relation?.name || '--'}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-1.5">
                                                    <div className={`w-1.5 h-1.5 rounded-full ${user.employee?.status === 'active' ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
                                                    <span className={`text-[10px] font-black uppercase tracking-widest ${user.employee?.status === 'active' ? 'text-green-600' : 'text-red-600'}`}>
                                                        {user.employee?.status || 'Active'}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex justify-end gap-1">
                                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-400 hover:text-primary" onClick={() => openEdit(user)}><Edit2 size={14} /></Button>
                                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-400 hover:text-destructive" onClick={() => { setCurrentUser(user); setIsDeleteOpen(true); }}><Trash2 size={14} /></Button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                    {filtered.length === 0 && <div className="p-12 text-center text-muted-foreground bg-card border border-border rounded-xl">No users found.</div>}
                </div>
            </div>

            <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                <DialogContent onOpenAutoFocus={(e) => e.preventDefault()} className="sm:max-w-[500px] bg-card border-border p-0 overflow-hidden">
                    <form onSubmit={submitCreate}>
                        <div className="p-6 pb-0">
                            <DialogHeader>
                                <DialogTitle className="text-xl font-black flex items-center gap-2">
                                    <UserPlus className="text-primary" size={20} />
                                    New Employee Account
                                </DialogTitle>
                                <DialogDescription>Create a new user and assign their system role and department.</DialogDescription>
                            </DialogHeader>
                        </div>
                        <div className="p-6 grid gap-4 overflow-y-auto max-h-[70vh]">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Full Name</Label>
                                    <Input className="rounded-xl" value={data.name} onChange={e => setData('name', e.target.value)} required placeholder="John Doe" />
                                    {errors.name && <p className="text-xs text-red-500 font-medium">{errors.name}</p>}
                                </div>
                                <div className="space-y-2">
                                    <Label>Work Email</Label>
                                    <Input className="rounded-xl" type="email" value={data.email} onChange={e => setData('email', e.target.value)} required placeholder="john@company.com" />
                                    {errors.email && <p className="text-xs text-red-500 font-medium">{errors.email}</p>}
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label>Initial Password</Label>
                                <Input className="rounded-xl" type="password" value={data.password} onChange={e => setData('password', e.target.value)} required />
                                {errors.password && <p className="text-xs text-red-500 font-medium">{errors.password}</p>}
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>System Role</Label>
                                    <Select value={data.role} onValueChange={(val) => setData('role', val)}>
                                        <SelectTrigger className="rounded-xl"><SelectValue placeholder="Select role" /></SelectTrigger>
                                        <SelectContent className="rounded-xl">
                                            <SelectItem value="Super Administrator">Super Admin</SelectItem>
                                            <SelectItem value="HR Administrator">HR Admin</SelectItem>
                                            <SelectItem value="Head Employee">Head Employee</SelectItem>
                                            <SelectItem value="Employee">Employee</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label>Department</Label>
                                    <Select value={data.department_id} onValueChange={(val) => setData('department_id', val)}>
                                        <SelectTrigger className="rounded-xl"><SelectValue placeholder="Select dept" /></SelectTrigger>
                                        <SelectContent className="rounded-xl">
                                            {departments.map(d => <SelectItem key={d.id} value={d.id.toString()}>{d.name}</SelectItem>)}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label>Job Position</Label>
                                <Input className="rounded-xl" value={data.position} onChange={e => setData('position', e.target.value)} placeholder="e.g. Senior Analyst" />
                            </div>
                        </div>
                        <div className="p-6 bg-muted/20 border-t border-border flex justify-end gap-3">
                            <Button type="button" variant="outline" className="rounded-xl" onClick={() => setIsCreateOpen(false)}>Cancel</Button>
                            <Button type="submit" disabled={processing} className="rounded-xl bg-primary hover:bg-primary/90 px-8 shadow-sm">
                                {processing ? 'Creating...' : 'Create Account'}
                            </Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Edit Modal */}
            <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
                <DialogContent onOpenAutoFocus={(e) => e.preventDefault()} className="sm:max-w-[500px] bg-card border-border p-0 overflow-hidden">
                    <form onSubmit={submitEdit}>
                        <div className="p-6 pb-0">
                            <DialogHeader>
                                <DialogTitle className="text-xl font-black flex items-center gap-2">
                                    <ShieldCheck className="text-primary" size={20} />
                                    Edit System Account
                                </DialogTitle>
                                <DialogDescription>Update user credentials and administrative permissions.</DialogDescription>
                            </DialogHeader>
                        </div>
                        <div className="p-6 grid gap-6 overflow-y-auto max-h-[70vh]">
                            {/* Personal Info Section */}
                            <div className="space-y-4">
                                <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-primary/50">
                                    <div className="h-px flex-1 bg-border" />
                                    Account Identity
                                    <div className="h-px flex-1 bg-border" />
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label className="text-xs font-bold text-muted-foreground ml-1">Full Name</Label>
                                        <Input className="rounded-xl bg-muted/30 border-border focus:ring-primary/20 transition-all font-medium" value={data.name} onChange={e => setData('name', e.target.value)} required />
                                        {errors.name && <p className="text-[10px] text-red-500 font-medium">{errors.name}</p>}
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-xs font-bold text-muted-foreground ml-1">Work Email</Label>
                                        <Input className="rounded-xl bg-muted/30 border-border focus:ring-primary/20 transition-all font-medium" type="email" value={data.email} onChange={e => setData('email', e.target.value)} required />
                                        {errors.email && <p className="text-[10px] text-red-500 font-medium">{errors.email}</p>}
                                    </div>
                                </div>
                            </div>

                            {/* Security Section */}
                            <div className="space-y-4 pt-2">
                                <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-primary/50">
                                    <div className="h-px flex-1 bg-border" />
                                    Security & Auth
                                    <div className="h-px flex-1 bg-border" />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-xs font-bold text-muted-foreground ml-1 flex justify-between">
                                        <span>Update Password</span>
                                        <span className="italic opacity-60 font-normal underline">Leave blank to keep active</span>
                                    </Label>
                                    <Input className="rounded-xl bg-muted/30 border-border focus:ring-primary/20 transition-all" type="password" value={data.password} onChange={e => setData('password', e.target.value)} placeholder="••••••••" />
                                    {errors.password && <p className="text-[10px] text-red-500 font-medium">{errors.password}</p>}
                                </div>
                            </div>

                            {/* Access Control Section */}
                            <div className="space-y-4 pt-2">
                                <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-primary/50">
                                    <div className="h-px flex-1 bg-border" />
                                    System Access
                                    <div className="h-px flex-1 bg-border" />
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label className="text-xs font-bold text-muted-foreground ml-1">Access Level</Label>
                                        <Select value={data.role} onValueChange={(val) => setData('role', val)}>
                                            <SelectTrigger className="rounded-xl bg-muted/30 border-border focus:ring-primary/20 h-10 overflow-hidden">
                                                <SelectValue placeholder="Select role" />
                                            </SelectTrigger>
                                            <SelectContent className="rounded-xl">
                                                <SelectItem value="Super Administrator">Super Admin</SelectItem>
                                                <SelectItem value="HR Administrator">HR Admin</SelectItem>
                                                <SelectItem value="Head Employee">Head Employee</SelectItem>
                                                <SelectItem value="Employee">Employee</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        {errors.role && <p className="text-[10px] text-red-500 font-medium">{errors.role}</p>}
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-xs font-bold text-muted-foreground ml-1">Account Status</Label>
                                        <Select value={data.status} onValueChange={(val) => setData('status', val)}>
                                            <SelectTrigger className={`rounded-xl border-border h-10 overflow-hidden ${data.status === 'active' ? 'bg-emerald-50/50 text-emerald-600' : 'bg-red-50/50 text-red-600'}`}>
                                                <SelectValue placeholder="Select status" />
                                            </SelectTrigger>
                                            <SelectContent className="rounded-xl">
                                                <SelectItem value="active" className="text-emerald-600 font-bold italic">Active Account</SelectItem>
                                                <SelectItem value="inactive" className="text-red-600 font-bold italic">Blocked / Inactive</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        {errors.status && <p className="text-[10px] text-red-500 font-medium">{errors.status}</p>}
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label className="text-xs font-bold text-muted-foreground ml-1">Department</Label>
                                        <Select value={data.department_id} onValueChange={(val) => setData('department_id', val)}>
                                            <SelectTrigger className="rounded-xl bg-muted/30 border-border focus:ring-primary/20 h-10 overflow-hidden">
                                                <SelectValue placeholder="Select dept" />
                                            </SelectTrigger>
                                            <SelectContent className="rounded-xl">
                                                {departments.map(d => <SelectItem key={d.id} value={d.id.toString()}>{d.name}</SelectItem>)}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-xs font-bold text-muted-foreground ml-1">Job Position</Label>
                                        <Input className="rounded-xl bg-muted/30 border-border focus:ring-primary/20 transition-all font-medium" value={data.position} onChange={e => setData('position', e.target.value)} />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="p-6 bg-muted/10 border-t border-border flex justify-end gap-3">
                            <Button type="button" variant="outline" className="rounded-xl px-6 border-zinc-200" onClick={() => setIsEditOpen(false)}>Cancel</Button>
                            <Button type="submit" disabled={processing} className="rounded-xl bg-primary hover:bg-primary/90 px-10 shadow-lg shadow-primary/10 font-black tracking-widest text-xs uppercase">
                                {processing ? 'Processing...' : 'Save Updates'}
                            </Button>
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
                                Delete User Account
                            </DialogTitle>
                            <DialogDescription className="py-2">
                                Are you sure you want to delete <strong>{currentUser?.name}</strong>? This will permanently remove their access and employee records.
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
                            {processing ? 'Deleting...' : 'DELETE USER'}
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
