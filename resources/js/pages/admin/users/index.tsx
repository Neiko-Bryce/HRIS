import { Head, useForm, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import {
    Users,
    UserPlus,
    Search,
    MoreHorizontal,
    ShieldCheck,
    Briefcase,
    Trash2,
    Edit2,
    CheckCircle2,
    AlertCircle
} from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import { useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
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
        position: string;
        status: string;
    };
}

export default function UserIndex({ users }: { users: User[] }) {
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [currentUser, setCurrentUser] = useState<User | null>(null);

    const { data, setData, post, put, delete: destroy, processing, errors, reset, clearErrors } = useForm({
        name: '',
        email: '',
        password: '',
        role: 'Employee',
        department: '',
        position: '',
    });

    const openCreate = () => {
        reset();
        clearErrors();
        setIsCreateOpen(true);
    };

    const openEdit = (user: User) => {
        setCurrentUser(user);
        setData({
            name: user.name,
            email: user.email,
            password: '', // Keep blank if not changing
            role: user.roles[0]?.name || 'Employee',
            department: user.employee?.department || '',
            position: user.employee?.position || '',
        });
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

    const handleDelete = (id: number) => {
        if (confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
            destroy(route('admin.users.destroy', id));
        }
    };

    return (
        <AppLayout>
            <Head title="User Management" />

            <div className="p-8">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                    <div>
                        <h1 className="text-2xl font-black text-foreground tracking-tight">User Management</h1>
                        <p className="text-muted-foreground mt-1 text-sm font-medium">Designated area for Super Administrators to manage system roles and staff accounts.</p>
                    </div>
                    <Button onClick={openCreate} className="bg-primary hover:bg-primary/90 font-semibold px-6 shadow-sm">
                        <UserPlus className="mr-2 h-4 w-4" /> Add New Employee
                    </Button>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <div className="bg-card border border-border rounded-xl p-6 shadow-sm border-l-4 border-l-primary">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-primary/10 text-primary rounded-lg">
                                <Users size={20} />
                            </div>
                            <div>
                                <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Total Users</p>
                                <p className="text-2xl font-black text-foreground">{users.length}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Table */}
                <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden border-t-0">
                    <div className="p-4 border-b border-border bg-muted/20 flex items-center justify-between">
                        <div className="relative w-full max-w-md">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                            <input
                                type="text"
                                placeholder="Search by name, ID, or department..."
                                className="w-full bg-background border-border rounded-lg pl-10 h-10 text-sm focus:ring-primary focus:border-primary transition-all"
                            />
                        </div>
                    </div>

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
                                {users.map((user) => (
                                    <tr key={user.id} className="hover:bg-primary/[0.02] transition-colors group">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-lg bg-secondary/50 flex items-center justify-center font-black text-primary border border-border">
                                                    {user.name.charAt(0)}
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
                                            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-accent/10 border border-accent/20 text-accent">
                                                <ShieldCheck size={12} />
                                                <span className="text-[11px] font-black uppercase tracking-wider">{user.roles[0]?.name || 'No Role'}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <Briefcase className="text-muted-foreground/40" size={14} />
                                                <span className="text-sm font-medium text-foreground/80">{user.employee?.department || '--'}</span>
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
                                            <div className="flex justify-end gap-2">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8 text-muted-foreground hover:text-primary hover:bg-primary/5"
                                                    onClick={() => openEdit(user)}
                                                >
                                                    <Edit2 size={14} />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/5"
                                                    onClick={() => handleDelete(user.id)}
                                                >
                                                    <Trash2 size={14} />
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Create Modal */}
            <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                <DialogContent className="sm:max-w-[500px] bg-card border-border">
                    <form onSubmit={submitCreate}>
                        <DialogHeader>
                            <DialogTitle className="text-xl font-bold flex items-center gap-2">
                                <UserPlus className="text-primary" size={20} />
                                New Employee Account
                            </DialogTitle>
                            <DialogDescription>
                                Create a new user and assign their system role and department.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="create-name">Full Name</Label>
                                    <Input id="create-name" value={data.name} onChange={e => setData('name', e.target.value)} required placeholder="John Doe" />
                                    {errors.name && <p className="text-xs text-red-500 font-medium">{errors.name}</p>}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="create-email">Work Email</Label>
                                    <Input id="create-email" type="email" value={data.email} onChange={e => setData('email', e.target.value)} required placeholder="john@company.com" />
                                    {errors.email && <p className="text-xs text-red-500 font-medium">{errors.email}</p>}
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="create-password">Initial Password</Label>
                                <Input id="create-password" type="password" value={data.password} onChange={e => setData('password', e.target.value)} required />
                                {errors.password && <p className="text-xs text-red-500 font-medium">{errors.password}</p>}
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>System Role</Label>
                                    <Select value={data.role} onValueChange={(val) => setData('role', val)}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select role" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Super Administrator">Super Admin</SelectItem>
                                            <SelectItem value="HR Administrator">HR Admin</SelectItem>
                                            <SelectItem value="Head Employee">Head Employee</SelectItem>
                                            <SelectItem value="Employee">Employee</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="create-dept">Department</Label>
                                    <Input id="create-dept" value={data.department} onChange={e => setData('department', e.target.value)} placeholder="e.g. Finance" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="create-pos">Job Position</Label>
                                <Input id="create-pos" value={data.position} onChange={e => setData('position', e.target.value)} placeholder="e.g. Senior Analyst" />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => setIsCreateOpen(false)}>Cancel</Button>
                            <Button type="submit" disabled={processing} className="bg-primary hover:bg-primary/90">
                                {processing ? 'Creating...' : 'Create Account'}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Edit Modal */}
            <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
                <DialogContent className="sm:max-w-[500px] bg-card border-border">
                    <form onSubmit={submitEdit}>
                        <DialogHeader>
                            <DialogTitle className="text-xl font-bold flex items-center gap-2">
                                <Edit2 className="text-accent" size={20} />
                                Edit Employee Profile
                            </DialogTitle>
                            <DialogDescription>
                                Update account details, roles, or department assignments.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="edit-name">Full Name</Label>
                                    <Input id="edit-name" value={data.name} onChange={e => setData('name', e.target.value)} required />
                                    {errors.name && <p className="text-xs text-red-500 font-medium">{errors.name}</p>}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="edit-email">Work Email</Label>
                                    <Input id="edit-email" type="email" value={data.email} onChange={e => setData('email', e.target.value)} required />
                                    {errors.email && <p className="text-xs text-red-500 font-medium">{errors.email}</p>}
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="edit-password text-xs text-muted-foreground italic">(Leave blank to keep current password)</Label>
                                <Input id="edit-password" type="password" value={data.password} onChange={e => setData('password', e.target.value)} placeholder="••••••••" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>System Role</Label>
                                    <Select value={data.role} onValueChange={(val) => setData('role', val)}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select role" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Super Administrator">Super Admin</SelectItem>
                                            <SelectItem value="HR Administrator">HR Admin</SelectItem>
                                            <SelectItem value="Head Employee">Head Employee</SelectItem>
                                            <SelectItem value="Employee">Employee</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="edit-dept">Department</Label>
                                    <Input id="edit-dept" value={data.department} onChange={e => setData('department', e.target.value)} />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="edit-pos">Job Position</Label>
                                <Input id="edit-pos" value={data.position} onChange={e => setData('position', e.target.value)} />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => setIsEditOpen(false)}>Cancel</Button>
                            <Button type="submit" disabled={processing} className="bg-accent hover:bg-accent/90 text-white font-bold">
                                {processing ? 'Updating...' : 'Save Changes'}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
}
