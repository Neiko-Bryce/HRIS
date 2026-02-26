import AppLogoIcon from './app-logo-icon';

export default function AppLogo() {
    return (
        <div className="flex items-center gap-3 px-2 py-2">
            <div className="bg-zinc-900 text-white flex aspect-square size-10 items-center justify-center rounded-xl shadow-xl border border-zinc-800 transition-transform hover:scale-105 duration-300">
                <AppLogoIcon className="size-6 fill-current" />
            </div>
            <div className="grid flex-1 text-left">
                <span className="truncate text-lg font-black tracking-tighter text-zinc-900 leading-none">HRIS</span>
                <span className="truncate text-[10px] text-muted-foreground font-black uppercase tracking-[0.2em] mt-1 opacity-70">Enterprise</span>
            </div>
        </div>
    );
}
