import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Link } from '@inertiajs/react';
import { Menu, X, ChevronRight } from 'lucide-react';

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
        <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${isScrolled
                ? 'bg-background/80 backdrop-blur-xl border-b border-border/50 py-4 shadow-sm'
                : 'bg-transparent py-6'
            }`}>
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2 group">
                        <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20 group-hover:scale-110 transition-transform">
                            <span className="text-white font-black text-xl italic">H</span>
                        </div>
                        <span className="text-2xl font-black text-foreground tracking-tighter">
                            HRIS<span className="text-accent">Pro</span>
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center gap-10">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                href={link.href}
                                className="text-sm font-bold text-muted-foreground hover:text-primary transition-colors tracking-tight"
                            >
                                {link.name}
                            </Link>
                        ))}
                        <div className="h-4 w-px bg-border/50 mx-2" />
                        <Link href={route('login')} className="text-sm font-bold text-foreground hover:text-primary transition-colors">
                            Login
                        </Link>
                        <Button className="bg-primary hover:bg-primary/90 text-white font-bold h-11 px-6 rounded-xl shadow-lg shadow-primary/20 border-none transition-all hover:translate-x-1" asChild>
                            <Link href={route('register')}>
                                Get Started <ChevronRight size={16} className="ml-1" />
                            </Link>
                        </Button>
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
