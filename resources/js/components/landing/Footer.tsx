import { Link } from '@inertiajs/react';
import AppLogoIcon from '@/components/app-logo-icon';

export default function Footer() {
    const currentYear = new Date().getFullYear();

    const links = {
        Product: ['Features', 'Analytics', 'Testimonials'],
        Resources: ['Documentation', 'Support', 'Integrations'],
        Company: ['About Us', 'Careers', 'Contact'],
        Legal: ['Privacy', 'Terms', 'Security'],
    };

    return (
        <footer className="bg-background pt-24 pb-12 border-t border-border/50">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-12 lg:gap-8 mb-16">
                    <div className="col-span-2 lg:col-span-1">
                        <Link href="/" className="flex items-center gap-2 mb-6 group">
                            <div className="w-10 h-10 bg-zinc-900 text-white flex aspect-square items-center justify-center rounded-xl shadow-xl border border-zinc-800 transition-transform group-hover:scale-105 duration-300">
                                <AppLogoIcon className="size-6 fill-current" />
                            </div>
                            <div className="grid text-left">
                                <span className="truncate text-xl font-black tracking-tighter text-zinc-900 leading-none">HRIS</span>
                                <span className="truncate text-[9px] text-muted-foreground font-black uppercase tracking-[0.2em] opacity-70">Enterprise</span>
                            </div>
                        </Link>
                        <p className="text-sm text-muted-foreground leading-relaxed max-w-xs font-medium">
                            Enterprise-grade human resource management.
                            Simplify operations, empower your people.
                        </p>
                    </div>

                    {Object.entries(links).map(([category, items]) => (
                        <div key={category} className="flex flex-col">
                            <h4 className="text-xs font-bold text-foreground uppercase tracking-[0.2em] mb-6">
                                {category}
                            </h4>
                            <ul className="space-y-4">
                                {items.map((item) => (
                                    <li key={item}>
                                        <Link href="#" className="text-sm text-muted-foreground hover:text-primary font-semibold transition-colors">
                                            {item}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                <div className="pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-6">
                    <p className="text-xs text-muted-foreground font-bold tracking-widest uppercase">
                        © {currentYear} HRIS Pro. All Rights Reserved.
                    </p>
                    <div className="flex gap-6">
                        {['Twitter', 'LinkedIn', 'Github'].map((social) => (
                            <Link key={social} href="#" className="text-xs text-muted-foreground hover:text-primary font-bold tracking-widest uppercase transition-colors">
                                {social}
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </footer>
    );
}
