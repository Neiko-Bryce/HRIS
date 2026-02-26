import { Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { ChevronRight, Play, Users, Calendar, Clock } from 'lucide-react';
import AppLogoIcon from '@/components/app-logo-icon';

export default function Hero() {
    return (
        <section className="relative pt-32 pb-24 lg:pt-48 lg:pb-32 overflow-hidden">
            {/* Animated Background Elements */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full pointer-events-none z-0">
                <motion.div
                    animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.3, 0.5, 0.3],
                        x: [0, 50, 0],
                        y: [0, -30, 0]
                    }}
                    transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary/20 rounded-full blur-[120px]"
                />
                <motion.div
                    animate={{
                        scale: [1, 1.3, 1],
                        opacity: [0.2, 0.4, 0.2],
                        x: [0, -40, 0],
                        y: [0, 60, 0]
                    }}
                    transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-accent/20 rounded-full blur-[100px]"
                />
            </div>

            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="flex flex-col lg:flex-row items-center gap-20">
                    {/* Left Content */}
                    <div className="flex-1 text-center lg:text-left">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                        >
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/50 backdrop-blur-md border border-white/20 shadow-sm mb-8">
                                <span className="flex h-2 w-2 rounded-full bg-primary animate-pulse" />
                                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">v2.0 Enterprise is live</span>
                            </div>
                            <h1 className="text-5xl md:text-6xl lg:text-8xl font-black text-zinc-950 leading-[0.95] tracking-tight mb-8">
                                Human <br />
                                <span className="text-primary italic relative">
                                    Resources
                                    <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 300 12" fill="none">
                                        <path d="M4 8C40 3 150 4 296 9" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
                                    </svg>
                                </span>
                                <br />Unified.
                            </h1>
                            <p className="text-lg md:text-xl text-zinc-500 max-w-xl mx-auto lg:mx-0 leading-relaxed font-medium mb-12">
                                The next generation of HR operations. From automated payroll to AI-driven workforce insights, all in one stunning interface.
                            </p>

                            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-5">
                                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
                                    <Link
                                        href={route('register')}
                                        className="inline-flex items-center justify-center bg-zinc-950 text-white rounded-2xl px-10 h-16 text-base font-black shadow-2xl hover:bg-zinc-900 transition-all group"
                                    >
                                        Start Your Journey <ChevronRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
                                    </Link>
                                </motion.div>
                                <button className="inline-flex items-center justify-center gap-3 px-8 h-16 text-base font-bold text-zinc-600 hover:text-zinc-950 transition-colors group">
                                    <div className="w-10 h-10 rounded-full bg-white border border-zinc-200 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                                        <Play size={16} fill="currentColor" />
                                    </div>
                                    Watch Promo
                                </button>
                            </div>
                        </motion.div>
                    </div>

                    {/* Right Mockup */}
                    <div className="flex-1 w-full max-w-2xl lg:max-w-none perspective-[2000px]">
                        <motion.div
                            initial={{ opacity: 0, rotateY: 15, rotateX: 5, scale: 0.8 }}
                            animate={{ opacity: 1, rotateY: 0, rotateX: 0, scale: 1 }}
                            transition={{ duration: 1, ease: "easeOut" }}
                            className="relative group"
                        >
                            {/* Decorative elements behind mockup */}
                            <div className="absolute -inset-10 bg-gradient-to-tr from-primary/10 to-accent/10 rounded-[3rem] blur-3xl opacity-50 group-hover:opacity-80 transition-opacity duration-1000" />

                            {/* The Main Mockup Frame */}
                            <div className="relative glass-morphism rounded-[2.5rem] p-3 shadow-2xl border border-white/40 overflow-hidden group-hover:shadow-primary/10 transition-shadow duration-500">
                                <div className="bg-white/50 backdrop-blur-md rounded-[1.8rem] overflow-hidden border border-white/60 min-h-[500px] flex flex-col shadow-inner">
                                    {/* Mock Header */}
                                    <div className="h-16 border-b border-zinc-200/50 bg-white/40 px-6 flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="size-8 bg-zinc-950 rounded-lg flex items-center justify-center border border-white/20">
                                                <AppLogoIcon className="size-4 fill-current text-white" />
                                            </div>
                                            <div className="w-24 h-2 bg-zinc-200 rounded-full" />
                                        </div>
                                        <div className="flex gap-2">
                                            <div className="size-8 rounded-full bg-zinc-100 border border-zinc-200" />
                                            <div className="size-8 rounded-full bg-primary/10 border border-primary/20" />
                                        </div>
                                    </div>

                                    {/* Mock Body */}
                                    <div className="p-8 flex-1 grid grid-cols-12 gap-6 bg-zinc-50/30">
                                        {/* Main Chart Section */}
                                        <div className="col-span-8 space-y-6">
                                            <div className="h-48 bg-white rounded-2xl border border-zinc-200/80 p-5 shadow-sm relative overflow-hidden group/chart">
                                                <div className="absolute top-0 right-0 p-4">
                                                    <div className="w-12 h-1 bg-primary/20 rounded-full" />
                                                </div>
                                                <div className="flex items-center justify-between mb-4">
                                                    <div className="w-32 h-3 bg-zinc-100 rounded-full" />
                                                    <div className="w-16 h-3 bg-zinc-50 rounded-full" />
                                                </div>
                                                <div className="flex items-end gap-3 h-24 mt-6">
                                                    {[40, 70, 45, 90, 65, 80, 55].map((h, i) => (
                                                        <motion.div
                                                            key={i}
                                                            initial={{ height: 0 }}
                                                            animate={{ height: `${h}%` }}
                                                            transition={{ delay: 1 + (i * 0.1), duration: 0.8 }}
                                                            className="flex-1 bg-primary/20 rounded-md group-hover/chart:bg-primary/40 transition-colors"
                                                        />
                                                    ))}
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-2 gap-6">
                                                <div className="h-32 bg-white rounded-2xl border border-zinc-200/80 p-5 shadow-sm">
                                                    <div className="size-8 rounded-xl bg-orange-100 flex items-center justify-center text-orange-600 mb-3">
                                                        <Clock size={16} />
                                                    </div>
                                                    <div className="w-20 h-4 bg-zinc-100 rounded-full" />
                                                </div>
                                                <div className="h-32 bg-white rounded-2xl border border-zinc-200/80 p-5 shadow-sm">
                                                    <div className="size-8 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-600 mb-3">
                                                        <Users size={16} />
                                                    </div>
                                                    <div className="w-20 h-4 bg-zinc-100 rounded-full" />
                                                </div>
                                            </div>
                                        </div>

                                        {/* Feedback/Sidebar Section */}
                                        <div className="col-span-4 space-y-4">
                                            <div className="h-full bg-zinc-950 p-6 rounded-3xl text-white shadow-2xl relative overflow-hidden animate-float">
                                                <div className="absolute top-[-20%] right-[-20%] size-32 bg-primary/30 rounded-full blur-2xl" />
                                                <p className="text-[10px] font-black uppercase tracking-widest text-primary/80 mb-4">Total Workforce</p>
                                                <p className="text-4xl font-black tracking-tighter mb-1">1,280</p>
                                                <p className="text-[10px] text-zinc-400 font-bold">+12% from last month</p>

                                                <div className="mt-12 pt-8 border-t border-white/10 flex flex-col gap-3">
                                                    <div className="flex items-center gap-3">
                                                        <div className="size-2 rounded-full bg-emerald-400" />
                                                        <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                                                            <div className="w-3/4 h-full bg-white/40" />
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-3">
                                                        <div className="size-2 rounded-full bg-primary/40" />
                                                        <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                                                            <div className="w-1/2 h-full bg-white/40" />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Floating Action Cards */}
                                <motion.div
                                    animate={{ y: [0, -10, 0] }}
                                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                                    className="absolute -top-6 -right-6 p-6 glass-card rounded-3xl border-white shadow-2xl z-20 hidden md:block"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="size-12 rounded-2xl bg-primary text-white flex items-center justify-center shadow-xl">
                                            <Calendar size={24} />
                                        </div>
                                        <div>
                                            <p className="text-xs font-black text-zinc-400 uppercase tracking-widest leading-none mb-1">Upcoming</p>
                                            <p className="text-sm font-black text-zinc-950">Team Offsite</p>
                                        </div>
                                    </div>
                                </motion.div>

                                <motion.div
                                    animate={{ y: [0, 10, 0] }}
                                    transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                                    className="absolute -bottom-4 -left-8 p-5 glass-card rounded-[2rem] border-white shadow-2xl z-20 flex items-center gap-3 hidden md:flex"
                                >
                                    <div className="size-10 rounded-full overflow-hidden border-2 border-primary shadow-lg bg-zinc-200" />
                                    <div>
                                        <p className="text-[10px] font-black text-primary uppercase leading-none mb-1">Approved</p>
                                        <p className="text-xs font-black text-zinc-900">Annual Leave</p>
                                    </div>
                                </motion.div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </section>
    );
}
