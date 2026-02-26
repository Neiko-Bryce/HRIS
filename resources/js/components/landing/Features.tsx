import {
    Users,
    Clock,
    Calendar,
    CreditCard,
    BarChart3,
    ShieldCheck,
    ArrowRight
} from 'lucide-react';
import { motion } from 'framer-motion';

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
        <section id="features" className="py-32 bg-secondary/10 relative overflow-hidden">
            <div className="absolute top-1/2 left-[-10%] size-[40%] bg-primary/5 rounded-full blur-[100px] pointer-events-none" />

            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-24"
                >
                    <h2 className="text-4xl font-black text-zinc-950 tracking-tight sm:text-6xl mb-8">
                        The Operating System <br /><span className="text-primary italic">for Your People.</span>
                    </h2>
                    <p className="mt-4 text-xl text-zinc-500 max-w-2xl mx-auto font-medium leading-relaxed">
                        Every tool you need to hire, pay, and grow your workforce in a single professional environment.
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {features.map((feature, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                            whileHover={{ y: -8 }}
                            className="bg-white p-10 rounded-[2.5rem] border border-zinc-200 shadow-sm hover:shadow-2xl transition-all group relative overflow-hidden"
                        >
                            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                            <div className="p-4 rounded-2xl bg-zinc-950 text-white mb-10 w-fit shadow-xl group-hover:scale-110 transition-transform duration-500 relative z-10">
                                <feature.icon size={28} strokeWidth={1.5} />
                            </div>
                            <div className="relative z-10">
                                <h3 className="text-2xl font-black text-zinc-950 mb-4">{feature.title}</h3>
                                <p className="text-base text-zinc-500 leading-relaxed mb-8 font-medium">
                                    {feature.description}
                                </p>
                                <div className="flex items-center gap-2 text-primary font-black text-sm tracking-tight group-hover:translate-x-2 transition-transform">
                                    Explore Feature <ArrowRight size={16} />
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
