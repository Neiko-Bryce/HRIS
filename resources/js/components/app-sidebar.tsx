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
    Star,
} from 'lucide-react';
import AppLogo from './app-logo';

export function AppSidebar() {
    const { auth } = usePage<SharedData>().props;
    const isSuperAdmin = auth.user?.roles?.includes('Super Administrator');
    const isHR = isSuperAdmin || auth.user?.roles?.includes('HR Administrator');

    const isHead = isSuperAdmin || auth.user?.roles?.includes('Head Employee');

    // 1. Personal Portal (Available to everyone)
    const employeeNavItems: NavItem[] = [
        {
            title: 'Dashboard',
            url: '/dashboard',
            icon: LayoutGrid,
        },
        {
            title: 'Virtual DTR',
            url: '/attendance/check',
            icon: Clock,
        },
        {
            title: 'My Leaves',
            url: '/my/leaves',
            icon: ClipboardList,
        },
        {
            title: 'My Payslips',
            url: '/my/payslips',
            icon: CreditCard,
        },
    ];

    // 2. Head Employee (Team Management)
    const headNavItems: NavItem[] = [];
    if (isHead && !isSuperAdmin && !isHR) { // Prevent too much clutter for SuperAdmin/HR who already see everything
        headNavItems.push(
            {
                title: 'Team Attendance',
                url: '/admin/attendance', // Heads can see attendance
                icon: Clock,
            },
            {
                title: 'Team Leaves',
                url: '/admin/leaves',
                icon: ClipboardList,
            },
            {
                title: 'Performance Reviews',
                url: '/admin/performance',
                icon: Star,
            }
        );
    }

    // 3. HR Management
    const hrNavItems: NavItem[] = [];
    if (isHR) {
        hrNavItems.push(
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
                title: 'Attendance Records',
                url: '/admin/attendance',
                icon: Clock,
            },
            {
                title: 'Recruitment',
                url: '/admin/recruitment',
                icon: Briefcase,
            },
            {
                title: 'Payroll',
                url: '/admin/payroll',
                icon: CreditCard,
            },
            {
                title: 'Document Management',
                url: '/admin/documents',
                icon: FileText,
            },
            {
                title: 'Generate QR Code',
                url: '/admin/attendance/qr-terminal',
                icon: Clock,
            },
            {
                title: 'Performance Reviews',
                url: '/admin/performance',
                icon: Star,
            }
        );
    }

    // 4. System Administration (Super Admin only)
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
                <NavMain items={employeeNavItems} label="My Portal" />

                {headNavItems.length > 0 && <NavMain items={headNavItems} label="Team Management" />}
                {hrNavItems.length > 0 && <NavMain items={hrNavItems} label="HR Operations" />}
                {adminNavItems.length > 0 && <NavMain items={adminNavItems} label="System Administration" />}
            </SidebarContent>

            <SidebarFooter>
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
