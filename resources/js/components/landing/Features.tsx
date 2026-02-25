import {
    Users,
    Clock,
    Calendar,
    CreditCard,
    BarChart3,
    ShieldCheck,
    ArrowRight
} from 'lucide-react';

export default function Features() {
    const features = [
        {
            title: 'Employee Management',
            description: 'Centralized database for all employee records, documents, and history.',
            icon: Users,
        },
        {
            title: 'Attendance Tracking',
            description: 'Real-time DTR with geolocation and biometric synchronization.',
            icon: Clock,
        },
        {
            title: 'Leave Management',
            description: 'Automated workflows for leave requests, approvals, and balance tracking.',
            icon: Calendar,
        },
        {
            title: 'Payroll Automation',
            description: 'One-click payroll processing with automated tax and benefit calculations.',
            icon: CreditCard,
        },
        {
            title: 'Performance Evaluation',
            description: 'Structured KPI tracking and 360-degree feedback reviews.',
            icon: BarChart3,
        },
        {
            title: 'HR Analytics',
            description: 'Deep workforce insights with customizable reporting dashboards.',
            icon: ShieldCheck,
        },
    ];

    return (
        <section id="features" className="py-32 bg-secondary/20 relative">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-20">
                    <h2 className="text-4xl font-extrabold text-foreground tracking-tight sm:text-5xl mb-6">
                        Scale Your People Operations
                    </h2>
                    <p className="mt-4 text-xl text-muted-foreground max-w-3xl mx-auto font-medium">
                        Everything you need to manage your enterprise human resources in one secure, unified platform.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                    {features.map((feature, i) => (
                        <div
                            key={i}
                            className="bg-card p-10 rounded-2xl border border-border/50 hover:border-primary/40 transition-all group shadow-sm hover:shadow-xl hover:-translate-y-1"
                        >
                            <div className="p-4 rounded-xl bg-primary/10 text-primary mb-8 w-fit group-hover:bg-primary group-hover:text-white transition-all duration-300">
                                <feature.icon size={28} strokeWidth={1.5} />
                            </div>
                            <h3 className="text-xl font-bold text-foreground mb-4">{feature.title}</h3>
                            <p className="text-base text-muted-foreground leading-relaxed mb-6 font-medium">
                                {feature.description}
                            </p>
                            <div className="flex items-center gap-2 text-primary font-bold text-sm tracking-tight opacity-0 group-hover:opacity-100 transition-opacity">
                                Learn More <ArrowRight size={16} />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
