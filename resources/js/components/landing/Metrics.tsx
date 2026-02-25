import { Shield, TrendingUp, Users, Clock } from 'lucide-react';

export default function Metrics() {
    const metrics = [
        { label: 'Payroll Accuracy', value: '99.9%', icon: TrendingUp },
        { label: 'Admin Time Saved', value: '40%', icon: Clock },
        { label: 'Employees Managed', value: '10,000+', icon: Users },
        { label: 'Secure & Compliant', value: '100%', icon: Shield },
    ];

    return (
        <section className="py-24 bg-background relative z-10">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="bg-card border border-border/50 rounded-3xl p-12 lg:p-16 shadow-xl relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-12 relative z-10">
                        {metrics.map((metric, i) => (
                            <div key={i} className="flex flex-col items-center text-center group">
                                <div className="p-4 rounded-2xl bg-secondary text-primary mb-6 border border-border/50 group-hover:bg-primary group-hover:text-white transition-all duration-300 shadow-sm">
                                    <metric.icon size={28} strokeWidth={1.5} />
                                </div>
                                <span className="text-4xl sm:text-5xl font-extrabold text-foreground mb-2 tracking-tight">
                                    {metric.value}
                                </span>
                                <span className="text-xs font-bold text-muted-foreground uppercase tracking-[0.2em]">
                                    {metric.label}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
