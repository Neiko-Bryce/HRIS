import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarGroup,
    SidebarGroupLabel
} from '@/components/ui/sidebar';
import { type NavItem, type SharedData } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import {
    BookOpen,
    Folder,
    LayoutGrid,
    ShieldCheck,
    Users,
    Clock,
    CreditCard,
    ClipboardList
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
            url: '#',
            icon: Users,
        },
        {
            title: 'Leave Management',
            url: '#',
            icon: ClipboardList,
        },
    ];

    const attendanceNavItems: NavItem[] = [
        {
            title: 'Virtual DTR',
            url: '#',
            icon: Clock,
        },
    ];

    const payrollNavItems: NavItem[] = [
        {
            title: 'Payslips',
            url: '#',
            icon: CreditCard,
        },
    ];

    const adminNavItems: NavItem[] = [];
    if (isSuperAdmin) {
        adminNavItems.push({
            title: 'User Management',
            url: '/admin/users',
            icon: ShieldCheck,
        });
    }

    const footerNavItems: NavItem[] = [
        {
            title: 'Repository',
            url: 'https://github.com/laravel/react-starter-kit',
            icon: Folder,
        },
        {
            title: 'Documentation',
            url: 'https://laravel.com/docs/starter-kits',
            icon: BookOpen,
        },
    ];

    return (
        <Sidebar collapsible="icon" variant="inset">
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

                {isHR && (
                    <SidebarGroup className="px-2 py-2">
                        <SidebarGroupLabel className="text-xs font-black uppercase tracking-widest text-muted-foreground/50">HR Management</SidebarGroupLabel>
                        <NavMain items={hrNavItems} />
                    </SidebarGroup>
                )}

                <SidebarGroup className="px-2 py-2">
                    <SidebarGroupLabel className="text-xs font-black uppercase tracking-widest text-muted-foreground/50">Attendance</SidebarGroupLabel>
                    <NavMain items={attendanceNavItems} />
                </SidebarGroup>

                <SidebarGroup className="px-2 py-2">
                    <SidebarGroupLabel className="text-xs font-black uppercase tracking-widest text-muted-foreground/50">Payroll</SidebarGroupLabel>
                    <NavMain items={payrollNavItems} />
                </SidebarGroup>

                {isSuperAdmin && (
                    <SidebarGroup className="px-2 py-2">
                        <SidebarGroupLabel className="text-xs font-black uppercase tracking-widest text-muted-foreground/50">Administration</SidebarGroupLabel>
                        <NavMain items={adminNavItems} />
                    </SidebarGroup>
                )}
            </SidebarContent>

            <SidebarFooter>
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
