export default function Testimonials() {
    const testimonials = [
        {
            quote: "Switching to HRIS Pro was the best decision for our operations. The automated payroll alone saved us 20 hours a week.",
            author: "Sarah Jenkins",
            role: "HR Director at TechFlow",
            avatar: "SJ"
        },
        {
            quote: "The interface is incredibly clean and intuitive. Our employees actually enjoy using the platform for leave tracking.",
            author: "Michael Chen",
            role: "Founder of Nexus Lab",
            avatar: "MC"
        },
        {
            quote: "Enterprise-grade security coupled with beautiful design. It's rare to find a tool that satisfies both IT and UX teams.",
            author: "Elena Rodriguez",
            role: "COO at Global Logistics",
            avatar: "ER"
        },
    ];

    return (
        <section id="testimonials" className="py-32 bg-background border-t border-border">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-20">
                    <h2 className="text-4xl font-extrabold text-foreground tracking-tight sm:text-5xl mb-6">
                        Trusted by Industry Leaders
                    </h2>
                    <p className="mt-4 text-xl text-muted-foreground max-w-2xl mx-auto font-medium">
                        See how HRIS Pro is transforming workforce management.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                    {testimonials.map((t, i) => (
                        <div key={i} className="bg-card p-10 rounded-3xl border border-border shadow-sm flex flex-col justify-between hover:shadow-xl transition-all hover:scale-[1.02]">
                            <p className="text-lg text-foreground/90 italic mb-10 leading-relaxed font-medium">
                                "{t.quote}"
                            </p>
                            <div className="flex items-center gap-5">
                                <div className="w-14 h-14 rounded-2xl bg-accent/10 border border-accent/20 flex items-center justify-center text-accent font-black text-lg">
                                    {t.avatar}
                                </div>
                                <div>
                                    <div className="text-base font-extrabold text-foreground">{t.author}</div>
                                    <div className="text-sm text-muted-foreground font-semibold">{t.role}</div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
