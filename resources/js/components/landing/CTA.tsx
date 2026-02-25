import { Button } from '@/components/ui/button';
import { Link } from '@inertiajs/react';

export default function CTA() {
    return (
        <section className="py-32 bg-primary relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-accent/20 to-transparent pointer-events-none" />
            <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center text-primary-foreground relative z-10">
                <h2 className="text-4xl font-extrabold tracking-tight sm:text-5xl mb-8 leading-tight">
                    Ready to modernize your <br /> HR operations?
                </h2>
                <p className="text-xl text-primary-foreground/70 mb-12 leading-relaxed max-w-2xl mx-auto font-medium">
                    Join over 500+ enterprises that trust HRIS Pro to manage
                    their most valuable asset: their people.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                    <Button size="lg" className="bg-accent hover:bg-accent/90 text-white px-12 h-16 text-lg font-bold w-full sm:w-auto border-none shadow-2xl shadow-accent/40 transition-transform hover:scale-105" asChild>
                        <Link href={route('register')}>Start Your Free Trial</Link>
                    </Button>
                    <Button size="lg" variant="outline" className="border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/10 px-12 h-16 text-lg font-bold w-full sm:w-auto shadow-none transition-all" asChild>
                        <Link href="#">Speak with an Expert</Link>
                    </Button>
                </div>
            </div>
        </section>
    );
}
