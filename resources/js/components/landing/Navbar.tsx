import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Link } from '@inertiajs/react';
import { Menu, X, ChevronRight } from 'lucide-react';
import AppLogoIcon from '@/components/app-logo-icon';
import { motion } from 'framer-motion';

export default function Navbar() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navLinks = [
        { name: 'Features', href: '#features' },
        { name: 'Analytics', href: '#analytics' },
        { name: 'Testimonials', href: '#testimonials' },
        { name: 'Contact', href: '#' },
    ];

    return (
        <nav className={`fixed top-0 w-full z-50 transition-all duration-500 ${isScrolled
            ? 'bg-background/40 backdrop-blur-xl border-b border-white/20 py-4 shadow-lg'
            : 'bg-transparent py-8'
            }`}>
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-3 group">
                        <motion.div
                            initial={{ rotate: -10, opacity: 0, scale: 0.5 }}
                            animate={{ rotate: 0, opacity: 1, scale: 1 }}
                            transition={{ type: "spring", stiffness: 260, damping: 20 }}
                            className="bg-zinc-950 text-white flex aspect-square size-11 items-center justify-center rounded-2xl shadow-2xl border border-white/10 transition-transform group-hover:scale-110 duration-500"
                        >
                            <AppLogoIcon className="size-6 fill-current" />
                        </motion.div>
                        <motion.div
                            initial={{ x: -20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            className="grid text-left"
                        >
                            <span className="truncate text-2xl font-black tracking-tighter text-zinc-950 leading-none">HRIS</span>
                            <span className="truncate text-[10px] text-muted-foreground font-black uppercase tracking-[0.3em] mt-1.5 opacity-60">Enterprise</span>
                        </motion.div>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center gap-10">
                        {navLinks.map((link, i) => (
                            <motion.div
                                key={link.name}
                                initial={{ y: -10, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: i * 0.1 }}
                            >
                                <Link
                                    href={link.href}
                                    className="text-sm font-bold text-zinc-500 hover:text-zinc-950 transition-colors tracking-tight relative group/link"
                                >
                                    {link.name}
                                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all group-hover/link:w-full" />
                                </Link>
                            </motion.div>
                        ))}
                        <div className="h-4 w-px bg-zinc-200 mx-2" />
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.5 }}
                        >
                            <Link href={route('login')} className="text-sm font-bold text-zinc-900 hover:text-primary transition-colors">
                                Login
                            </Link>
                        </motion.div>
                        <motion.div
                            initial={{ x: 20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: 0.6 }}
                        >
                            <Button className="bg-zinc-950 hover:bg-zinc-900 text-white font-black h-12 px-8 rounded-2xl shadow-2xl border-none transition-all hover:translate-x-1 active:scale-95" asChild>
                                <Link href={route('register')}>
                                    Get Started <ChevronRight size={16} className="ml-1" />
                                </Link>
                            </Button>
                        </motion.div>
                    </div>

                    {/* Mobile Menu Toggle */}
                    <button
                        className="md:hidden p-2 text-foreground hover:bg-secondary rounded-lg transition-colors"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    >
                        {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu Overlay */}
            {mobileMenuOpen && (
                <div className="md:hidden absolute top-full left-0 w-full bg-background border-b border-border p-6 shadow-2xl animate-in slide-in-from-top duration-300">
                    <div className="flex flex-col gap-6">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                href={link.href}
                                className="text-lg font-bold text-foreground hover:text-primary transition-colors"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                {link.name}
                            </Link>
                        ))}
                        <hr className="border-border" />
                        <Link href={route('login')} className="text-lg font-bold text-foreground">
                            Login
                        </Link>
                        <Button className="bg-primary hover:bg-primary/90 text-white font-bold h-14 text-base w-full rounded-xl" asChild>
                            <Link href={route('register')}>Get Started</Link>
                        </Button>
                    </div>
                </div>
            )}
        </nav>
    );
}
