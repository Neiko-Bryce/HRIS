import Heading from '@/components/heading';

export default function SettingsLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="px-6 py-8 max-w-5xl mx-auto">
            <div className="mb-10">
                <Heading title="Settings" description="Manage your profile, password, and preferences here." />
            </div>

            <div className="flex flex-col space-y-8">
                <div className="flex-1 min-w-0">
                    <section className="animate-in fade-in slide-in-from-bottom-2 duration-500">
                        {children}
                    </section>
                </div>
            </div>
        </div>
    );
}
