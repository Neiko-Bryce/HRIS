import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type SharedData } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import { Users, UserCheck, ShieldAlert, Activity } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
];

export default function Dashboard() {
    const { auth } = usePage<SharedData>().props;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-6 rounded-xl p-8">
                <div>
                    <h1 className="text-2xl font-bold text-foreground">Welcome back, {auth.user.name}</h1>
                    <p className="text-muted-foreground mt-1">Here's what's happening in your HRIS dashboard today.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    {/* Stat Cards */}
                    <div className="bg-card border border-border rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-primary/10 text-primary rounded-lg">
                                <Users size={20} />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Total Staff</p>
                                <p className="text-2xl font-bold">--</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-card border border-border rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-green-500/10 text-green-600 rounded-lg">
                                <UserCheck size={20} />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Active Now</p>
                                <p className="text-2xl font-bold">--</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-card border border-border rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-amber-500/10 text-amber-600 rounded-lg">
                                <ShieldAlert size={20} />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Leave Requests</p>
                                <p className="text-2xl font-bold">--</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-card border border-border rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-blue-500/10 text-blue-600 rounded-lg">
                                <Activity size={20} />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">System Health</p>
                                <p className="text-2xl font-bold">Optimal</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-card border border-border rounded-xl p-12 flex flex-col items-center justify-center text-center shadow-sm">
                    <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mb-6">
                        <Activity size={40} className="text-muted-foreground" />
                    </div>
                    <h2 className="text-xl font-bold mb-2">System Initialized</h2>
                    <p className="text-muted-foreground max-w-sm mb-6">
                        Role-Based Access Control and User Management modules are live. Start by managing your team members.
                    </p>
                    {auth.user?.roles?.includes('Super Administrator') && (
                        <a
                            href="/admin/users"
                            className="bg-primary text-primary-foreground px-6 py-2 rounded-lg font-medium hover:bg-primary/90 transition-colors"
                        >
                            Go to User Management
                        </a>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
