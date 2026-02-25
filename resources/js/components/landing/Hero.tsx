import { Button } from '@/components/ui/button';
import { Link } from '@inertiajs/react';

export default function Hero() {
    return (
        <section className="pt-32 pb-20 bg-background border-b border-border/50">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col lg:flex-row items-center gap-16">
                    {/* Left Content */}
                    <div className="flex-1 text-center lg:text-left">
                        <h1 className="text-4xl sm:text-5xl lg:text-7xl font-extrabold text-foreground leading-[1.1] tracking-tight">
                            Modern HR Management, <br />
                            <span className="text-primary font-black italic">Simplified.</span>
                        </h1>
                        <p className="mt-8 text-xl text-muted-foreground max-w-xl mx-auto lg:mx-0 leading-relaxed font-medium">
                            The ultimate enterprise-grade solution for employee lifecycle,
                            automated payroll, and real-time operational insights.
                        </p>

                        <div className="mt-12 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                            <Button size="lg" className="bg-primary hover:bg-primary/90 text-white px-10 h-14 text-base font-bold shadow-lg shadow-primary/20 border-none transition-all hover:scale-[1.02]" asChild>
                                <Link href={route('register')}>Get Started for Free</Link>
                            </Button>
                            <Button size="lg" variant="outline" className="border-border bg-card text-foreground hover:bg-secondary px-10 h-14 text-base font-bold transition-all shadow-sm" asChild>
                                <Link href="#">Schedule Demo</Link>
                            </Button>
                        </div>
                    </div>

                    {/* Right Mockup */}
                    <div className="flex-1 w-full max-w-2xl lg:max-w-none">
                        <div className="relative rounded-2xl border border-border bg-card p-2 shadow-2xl overflow-hidden group">
                            <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 to-transparent pointer-events-none" />
                            <div className="bg-muted/30 rounded-xl p-6 min-h-[400px] flex flex-col gap-8 backdrop-blur-sm">
                                {/* Mock Header */}
                                <div className="flex items-center justify-between">
                                    <div className="flex gap-4 items-center">
                                        <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/5 flex items-center justify-center">
                                            <div className="w-5 h-5 bg-accent rounded-sm opacity-60" />
                                        </div>
                                        <div className="w-32 h-3 bg-muted rounded-full"></div>
                                    </div>
                                    <div className="flex gap-3">
                                        <div className="w-8 h-8 rounded-full bg-muted/60"></div>
                                        <div className="w-8 h-8 rounded-full bg-muted/60"></div>
                                    </div>
                                </div>
                                {/* Mock Grid */}
                                <div className="grid grid-cols-3 gap-6">
                                    {[1, 2, 3].map(i => (
                                        <div key={i} className="h-28 bg-card border border-border rounded-xl p-4 flex flex-col justify-between shadow-sm">
                                            <div className="w-12 h-2 bg-muted rounded-full"></div>
                                            <div className="w-full h-8 bg-muted/20 rounded-md"></div>
                                        </div>
                                    ))}
                                </div>
                                {/* Mock List */}
                                <div className="flex-1 bg-card border border-border rounded-xl p-6 space-y-4 shadow-sm">
                                    <div className="flex gap-4">
                                        <div className="w-10 h-10 rounded-full bg-muted/30 shrink-0"></div>
                                        <div className="flex-1 space-y-2 py-1">
                                            <div className="w-full h-2 bg-muted rounded-full"></div>
                                            <div className="w-3/4 h-2 bg-muted/40 rounded-full"></div>
                                        </div>
                                    </div>
                                    <div className="flex gap-4 pt-2">
                                        <div className="w-10 h-10 rounded-full bg-muted/30 shrink-0"></div>
                                        <div className="flex-1 space-y-2 py-1">
                                            <div className="w-5/6 h-2 bg-muted rounded-full"></div>
                                            <div className="w-1/2 h-2 bg-muted/40 rounded-full"></div>
                                        </div>
                                    </div>
                                    <div className="w-full h-2 bg-muted/10 rounded-full mt-6"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
