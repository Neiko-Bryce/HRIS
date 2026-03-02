import { type BreadcrumbItem, type SharedData } from '@/types';
import { Transition } from '@headlessui/react';
import { Head, useForm, usePage } from '@inertiajs/react';
import { FormEventHandler, useRef, useState } from 'react';
import { Camera, MapPin, Phone, User as UserIcon, Briefcase, Building2, Fingerprint, Palette, Lock, Eye, EyeOff } from 'lucide-react';

import DeleteUser from '@/components/delete-user';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import SettingsLayout from '@/layouts/settings/layout';
import AppearanceToggleTab from '@/components/appearance-tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Settings',
        href: '/settings/profile',
    },
];

export default function Profile() {
    const { auth } = usePage<SharedData>().props;
    const [photoPreview, setPhotoPreview] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const passwordInput = useRef<HTMLInputElement>(null);
    const currentPasswordInput = useRef<HTMLInputElement>(null);
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);

    // Profile Form
    const profileForm = useForm({
        _method: 'PATCH',
        name: auth.user.name,
        email: auth.user.email,
        contact_number: auth.user.employee?.contact_number || '',
        address: auth.user.employee?.address || '',
        photo: null as File | null,
    });

    // Password Form
    const passwordForm = useForm({
        current_password: '',
        password: '',
        password_confirmation: '',
    });

    const submitProfile: FormEventHandler = (e) => {
        e.preventDefault();
        profileForm.post(route('profile.update'), {
            forceFormData: true,
            onSuccess: () => {
                setPhotoPreview(null);
                if (fileInputRef.current) fileInputRef.current.value = '';
            },
        });
    };

    const submitPassword: FormEventHandler = (e) => {
        e.preventDefault();
        passwordForm.put(route('password.update'), {
            preserveScroll: true,
            onSuccess: () => passwordForm.reset(),
            onError: (errors) => {
                if (errors.password) {
                    passwordForm.reset('password', 'password_confirmation');
                    passwordInput.current?.focus();
                }
                if (errors.current_password) {
                    passwordForm.reset('current_password');
                    currentPasswordInput.current?.focus();
                }
            },
        });
    };

    const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            profileForm.setData('photo', file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setPhotoPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Account Settings" />

            <SettingsLayout>
                <div className="space-y-10 md:space-y-16 pb-20">
                    <form onSubmit={submitProfile} className="space-y-10 md:space-y-16">
                        {/* Profile Photo Section (Modern B&W) */}
                        <div className="bg-zinc-950/5 dark:bg-zinc-900/50 rounded-3xl border border-zinc-200 dark:border-zinc-800 p-5 md:p-10 overflow-hidden relative">
                            <div className="absolute top-0 left-0 w-full h-20 md:h-32 bg-linear-to-r from-foreground/5 to-transparent" />

                            <div className="relative flex flex-col sm:flex-row items-center sm:items-end gap-5 md:gap-10 pt-2 md:pt-4 text-center sm:text-left">
                                <div className="relative group">
                                    <Avatar className="w-24 h-24 md:w-40 md:h-40 border-4 md:border-8 border-white dark:border-zinc-900 shadow-xl md:shadow-2xl">
                                        <AvatarImage src={photoPreview || auth.user.avatar || ''} className="object-cover" />
                                        <AvatarFallback className="bg-zinc-100 dark:bg-zinc-800 text-foreground text-2xl md:text-4xl font-black">
                                            {auth.user.name.charAt(0)}
                                        </AvatarFallback>
                                    </Avatar>
                                    <button
                                        type="button"
                                        onClick={() => fileInputRef.current?.click()}
                                        className="absolute bottom-0 right-0 md:bottom-2 md:right-2 bg-foreground text-background p-1.5 md:p-3 rounded-full shadow-lg hover:scale-110 active:scale-95 transition-all flex items-center justify-center border-2 md:border-4 border-white dark:border-zinc-900"
                                    >
                                        <Camera size={14} className="md:size-5" />
                                    </button>
                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        className="hidden"
                                        accept="image/*"
                                        onChange={handlePhotoChange}
                                    />
                                </div>
                                <div className="flex-1 space-y-1 md:space-y-2 mb-1 md:mb-4">
                                    <h3 className="text-xl md:text-3xl font-black text-foreground tracking-tight">{auth.user.name}</h3>
                                    <p className="text-xs md:text-base text-muted-foreground flex items-center justify-center sm:justify-start gap-1.5 font-medium">
                                        <Briefcase size={14} className="md:size-4 text-foreground/40" /> {auth.user.employee?.position || 'No Position'}
                                    </p>
                                    <div className="flex items-center justify-center sm:justify-start gap-2 mt-2 md:mt-3">
                                        <span className="text-[8px] md:text-[10px] text-foreground font-black uppercase tracking-[0.2em] md:tracking-[0.3em] bg-foreground/10 dark:bg-foreground/20 px-2.5 md:px-4 py-1 md:py-1.5 rounded-full">
                                            {auth.user.primary_role}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 md:gap-16">
                            {/* Personal Info Section */}
                            <div className="lg:col-span-12 space-y-8 md:space-y-12">
                                <div className="flex items-center gap-4 border-b border-zinc-200 dark:border-zinc-800 pb-3 md:pb-4">
                                    <div className="p-2 md:p-3 bg-foreground/5 rounded-xl md:rounded-2xl text-foreground">
                                        <UserIcon size={18} className="md:size-6" />
                                    </div>
                                    <div>
                                        <h4 className="font-black text-[10px] md:text-sm uppercase tracking-[0.2em] text-foreground">Personal Information</h4>
                                        <p className="hidden xs:block text-[9px] md:text-xs text-muted-foreground font-medium">Update your name, contact, and address details.</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-6 md:gap-y-10">
                                    <div className="grid gap-2 md:gap-3">
                                        <Label htmlFor="name" className="text-[10px] md:text-[11px] uppercase font-black text-muted-foreground ml-1 tracking-widest">Full Name</Label>
                                        <Input
                                            id="name"
                                            value={profileForm.data.name}
                                            onChange={(e) => profileForm.setData('name', e.target.value)}
                                            required
                                            className="h-12 md:h-14 bg-white dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800 focus:ring-foreground transition-all rounded-xl text-sm md:text-base px-4 md:px-5"
                                        />
                                        <InputError message={profileForm.errors.name} />
                                    </div>

                                    <div className="grid gap-2 md:gap-3">
                                        <Label htmlFor="email" className="text-[10px] md:text-[11px] uppercase font-black text-muted-foreground ml-1 tracking-widest">Email address</Label>
                                        <Input
                                            id="email"
                                            type="email"
                                            value={profileForm.data.email}
                                            onChange={(e) => profileForm.setData('email', e.target.value)}
                                            required
                                            className="h-12 md:h-14 bg-white dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800 focus:ring-foreground transition-all rounded-xl text-sm md:text-base px-4 md:px-5"
                                        />
                                        <InputError message={profileForm.errors.email} />
                                    </div>

                                    <div className="grid gap-2 md:gap-3">
                                        <Label htmlFor="contact_number" className="text-[10px] md:text-[11px] uppercase font-black text-muted-foreground ml-1 tracking-widest">Contact Number</Label>
                                        <div className="relative">
                                            <Phone size={16} className="md:size-5 absolute left-4 md:left-5 top-1/2 -translate-y-1/2 text-muted-foreground/30 pointer-events-none" />
                                            <Input
                                                id="contact_number"
                                                value={profileForm.data.contact_number}
                                                onChange={(e) => profileForm.setData('contact_number', e.target.value)}
                                                className="h-12 md:h-14 pl-12 md:pl-14 bg-white dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800 focus:ring-foreground transition-all rounded-xl text-sm md:text-base w-full"
                                            />
                                        </div>
                                        <InputError message={profileForm.errors.contact_number} />
                                    </div>

                                    <div className="grid gap-2 md:gap-3">
                                        <Label htmlFor="address" className="text-[10px] md:text-[11px] uppercase font-black text-muted-foreground ml-1 tracking-widest">Home Address</Label>
                                        <div className="relative">
                                            <MapPin size={16} className="md:size-5 absolute left-4 md:left-5 top-5 text-muted-foreground/30 pointer-events-none" />
                                            <Textarea
                                                id="address"
                                                value={profileForm.data.address}
                                                onChange={(e) => profileForm.setData('address', e.target.value)}
                                                className="pl-12 md:pl-14 min-h-[100px] md:min-h-[120px] bg-white dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800 focus:ring-foreground transition-all rounded-xl text-sm md:text-base py-4 md:py-5 resize-none"
                                            />
                                        </div>
                                        <InputError message={profileForm.errors.address} />
                                    </div>
                                </div>

                                <div className="flex justify-center sm:justify-end pt-2">
                                    <Button disabled={profileForm.processing} size="lg" className="h-12 md:h-14 px-8 md:px-12 font-black rounded-xl text-sm md:text-base border-2 border-foreground hover:bg-transparent hover:text-foreground transition-all w-full sm:w-auto">
                                        {profileForm.processing ? 'Saving...' : 'Save Profile Changes'}
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </form>

                    {/* Security & Password Section */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 md:gap-16 pt-10 md:pt-16 border-t border-zinc-200 dark:border-zinc-800">
                        <div className="lg:col-span-7 space-y-8 md:space-y-10">
                            <div className="flex items-center gap-4 border-b border-zinc-200 dark:border-zinc-800 pb-4">
                                <div className="p-2.5 md:p-3 bg-foreground/5 rounded-xl md:rounded-2xl text-foreground">
                                    <Lock size={20} className="md:size-6" />
                                </div>
                                <div>
                                    <h4 className="font-black text-xs md:text-sm uppercase tracking-[0.2em] text-foreground">Security & Password</h4>
                                    <p className="hidden xs:block text-[10px] md:text-xs text-muted-foreground font-medium">Update your password to keep your account secure.</p>
                                </div>
                            </div>

                            <form onSubmit={submitPassword} className="space-y-6 md:space-y-8">
                                <div className="grid gap-6">
                                    <div className="grid gap-2 md:gap-3">
                                        <Label htmlFor="current_password" className="text-[10px] md:text-[11px] uppercase font-black text-muted-foreground ml-1 tracking-widest">Current Password</Label>
                                        <div className="relative flex items-center">
                                            <Input
                                                id="current_password"
                                                name="current_password"
                                                autoComplete="current-password"
                                                ref={currentPasswordInput}
                                                value={passwordForm.data.current_password}
                                                onChange={(e) => passwordForm.setData('current_password', e.target.value)}
                                                type={showCurrentPassword ? 'text' : 'password'}
                                                className="h-12 md:h-14 bg-white dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800 focus:ring-foreground transition-all rounded-xl text-sm md:text-base px-4 md:px-5 pr-12 md:pr-14 w-full"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                                className="absolute right-4 md:right-5 text-muted-foreground/50 hover:text-foreground transition-colors p-2"
                                            >
                                                {showCurrentPassword ? <Eye size={18} className="md:size-5" /> : <EyeOff size={18} className="md:size-5" />}
                                            </button>
                                        </div>
                                        <InputError message={passwordForm.errors.current_password} />
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                                        <div className="grid gap-2 md:gap-3">
                                            <Label htmlFor="password" className="text-[10px] md:text-[11px] uppercase font-black text-muted-foreground ml-1 tracking-widest">New Password</Label>
                                            <Input
                                                id="password"
                                                name="password"
                                                autoComplete="new-password"
                                                ref={passwordInput}
                                                value={passwordForm.data.password}
                                                onChange={(e) => passwordForm.setData('password', e.target.value)}
                                                type="password"
                                                className="h-12 md:h-14 bg-white dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800 focus:ring-foreground transition-all rounded-xl text-sm md:text-base px-4 md:px-5 w-full"
                                            />
                                            <InputError message={passwordForm.errors.password} />
                                        </div>
                                        <div className="grid gap-2 md:gap-3">
                                            <Label htmlFor="password_confirmation" className="text-[10px] md:text-[11px] uppercase font-black text-muted-foreground ml-1 tracking-widest">Confirm Password</Label>
                                            <Input
                                                id="password_confirmation"
                                                name="password_confirmation"
                                                autoComplete="new-password"
                                                value={passwordForm.data.password_confirmation}
                                                onChange={(e) => passwordForm.setData('password_confirmation', e.target.value)}
                                                type="password"
                                                className="h-12 md:h-14 bg-white dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800 focus:ring-foreground transition-all rounded-xl text-sm md:text-base px-4 md:px-5 w-full"
                                            />
                                            <InputError message={passwordForm.errors.password_confirmation} />
                                        </div>
                                    </div>
                                </div>

                                <div className="flex flex-col sm:flex-row items-center gap-4 md:gap-6">
                                    <Button disabled={passwordForm.processing} variant="outline" className="h-12 md:h-14 px-8 md:px-12 font-black rounded-xl text-sm md:text-base border-2 border-foreground hover:bg-foreground hover:text-background transition-all w-full sm:w-auto">
                                        {passwordForm.processing ? 'Updating...' : 'Update Password'}
                                    </Button>
                                    <Transition
                                        show={passwordForm.recentlySuccessful}
                                        enter="transition ease-in-out"
                                        enterFrom="opacity-0"
                                        leave="transition ease-in-out"
                                        leaveTo="opacity-0"
                                    >
                                        <p className="text-xs md:text-sm font-bold text-green-600">Password updated!</p>
                                    </Transition>
                                </div>
                            </form>
                        </div>

                        {/* Preferences & Professional in Security Column */}
                        <div className="lg:col-span-5 space-y-10 md:space-y-12">
                            {/* Appearance Preferences */}
                            <div className="space-y-6">
                                <div className="flex items-center gap-4 border-b border-zinc-200 dark:border-zinc-800 pb-4">
                                    <div className="p-2.5 md:p-3 bg-foreground/5 rounded-xl md:rounded-2xl text-foreground">
                                        <Palette size={20} className="md:size-6" />
                                    </div>
                                    <h4 className="font-black text-xs md:text-sm uppercase tracking-[0.2em] text-foreground">Theme Settings</h4>
                                </div>
                                <div className="p-6 md:p-8 rounded-2xl md:rounded-3xl bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 space-y-4 md:space-y-6 text-center sm:text-left">
                                    <p className="text-[9px] md:text-[10px] text-muted-foreground font-black uppercase tracking-widest leading-relaxed">System Appearance</p>
                                    <AppearanceToggleTab className="w-full flex" />
                                </div>
                            </div>

                            {/* Professional Info */}
                            <div className="space-y-6">
                                <div className="flex items-center gap-4 border-b border-zinc-200 dark:border-zinc-800 pb-4">
                                    <div className="p-2.5 md:p-3 bg-foreground/5 rounded-xl md:rounded-2xl text-foreground">
                                        <Briefcase size={20} className="md:size-6" />
                                    </div>
                                    <h4 className="font-black text-xs md:text-sm uppercase tracking-[0.2em] text-foreground">Professional Info</h4>
                                </div>

                                <div className="grid grid-cols-1 gap-4 md:gap-6">
                                    <div className="space-y-2 md:space-y-3">
                                        <Label className="text-[9px] md:text-[10px] uppercase font-black text-muted-foreground ml-1 tracking-widest">Office / Department</Label>
                                        <div className="flex items-center gap-3 md:gap-4 h-12 md:h-14 px-4 md:px-6 bg-zinc-50 dark:bg-zinc-900/30 rounded-xl md:rounded-2xl border border-dashed border-zinc-300 dark:border-zinc-800">
                                            <Building2 size={16} className="md:size-5 text-foreground/30" />
                                            <span className="text-xs md:text-sm font-black text-foreground truncate">{auth.user.employee?.department_name || '---'}</span>
                                        </div>
                                    </div>
                                    <div className="space-y-2 md:space-y-3">
                                        <Label className="text-[9px] md:text-[10px] uppercase font-black text-muted-foreground ml-1 tracking-widest">Employee Unique ID</Label>
                                        <div className="flex items-center gap-3 md:gap-4 h-12 md:h-14 px-4 md:px-6 bg-zinc-50 dark:bg-zinc-900/30 rounded-xl md:rounded-2xl border border-dashed border-zinc-300 dark:border-zinc-800">
                                            <Fingerprint size={16} className="md:size-5 text-foreground/30" />
                                            <span className="text-xs md:text-sm font-mono font-black text-foreground tracking-tight">{auth.user.employee?.employee_id || '---'}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Footer Actions */}
                    <div className="border-t border-zinc-200 dark:border-zinc-800 pt-10 md:pt-16 flex flex-col md:flex-row items-center justify-between gap-6 md:gap-8">
                        <div className="max-w-md text-center md:text-left space-y-1">
                            <h5 className="font-black text-base md:text-lg text-foreground uppercase tracking-widest">Danger Zone</h5>
                            <p className="text-[10px] md:text-sm text-muted-foreground font-medium">Deleting your account is permanent. All your data will be removed from our systems.</p>
                        </div>
                        <DeleteUser />
                    </div>
                </div>
            </SettingsLayout>
        </AppLayout>
    );
}
