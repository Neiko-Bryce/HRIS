import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem
} from '@/components/ui/sidebar';
import { type NavItem, type SharedData } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import {
    LayoutGrid,
    ShieldCheck,
    Users,
    Clock,
    CreditCard,
    ClipboardList,
    Building2,
    Briefcase,
    KeyRound,
    BarChart3,
    Settings,
    FileText,
} from 'lucide-react';
import AppLogo from './app-logo';

export function AppSidebar() {
    const { auth } = usePage<SharedData>().props;
    const isSuperAdmin = auth.user?.roles?.includes('Super Administrator');
    const isHR = isSuperAdmin || auth.user?.roles?.includes('HR Administrator');

    const mainNavItems: NavItem[] = [
        {
            title: 'Dashboard',
            url: '/dashboard',
            icon: LayoutGrid,
        },
    ];

    const hrNavItems: NavItem[] = [
        {
            title: 'Employee List',
            url: '/admin/employees',
            icon: Users,
        },
        {
            title: 'Leave Management',
            url: '/admin/leaves',
            icon: ClipboardList,
        },
        {
            title: 'Recruitment',
            url: '/admin/recruitment',
            icon: Briefcase,
        },
        {
            title: 'Document Management (EIS)',
            url: '/admin/documents',
            icon: FileText,
        },
    ];

    const attendanceNavItems: NavItem[] = [
        {
            title: 'Virtual DTR',
            url: '/admin/attendance',
            icon: Clock,
        },
    ];

    const payrollNavItems: NavItem[] = [
        {
            title: 'Payslips',
            url: '/admin/payroll',
            icon: CreditCard,
        },
    ];

    const adminNavItems: NavItem[] = [];
    if (isSuperAdmin) {
        adminNavItems.push(
            {
                title: 'User Management',
                url: '/admin/users',
                icon: ShieldCheck,
            },
            {
                title: 'Departments',
                url: '/admin/departments',
                icon: Building2,
            },
            {
                title: 'Roles & Permissions',
                url: '/admin/roles',
                icon: KeyRound,
            },
            {
                title: 'Reports & Analytics',
                url: '/admin/reports',
                icon: BarChart3,
            },
            {
                title: 'System Settings',
                url: '/admin/settings',
                icon: Settings,
            },
        );
    }


    return (
        <Sidebar collapsible="icon" variant="sidebar">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href="/dashboard" prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />

                {isHR && <NavMain items={hrNavItems} label="HR Management" />}

                <NavMain items={attendanceNavItems} label="Virtual DTR" />

                <NavMain items={payrollNavItems} label="Payroll" />

                {isSuperAdmin && <NavMain items={adminNavItems} label="Administration" />}
            </SidebarContent>

            <SidebarFooter>
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
