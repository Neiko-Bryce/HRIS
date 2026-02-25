import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';

export default function Pricing() {
    const plans = [
        {
            name: 'Basic',
            price: '$49',
            description: 'Essential HR tools for small growing businesses.',
            features: ['Up to 50 employees', 'Employee records', 'Basic attendance', 'Email support'],
            highlight: false,
        },
        {
            name: 'Professional',
            price: '$149',
            description: 'Full-featured solution for established enterprises.',
            features: ['Up to 500 employees', 'Automated payroll', 'Performance mgmt', 'Priority support', 'HR analytics'],
            highlight: true,
        },
        {
            name: 'Enterprise',
            price: 'Custom',
            description: 'Scalable infrastructure for large scale organizations.',
            features: ['Unlimited employees', 'Custom integrations', 'Dedicated manager', '24/7 Phone support', 'On-site training'],
            highlight: false,
        },
    ];

    return (
        <section id="pricing" className="py-32 bg-background border-t border-border">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-20">
                    <h2 className="text-4xl font-extrabold text-foreground tracking-tight sm:text-5xl mb-6">
                        Transparent Pricing
                    </h2>
                    <p className="mt-4 text-xl text-muted-foreground max-w-2xl mx-auto font-medium">
                        Simple, scalable plans designed to grow with your workforce.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {plans.map((plan, i) => (
                        <div
                            key={i}
                            className={`flex flex-col p-10 rounded-3xl border transition-all duration-300 shadow-sm ${plan.highlight
                                    ? 'border-accent border-2 bg-card scale-105 shadow-xl relative z-10'
                                    : 'border-border bg-card'
                                }`}
                        >
                            {plan.highlight && (
                                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-accent text-white py-1 px-4 rounded-full text-xs font-bold uppercase tracking-widest leading-none">
                                    Most Popular
                                </div>
                            )}
                            <h3 className="text-xl font-bold text-foreground mb-3">{plan.name}</h3>
                            <div className="mb-6">
                                <span className="text-5xl font-extrabold text-foreground tracking-tight">{plan.price}</span>
                                {plan.price !== 'Custom' && <span className="text-muted-foreground ml-2 font-semibold">/mo</span>}
                            </div>
                            <p className="text-base text-muted-foreground mb-10 leading-relaxed font-medium">
                                {plan.description}
                            </p>

                            <ul className="space-y-5 mb-12 flex-1">
                                {plan.features.map((feature, j) => (
                                    <li key={j} className="flex items-center gap-4 text-sm font-semibold text-foreground/80">
                                        <div className="flex-shrink-0 w-5 h-5 rounded-full bg-accent/10 flex items-center justify-center text-accent">
                                            <Check size={14} strokeWidth={3} />
                                        </div>
                                        {feature}
                                    </li>
                                ))}
                            </ul>

                            <Button
                                className={`w-full py-7 text-base font-bold rounded-2xl transition-all ${plan.highlight
                                        ? 'bg-accent hover:bg-accent/90 text-white shadow-lg shadow-accent/20 border-none'
                                        : 'bg-secondary text-foreground hover:bg-muted border-none shadow-sm'
                                    }`}
                            >
                                {plan.price === 'Custom' ? 'Contact Sales' : 'Get Started Now'}
                            </Button>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
