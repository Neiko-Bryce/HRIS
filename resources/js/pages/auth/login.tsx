import { Head, useForm } from '@inertiajs/react';
import { LoaderCircle, Mail, Lock, Eye, EyeOff, LogIn } from 'lucide-react';
import { FormEventHandler, useState } from 'react';

import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import AuthLayout from '@/layouts/auth-layout';

interface LoginForm {
    email: string;
    password: string;
    remember: boolean;
}

interface LoginProps {
    status?: string;
    canResetPassword: boolean;
}

export default function Login({ status, canResetPassword }: LoginProps) {
    const { data, setData, post, processing, errors, reset } = useForm<LoginForm>({
        email: '',
        password: '',
        remember: false,
    });

    const [showPassword, setShowPassword] = useState(false);

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <AuthLayout title="Log in to your account" description="Sign in to access your dashboard">
            <Head title="Log in" />

            {status && (
                <div className="mb-4 text-center text-sm font-medium text-emerald-600">{status}</div>
            )}

            <form className="flex flex-col gap-5" onSubmit={submit}>

                {/* Email */}
                <div className="grid gap-1.5">
                    <Label htmlFor="email" className="text-sm font-bold text-zinc-700">
                        Email Address
                    </Label>
                    <div className="relative">
                        <span className="pointer-events-none absolute inset-y-0 left-3.5 flex items-center text-zinc-400">
                            <Mail size={15} />
                        </span>
                        <input
                            id="email"
                            type="email"
                            required
                            autoFocus
                            tabIndex={1}
                            autoComplete="email"
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                            placeholder="Enter your email address"
                            className="w-full rounded-xl border border-zinc-200 bg-zinc-50 pl-10 pr-4 py-3 text-sm text-zinc-900 placeholder-zinc-400 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                        />
                    </div>
                    <InputError message={errors.email} />
                </div>

                {/* Password */}
                <div className="grid gap-1.5">
                    <div className="flex items-center justify-between">
                        <Label htmlFor="password" className="text-sm font-bold text-zinc-700">
                            Password
                        </Label>
                        {canResetPassword && (
                            <TextLink
                                href={route('password.request')}
                                className="text-xs font-semibold text-primary hover:underline"
                                tabIndex={5}
                            >
                                Forgot password?
                            </TextLink>
                        )}
                    </div>
                    <div className="relative">
                        <span className="pointer-events-none absolute inset-y-0 left-3.5 flex items-center text-zinc-400">
                            <Lock size={15} />
                        </span>
                        <input
                            id="password"
                            type={showPassword ? 'text' : 'password'}
                            required
                            tabIndex={2}
                            autoComplete="current-password"
                            value={data.password}
                            onChange={(e) => setData('password', e.target.value)}
                            placeholder="Enter your password"
                            className="w-full rounded-xl border border-zinc-200 bg-zinc-50 pl-10 pr-11 py-3 text-sm text-zinc-900 placeholder-zinc-400 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                        />
                        <button
                            type="button"
                            tabIndex={-1}
                            onClick={() => setShowPassword((v) => !v)}
                            className="absolute inset-y-0 right-3.5 flex items-center text-zinc-400 hover:text-zinc-600 transition-colors"
                        >
                            {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                        </button>
                    </div>
                    <InputError message={errors.password} />
                </div>

                {/* Remember me */}
                <div className="flex items-center gap-2.5">
                    <Checkbox
                        id="remember"
                        name="remember"
                        tabIndex={3}
                        checked={data.remember}
                        onCheckedChange={(checked) => setData('remember', !!checked)}
                    />
                    <Label htmlFor="remember" className="text-sm font-medium text-zinc-600 cursor-pointer">
                        Remember me
                    </Label>
                </div>

                {/* Submit */}
                <button
                    type="submit"
                    tabIndex={4}
                    disabled={processing}
                    className="mt-1 w-full inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3.5 text-sm font-black text-white shadow-md transition-all hover:bg-primary/90 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
                >
                    {processing
                        ? <LoaderCircle size={16} className="animate-spin" />
                        : <LogIn size={16} />
                    }
                    Sign In
                </button>

                {/* Sign up link */}
                <p className="text-center text-sm text-zinc-400">
                    Don't have an account?{' '}
                    <TextLink href={route('register')} tabIndex={5} className="font-bold text-primary hover:underline">
                        Sign up
                    </TextLink>
                </p>
            </form>
        </AuthLayout>
    );
}
