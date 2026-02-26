import { SidebarGroup, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { cn } from '@/lib/utils';

export function NavMain({ items = [], label }: { items: NavItem[]; label?: string }) {
    const page = usePage();
    return (
        <SidebarGroup className="px-2 py-0">
            {label && <SidebarGroupLabel>{label}</SidebarGroupLabel>}
            <SidebarMenu>
                {items.map((item) => {
                    const isActive = page.url === item.url || page.url.startsWith(item.url + '/');
                    return (
                        <SidebarMenuItem key={item.title}>
                            <SidebarMenuButton
                                asChild
                                isActive={isActive}
                                className={cn(
                                    'relative transition-all duration-200 min-h-10 h-auto px-3 w-full',
                                    isActive
                                        ? '!bg-zinc-900 !text-white shadow-lg hover:!bg-zinc-800 rounded-xl'
                                        : 'hover:bg-zinc-100 text-zinc-600'
                                )}
                            >
                                <Link href={item.url} prefetch className="flex items-center gap-3 w-full py-2">
                                    {isActive && (
                                        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-white rounded-r-full" />
                                    )}
                                    {item.icon && <item.icon className={cn("size-5 shrink-0", isActive ? "!text-white" : "text-zinc-500")} />}
                                    <span className={cn("text-sm tracking-tight truncate", isActive ? "font-bold" : "font-semibold")}>
                                        {item.title}
                                    </span>
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    );
                })}
            </SidebarMenu>
        </SidebarGroup>
    );
}
