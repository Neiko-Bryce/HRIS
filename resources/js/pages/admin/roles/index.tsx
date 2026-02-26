import { Head } from '@inertiajs/react';
import { KeyRound, ShieldCheck, Users } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import React from 'react';

interface RoleData {
    id: number;
    name: string;
    permissions: string[];
    users_count: number;
}

const roleStyles: Record<string, string> = {
    'Super Administrator': 'border-t-4 border-t-red-500 bg-red-50/30',
    'HR Administrator': 'border-t-4 border-t-blue-500 bg-blue-50/30',
    'Head Employee': 'border-t-4 border-t-amber-500 bg-amber-50/30',
    'Employee': 'border-t-4 border-t-green-500 bg-green-50/30',
};

const roleIcons: Record<string, string> = {
    'Super Administrator': '🛡️',
    'HR Administrator': '👔',
    'Head Employee': '👤',
    'Employee': '🧑‍💼',
};

export default function RolesIndex({ roles, permissions }: { roles: RoleData[]; permissions: string[] }) {
    return (
        <AppLayout>
            <Head title="Roles & Permissions" />
            <div className="p-4 md:p-8">
                <div className="mb-6 md:mb-8">
                    <h1 className="text-xl md:text-2xl font-black text-foreground tracking-tight">Roles & Permissions</h1>
                    <p className="text-muted-foreground mt-1 text-xs md:text-sm font-medium italic opacity-80">Overview of system roles and their assigned permissions.</p>
                </div>

                <div className="grid grid-cols-2 gap-3 md:gap-6 mb-8">
                    <StatCard label="Total Roles" value={roles.length.toString()} icon={<KeyRound size={20} />} color="primary" />
                    <StatCard label="Permissions" value={permissions.length.toString()} icon={<ShieldCheck size={20} />} color="blue-500" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                    {roles.map(role => (
                        <div key={role.id} className={`bg-card border border-border rounded-2xl p-5 md:p-6 shadow-sm transition-all hover:shadow-md ${roleStyles[role.name] || 'border-t-4 border-t-zinc-400'}`}>
                            <div className="flex items-start justify-between mb-6">
                                <div className="flex items-center gap-4">
                                    <div className="text-3xl md:text-4xl filter drop-shadow-sm">{roleIcons[role.name] || '🔑'}</div>
                                    <div>
                                        <h3 className="text-lg md:text-xl font-black text-zinc-900 tracking-tight">{role.name}</h3>
                                        <div className="flex items-center gap-1.5 text-zinc-500 text-[10px] md:text-xs font-bold uppercase tracking-wider mt-0.5">
                                            <Users size={12} className="text-zinc-400" />
                                            <span>{role.users_count} Members</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="text-[10px] font-black uppercase tracking-widest bg-zinc-900 text-white px-2.5 py-1 rounded-lg shadow-sm">
                                    {role.permissions.length} PERMS
                                </div>
                            </div>

                            <div className="space-y-3">
                                <div className="flex items-center gap-2 mb-2">
                                    <div className="h-px bg-border flex-1"></div>
                                    <span className="text-[9px] font-black text-muted-foreground uppercase tracking-[0.2em]">Assigned Access</span>
                                    <div className="h-px bg-border flex-1"></div>
                                </div>
                                <div className="flex flex-wrap gap-1.5">
                                    {role.permissions.map(perm => (
                                        <span key={perm} className="text-[10px] font-bold uppercase tracking-tighter bg-zinc-100/80 text-zinc-600 px-2 py-0.5 rounded-md border border-zinc-200 hover:bg-zinc-200/50 transition-colors">
                                            {perm.replace('.', ' ')}
                                        </span>
                                    ))}
                                    {role.permissions.length === 0 && <p className="text-[11px] text-zinc-400 italic">No special permissions assigned.</p>}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </AppLayout>
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
