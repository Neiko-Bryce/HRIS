import { Head, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Users, Search, Edit2, Trash2, Briefcase } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import React, { useState } from 'react';
import {
    Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";

interface Employee {
    id: number;
    user_id: number;
    employee_id: string;
    contact_number: string | null;
    address: string | null;
    join_date: string | null;
    department: string | null;
    department_id: number | null;
    position: string | null;
    salary_grade: string | null;
    status: string;
    user: {
        id: number;
        name: string;
        email: string;
        roles: Array<{ name: string }>;
    };
    department_relation?: {
        name: string;
    } | null;
}

interface Dept {
    id: number;
    name: string;
}

export default function EmployeeIndex({ employees, departments }: { employees: Employee[]; departments: Dept[] }) {
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [current, setCurrent] = useState<Employee | null>(null);
    const [search, setSearch] = useState('');

    const { data, setData, put, delete: destroy, processing, clearErrors } = useForm({
        contact_number: '',
        address: '',
        join_date: '',
        department: '',
        department_id: '' as string | number,
        position: '',
        salary_grade: '',
        status: 'active',
    });

    const openEdit = (emp: Employee) => {
        setCurrent(emp);
        setData({
            contact_number: emp.contact_number || '',
            address: emp.address || '',
            join_date: emp.join_date ? emp.join_date.substring(0, 10) : '',
            department: emp.department || '',
            department_id: emp.department_id || '',
            position: emp.position || '',
            salary_grade: emp.salary_grade || '',
            status: emp.status || 'active',
        });
        clearErrors();
        setIsEditOpen(true);
    };

    const submitEdit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!current) return;
        put(route('admin.employees.update', current.id), {
            onSuccess: () => setIsEditOpen(false),
        });
    };

    const handleDelete = () => {
        if (!current) return;
        destroy(route('admin.employees.destroy', current.id), {
            onSuccess: () => {
                setIsDeleteOpen(false);
            }
        });
    };

    const filtered = employees.filter(emp =>
        emp.user.name.toLowerCase().includes(search.toLowerCase()) ||
        emp.employee_id.toLowerCase().includes(search.toLowerCase()) ||
        (emp.department || '').toLowerCase().includes(search.toLowerCase())
    );

    return (
        <AppLayout>
            <Head title="Employee List" />
            <div className="p-4 md:p-8">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 md:mb-8">
                    <div>
                        <h1 className="text-xl md:text-2xl font-black text-foreground tracking-tight">Employee List</h1>
                        <p className="text-muted-foreground mt-1 text-xs md:text-sm font-medium italic opacity-80">Manage records and employment details.</p>
                    </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6 mb-8">
                    <StatCard label="Total" value={employees.length} icon={<Users />} color="primary" />
                    <StatCard label="Active" value={employees.filter(e => e.status === 'active').length} icon={<Users />} color="green-500" />
                    <StatCard label="Inactive" value={employees.filter(e => e.status === 'inactive').length} icon={<Users />} color="red-500" />
                    <StatCard label="Depts" value={departments.length} icon={<Briefcase />} color="blue-500" />
                </div>

                {/* Search & Actions */}
                <div className="mb-6">
                    <div className="relative w-full">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                        <input
                            type="text"
                            placeholder="Search employees..."
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            className="w-full bg-card border border-border rounded-xl pl-10 h-10 md:h-12 text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all shadow-sm"
                        />
                    </div>
                </div>

                {/* Desktop Table / Mobile Cards */}
                <div className="space-y-4">
                    {/* Mobile View */}
                    <div className="grid grid-cols-1 gap-4 md:hidden">
                        {filtered.map((emp) => (
                            <div key={emp.id} className="bg-card border border-border rounded-2xl p-4 shadow-sm relative overflow-hidden group">
                                <div className="absolute top-0 right-0 p-2 flex gap-1">
                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-400" onClick={() => openEdit(emp)}><Edit2 size={14} /></Button>
                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-400 hover:text-red-500" onClick={() => { setCurrent(emp); setIsDeleteOpen(true); }}><Trash2 size={14} /></Button>
                                </div>
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-12 h-12 rounded-xl bg-zinc-100 flex items-center justify-center font-black text-zinc-900 border border-zinc-200">
                                        {emp.user.name.charAt(0)}
                                    </div>
                                    <div>
                                        <p className="font-bold text-zinc-900">{emp.user.name}</p>
                                        <p className="text-xs text-zinc-500">{emp.employee_id}</p>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4 border-t border-zinc-100 pt-4">
                                    <div>
                                        <p className="text-[10px] font-black text-zinc-400 uppercase tracking-wider mb-1">Department</p>
                                        <p className="text-sm font-semibold text-zinc-700">{emp.department_relation?.name || emp.department || '--'}</p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black text-zinc-400 uppercase tracking-wider mb-1">Position</p>
                                        <p className="text-sm font-semibold text-zinc-700">{emp.position || '--'}</p>
                                    </div>
                                </div>
                                <div className="mt-4 flex items-center justify-between">
                                    <div className="flex items-center gap-1.5">
                                        <div className={`w-1.5 h-1.5 rounded-full ${emp.status === 'active' ? 'bg-green-500' : 'bg-red-500'}`} />
                                        <span className={`text-[10px] font-black uppercase tracking-widest ${emp.status === 'active' ? 'text-green-600' : 'text-red-600'}`}>{emp.status}</span>
                                    </div>
                                    <span className="text-[10px] text-zinc-400 font-medium">{emp.user.email}</span>
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
                                        <th className="px-6 py-4 text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">Employee</th>
                                        <th className="px-6 py-4 text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">Department</th>
                                        <th className="px-6 py-4 text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">Position</th>
                                        <th className="px-6 py-4 text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">Status</th>
                                        <th className="px-6 py-4 text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border">
                                    {filtered.map((emp) => (
                                        <tr key={emp.id} className="hover:bg-primary/[0.02] transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-lg bg-secondary/50 flex items-center justify-center font-black text-primary border border-border">
                                                        {emp.user.name.charAt(0)}
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-foreground leading-none mb-1">{emp.user.name}</p>
                                                        <div className="flex items-center gap-2">
                                                            <span className="text-[11px] font-mono text-muted-foreground bg-muted px-1.5 py-0.5 rounded">{emp.employee_id}</span>
                                                            <span className="text-[11px] text-muted-foreground/60">{emp.user.email}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-sm font-medium text-foreground/80">{emp.department_relation?.name || emp.department || '--'}</td>
                                            <td className="px-6 py-4 text-sm font-medium text-foreground/80">{emp.position || '--'}</td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-1.5">
                                                    <div className={`w-1.5 h-1.5 rounded-full ${emp.status === 'active' ? 'bg-green-500 font-black' : 'bg-red-500'}`} />
                                                    <span className={`text-[10px] font-black uppercase tracking-widest ${emp.status === 'active' ? 'text-green-600' : 'text-red-600'}`}>{emp.status}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex justify-end gap-2">
                                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary hover:bg-primary/5" onClick={() => openEdit(emp)}><Edit2 size={14} /></Button>
                                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/5" onClick={() => { setCurrent(emp); setIsDeleteOpen(true); }}><Trash2 size={14} /></Button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                    {filtered.length === 0 && (
                        <div className="p-12 text-center text-muted-foreground bg-card border border-border rounded-xl">No employees found.</div>
                    )}
                </div>
            </div>

            {/* Edit Modal */}
            <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
                <DialogContent className="sm:max-w-[550px] bg-card border-border">
                    <form onSubmit={submitEdit}>
                        <DialogHeader>
                            <DialogTitle className="text-xl font-bold flex items-center gap-2"><Edit2 className="text-primary" size={20} />Edit Employee</DialogTitle>
                            <DialogDescription>Update employee details, department assignment, and status.</DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Contact Number</Label>
                                    <Input value={data.contact_number} onChange={e => setData('contact_number', e.target.value)} placeholder="+63 9XX XXX XXXX" />
                                </div>
                                <div className="space-y-2">
                                    <Label>Join Date</Label>
                                    <Input type="date" value={data.join_date} onChange={e => setData('join_date', e.target.value)} />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label>Address</Label>
                                <Input value={data.address} onChange={e => setData('address', e.target.value)} placeholder="Complete address" />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Department</Label>
                                    <Select value={data.department_id?.toString() || ''} onValueChange={(val) => {
                                        const dept = departments.find(d => d.id.toString() === val);
                                        setData({ ...data, department_id: val ? Number(val) : '', department: dept?.name || data.department });
                                    }}>
                                        <SelectTrigger><SelectValue placeholder="Select department" /></SelectTrigger>
                                        <SelectContent>
                                            {departments.map(d => <SelectItem key={d.id} value={d.id.toString()}>{d.name}</SelectItem>)}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label>Position</Label>
                                    <Input value={data.position} onChange={e => setData('position', e.target.value)} placeholder="e.g. Senior Analyst" />
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Salary Grade</Label>
                                    <Input value={data.salary_grade} onChange={e => setData('salary_grade', e.target.value)} placeholder="e.g. SG-15" />
                                </div>
                                <div className="space-y-2">
                                    <Label>Status</Label>
                                    <Select value={data.status} onValueChange={(val) => setData('status', val)}>
                                        <SelectTrigger><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="active">Active</SelectItem>
                                            <SelectItem value="inactive">Inactive</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </div>
                        <DialogFooter className="gap-2 sm:gap-0">
                            <Button type="button" variant="outline" onClick={() => setIsEditOpen(false)}>Cancel</Button>
                            <Button type="submit" disabled={processing} className="bg-primary hover:bg-primary/90">{processing ? 'Saving...' : 'Save Changes'}</Button>
                        </DialogFooter>
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
                                Delete Employee Record
                            </DialogTitle>
                            <DialogDescription className="py-2">
                                Are you sure you want to delete the record for <strong>{current?.user.name}</strong> ({current?.employee_id})? This action cannot be undone.
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
                            {processing ? 'Deleting...' : 'DELETE RECORD'}
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </AppLayout >
    );
}

function StatCard({ label, value, icon, color }: { label: string; value: number; icon: React.ReactNode; color: string }) {
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
