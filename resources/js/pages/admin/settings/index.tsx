import { Head, useForm } from '@inertiajs/react';
import { Settings as SettingsIcon, Save, Power, ShieldAlert, Globe, Server } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import React from 'react';

interface Config {
    app_name: string;
    app_url: string;
    app_env: string;
    debug_mode: boolean;
    maintenance_mode: boolean;
}

export default function SettingsIndex({ config }: { config: Config }) {
    const { data, setData, put, processing } = useForm({
        app_name: config.app_name,
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        put(route('admin.settings.update'));
    };

    return (
        <AppLayout>
            <Head title="System Settings" />
            <div className="p-4 md:p-8 max-w-4xl mx-auto">
                <div className="mb-6 md:mb-8 text-center md:text-left">
                    <h1 className="text-xl md:text-2xl font-black text-foreground tracking-tight">System Configuration</h1>
                    <p className="text-muted-foreground mt-1 text-xs md:text-sm font-medium italic opacity-80">Manage global application settings and maintenance mode.</p>
                </div>

                <div className="grid gap-6">
                    <div className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden">
                        <div className="p-4 md:p-6 border-b border-border bg-muted/20">
                            <h2 className="text-sm font-bold flex items-center gap-2 text-zinc-900 tracking-tight">
                                <SettingsIcon size={18} className="text-primary" /> General Application Settings
                            </h2>
                        </div>
                        <form onSubmit={submit} className="p-4 md:p-6 space-y-6">
                            <div className="grid gap-5">
                                <div className="space-y-2">
                                    <Label htmlFor="app_name" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Application Name</Label>
                                    <Input id="app_name" className="rounded-xl h-11" value={data.app_name} onChange={e => setData('app_name', e.target.value)} placeholder="Enter system name..." />
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2 opacity-70">
                                        <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-1.5 font-mono"><Server size={10} /> Environment</Label>
                                        <Input className="rounded-xl bg-muted/50 font-mono text-xs h-11" value={config.app_env} disabled />
                                    </div>
                                    <div className="space-y-2 opacity-70">
                                        <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-1.5 font-mono"><Globe size={10} /> Base URL</Label>
                                        <Input className="rounded-xl bg-muted/50 font-mono text-xs h-11" value={config.app_url} disabled />
                                    </div>
                                </div>
                            </div>
                            <Button type="submit" disabled={processing} className="w-full md:w-auto px-8 h-11 bg-primary hover:bg-primary/90 font-black uppercase text-[10px] tracking-widest shadow-sm rounded-xl">
                                {processing ? 'Updating...' : <><Save size={16} className="mr-2" /> Save Changes</>}
                            </Button>
                        </form>
                    </div>

                    <div className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden">
                        <div className="p-4 md:p-6 border-b border-border bg-muted/20 flex items-center justify-between">
                            <h2 className="text-sm font-bold flex items-center gap-2 text-red-600 tracking-tight">
                                <ShieldAlert size={18} /> Safety & Maintenance
                            </h2>
                            <Switch checked={config.maintenance_mode} onCheckedChange={() => { }} disabled className="data-[state=checked]:bg-red-500" />
                        </div>
                        <div className="p-4 md:p-6">
                            <p className="text-xs md:text-sm text-zinc-500 mb-6 font-medium leading-relaxed">
                                When enabled, the application will be offline for all users except authorized administrators.
                                <span className="text-red-600 font-bold block mt-1 uppercase text-[10px] tracking-widest">Use with caution.</span>
                            </p>
                            <Button variant="outline" className="w-full md:w-auto h-11 px-8 text-red-600 hover:bg-red-50 hover:text-red-700 border-red-200 font-black uppercase text-[10px] tracking-widest rounded-xl">
                                <Power size={16} className="mr-2" /> {config.maintenance_mode ? 'End Maintenance' : 'Begin Maintenance'}
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
