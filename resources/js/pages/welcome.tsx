import { Head } from '@inertiajs/react';
import Navbar from '@/components/landing/Navbar';
import Hero from '@/components/landing/Hero';
import Metrics from '@/components/landing/Metrics';
import Features from '@/components/landing/Features';
import Analytics from '@/components/landing/Analytics';
import Testimonials from '@/components/landing/Testimonials';
import Pricing from '@/components/landing/Pricing';
import CTA from '@/components/landing/CTA';
import Footer from '@/components/landing/Footer';

export default function Welcome() {
    return (
        <div className="min-h-screen bg-background font-sans antialiased text-foreground">
            <Head title="Enterprise HRIS | HRIS Pro" />

            <Navbar />

            <main>
                <Hero />
                <Metrics />
                <Features />
                <Analytics />
                <Testimonials />
            </main>

            <Footer />
        </div>
    );
}
