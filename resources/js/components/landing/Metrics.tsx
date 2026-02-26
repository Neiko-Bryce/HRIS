import { Shield, TrendingUp, Users, Clock } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Metrics() {
    const metrics = [
        { label: 'Payroll Accuracy', value: '99.9%', icon: TrendingUp },
        { label: 'Admin Time Saved', value: '40%', icon: Clock },
        { label: 'Employees Managed', value: '10,000+', icon: Users },
        { label: 'Secure & Compliant', value: '100%', icon: Shield },
    ];

    return (
        <section className="py-24 bg-background relative z-10 overflow-hidden">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                    {metrics.map((metric, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1, duration: 0.5 }}
                            whileHover={{ y: -5 }}
                            className="glass-card rounded-[2rem] p-8 flex flex-col items-center text-center transition-all hover:bg-white duration-500"
                        >
                            <div className="p-4 rounded-2xl bg-primary/10 text-primary mb-6 group-hover:bg-primary group-hover:text-white transition-all duration-300">
                                <metric.icon size={28} strokeWidth={1.5} />
                            </div>
                            <h3 className="text-4xl sm:text-5xl font-black text-zinc-950 mb-2 tracking-tighter">
                                {metric.value}
                            </h3>
                            <p className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em]">
                                {metric.label}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
