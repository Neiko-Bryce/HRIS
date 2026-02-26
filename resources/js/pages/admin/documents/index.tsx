import React, { useState, useMemo } from 'react';
import { Head, useForm } from '@inertiajs/react';
import { Download, FileText, Plus, Search, Trash2, X, Eye, Edit2 } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { cn } from '@/lib/utils';

interface User { id: number; name: string; }

interface Doc {
    id: number;
    user_id: number;
    title: string;
    type: string;
    file_path: string;
    expiry_date: string | null;
    notes: string | null;
    user: User;
}

export default function DocumentIndex({ documents, users }: { documents: Doc[]; users: User[] }) {
    const [isUploadOpen, setIsUploadOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [isViewOpen, setIsViewOpen] = useState(false);
    const [currentDoc, setCurrentDoc] = useState<Doc | null>(null);
    const [search, setSearch] = useState('');
    const [filePreview, setFilePreview] = useState<string | null>(null);
    const [userSearch, setUserSearch] = useState('');
    const [showUserResults, setShowUserResults] = useState(false);

    const { data, setData, post, put, delete: destroy, processing, reset, errors } = useForm({
        user_id: '',
        title: '',
        type: 'Contract',
        file: null as File | null,
        expiry_date: '',
        notes: '',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('admin.documents.store'), {
            onSuccess: () => {
                setIsUploadOpen(false);
                reset();
                setFilePreview(null);
                setUserSearch('');
                setShowUserResults(false);
            },
        });
    };

    const submitEdit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!currentDoc) return;
        put(route('admin.documents.update', currentDoc.id), {
            onSuccess: () => {
                setIsEditOpen(false);
                reset();
            },
        });
    };

    const handleDelete = () => {
        if (!currentDoc) return;
        destroy(route('admin.documents.destroy', currentDoc.id), {
            onSuccess: () => {
                setIsDeleteOpen(false);
                reset();
            }
        });
    };

    const openEdit = (doc: Doc) => {
        setCurrentDoc(doc);
        setData({
            user_id: '', // Not changing user
            title: doc.title,
            type: doc.type,
            file: null,
            expiry_date: doc.expiry_date || '',
            notes: doc.notes || '',
        });
        setIsEditOpen(true);
    };

    const filteredDocuments = documents.filter(d =>
        d.title.toLowerCase().includes(search.toLowerCase()) ||
        d.user.name.toLowerCase().includes(search.toLowerCase())
    );

    const filteredUsers = useMemo(() => {
        return users.filter(u => u.name.toLowerCase().includes(userSearch.toLowerCase()));
    }, [users, userSearch]);

    const groupedDocuments = useMemo(() => {
        const groups: Record<number, { user: User; docs: Doc[] }> = {};
        filteredDocuments.forEach(doc => {
            if (!groups[doc.user_id]) {
                groups[doc.user_id] = { user: doc.user, docs: [] };
            }
            groups[doc.user_id].docs.push(doc);
        });
        return groups;
    }, [filteredDocuments]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files ? e.target.files[0] : null;
        setData('file', file);
        if (file) {
            const url = URL.createObjectURL(file);
            setFilePreview(url);
        } else {
            setFilePreview(null);
        }
    };

    return (
        <AppLayout>
            <Head title="Document Management" />
            <div className="p-4 md:p-8">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 md:mb-8">
                    <div>
                        <h1 className="text-xl md:text-2xl font-black text-foreground tracking-tight">Electronic Information System</h1>
                        <p className="text-muted-foreground mt-1 text-xs md:text-sm font-medium italic opacity-80">Manage employee documents, contracts, and certifications.</p>
                    </div>
                    <div className="flex gap-2">
                        <Button className="rounded-xl bg-primary hover:bg-primary/90 text-white shadow-lg font-black uppercase tracking-widest text-xs h-11 px-6 group" onClick={() => { reset(); setFilePreview(null); setIsUploadOpen(true); }}>
                            <Plus size={16} className="mr-2 group-hover:rotate-90 transition-transform" /> Upload Document
                        </Button>
                    </div>
                </div>

                <div className="mb-6">
                    <div className="relative w-full">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                        <input type="text" placeholder="Search documents..." value={search} onChange={e => setSearch(e.target.value)}
                            className="w-full bg-card border border-border rounded-xl pl-10 h-10 md:h-12 text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all shadow-sm" />
                    </div>
                </div>

                <div className="space-y-8">
                    {/* Itemized Employee Sections */}
                    {Object.values(groupedDocuments).map(({ user, docs }) => (
                        <div key={user.id} className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden">
                            <div className="px-6 py-4 bg-muted/30 border-bottom border-border flex justify-between items-center">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-black border border-primary/20 uppercase">
                                        {user.name.charAt(0)}
                                    </div>
                                    <div>
                                        <h3 className="font-black text-foreground uppercase tracking-wider text-sm">{user.name}</h3>
                                        <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">{docs.length} Secured Documents</p>
                                    </div>
                                </div>
                                <Button variant="outline" size="sm" className="rounded-xl h-9 text-[10px] font-black uppercase tracking-widest gap-2 bg-background shadow-sm hover:bg-primary hover:text-white transition-all group" asChild>
                                    <a href={route('admin.documents.downloadAll', user.id)}>
                                        <Download size={12} className="group-hover:translate-y-0.5 transition-transform" /> Pro Download (ZIP)
                                    </a>
                                </Button>
                            </div>

                            <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {docs.map((doc) => (
                                    <div key={doc.id} className="bg-background border border-border rounded-xl p-4 relative group/item hover:border-primary/30 transition-all shadow-sm">
                                        <div className="flex justify-between items-start mb-4">
                                            <div className="p-2 rounded-lg bg-zinc-50 text-zinc-400 group-hover/item:text-primary transition-colors">
                                                <FileText size={18} />
                                            </div>
                                            <div className="flex gap-1 opacity-0 group-hover/item:opacity-100 transition-opacity">
                                                <Button variant="ghost" size="icon" className="h-7 w-7 text-zinc-400 hover:text-primary" asChild>
                                                    <a href={route('admin.documents.download', doc.id)}><Download size={12} /></a>
                                                </Button>
                                                <Button variant="ghost" size="icon" className="h-7 w-7 text-zinc-400 hover:text-primary" onClick={() => { setCurrentDoc(doc); setIsViewOpen(true); }}><Eye size={12} /></Button>
                                                <Button variant="ghost" size="icon" className="h-7 w-7 text-zinc-400 hover:text-primary" onClick={() => openEdit(doc)}><Edit2 size={12} /></Button>
                                                <Button variant="ghost" size="icon" className="h-7 w-7 text-zinc-400 hover:text-red-500" onClick={() => { setCurrentDoc(doc); setIsDeleteOpen(true); }}><Trash2 size={12} /></Button>
                                            </div>
                                        </div>
                                        <div>
                                            <p className="font-bold text-foreground text-sm leading-snug mb-1 truncate">{doc.title}</p>
                                            <div className="flex justify-between items-center">
                                                <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">{doc.type}</span>
                                                {doc.expiry_date && (
                                                    <span className="text-[9px] font-bold text-red-500 bg-red-50 px-1.5 py-0.5 rounded uppercase">Expiry: {doc.expiry_date}</span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}

                    {Object.keys(groupedDocuments).length === 0 && (
                        <div className="bg-card border border-dashed border-border rounded-2xl p-20 text-center">
                            <div className="mx-auto w-16 h-16 rounded-full bg-muted flex items-center justify-center text-muted-foreground mb-4 opacity-50"><FileText size={32} /></div>
                            <h3 className="text-lg font-black text-foreground uppercase tracking-wider">No Documents Found</h3>
                            <p className="text-muted-foreground text-xs font-medium mt-2">Try adjusting your search or upload a new record.</p>
                        </div>
                    )}
                </div>
            </div>

            <Dialog open={isUploadOpen} onOpenChange={setIsUploadOpen}>
                <DialogContent className="sm:max-w-[600px] bg-card border-border p-0 overflow-hidden shadow-2xl">
                    <form onSubmit={submit}>
                        <div className="p-6 pb-0">
                            <DialogHeader>
                                <DialogTitle className="text-xl font-black flex items-center gap-2 tracking-tight">
                                    <FileText className="text-primary" size={24} /> Upload Document
                                </DialogTitle>
                                <DialogDescription className="font-medium opacity-70">Attach new employment documentation.</DialogDescription>
                            </DialogHeader>
                        </div>
                        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6 overflow-y-auto max-h-[75vh]">
                            <div className="space-y-5">
                                <div className="space-y-2">
                                    <div className="space-y-2 relative">
                                        <div className="relative">
                                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={14} />
                                            <Input
                                                className={cn(
                                                    "rounded-xl pl-9 text-xs transition-all",
                                                    data.user_id ? "border-emerald-500 bg-emerald-50/50" : "border-zinc-200"
                                                )}
                                                placeholder="Type name to select employee..."
                                                value={userSearch}
                                                onChange={e => {
                                                    setUserSearch(e.target.value);
                                                    setShowUserResults(true);
                                                    if (data.user_id) setData('user_id', '');
                                                }}
                                                onFocus={() => setShowUserResults(true)}
                                            />
                                            {data.user_id && (
                                                <div className="absolute right-3 top-1/2 -translate-y-1/2 bg-emerald-500 text-white text-[8px] font-black px-1.5 py-0.5 rounded uppercase tracking-tighter">Selected</div>
                                            )}
                                        </div>

                                        {showUserResults && userSearch && !data.user_id && (
                                            <div className="absolute z-[60] left-0 right-0 mt-1 bg-card border border-border shadow-2xl rounded-xl overflow-hidden max-h-[220px] overflow-y-auto animate-in fade-in zoom-in-95 duration-200">
                                                {filteredUsers.map(u => (
                                                    <button
                                                        key={u.id}
                                                        type="button"
                                                        className="w-full px-4 py-3 text-left hover:bg-primary/5 flex items-center gap-3 border-b border-border/50 last:border-0 transition-colors group/user"
                                                        onClick={() => {
                                                            setData('user_id', u.id.toString());
                                                            setUserSearch(u.name);
                                                            setShowUserResults(false);
                                                        }}
                                                    >
                                                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary text-[10px] font-black uppercase group-hover/user:bg-primary group-hover/user:text-white transition-all">
                                                            {u.name.charAt(0)}
                                                        </div>
                                                        <div className="flex flex-col">
                                                            <span className="text-xs font-bold text-foreground">{u.name}</span>
                                                            <span className="text-[9px] text-muted-foreground font-medium uppercase tracking-tight">Active Member</span>
                                                        </div>
                                                    </button>
                                                ))}
                                                {filteredUsers.length === 0 && (
                                                    <div className="p-8 text-center bg-muted/20">
                                                        <Search className="mx-auto text-muted-foreground/30 mb-2" size={20} />
                                                        <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">No matching members</p>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                        {errors.user_id && <p className="text-[10px] text-red-500 font-bold">{errors.user_id}</p>}
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Document Identity</Label>
                                    <Input className="rounded-xl h-11 border-zinc-200 font-bold text-sm" value={data.title} onChange={e => setData('title', e.target.value)} placeholder="e.g. 2024 Performance Review" required />
                                    {errors.title && <p className="text-[10px] text-red-500 font-bold">{errors.title}</p>}
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Classification</Label>
                                        <Select value={data.type} onValueChange={val => setData('type', val)}>
                                            <SelectTrigger className="rounded-xl h-11 ring-0 focus:ring-0 font-bold text-xs border-zinc-200"><SelectValue /></SelectTrigger>
                                            <SelectContent className="rounded-xl">
                                                {['Contract', 'ID', 'Certification', 'Appraisal', 'Other'].map(t => (
                                                    <SelectItem key={t} value={t} className="text-xs font-bold">{t}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Expiry Date</Label>
                                        <Input className="rounded-xl h-11 border-zinc-200 text-xs font-bold" type="date" value={data.expiry_date} onChange={e => setData('expiry_date', e.target.value)} />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-5">
                                <div className="space-y-2">
                                    <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">File Attachment</Label>
                                    <div className={cn(
                                        "relative border-2 border-dashed border-zinc-200 rounded-2xl transition-all duration-300 group overflow-hidden",
                                        filePreview ? "aspect-[4/3] bg-zinc-50" : "aspect-square bg-zinc-50/50 hover:bg-zinc-50 hover:border-primary/50"
                                    )}>
                                        {!filePreview ? (
                                            <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
                                                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-3 group-hover:scale-110 transition-transform">
                                                    <Plus size={24} />
                                                </div>
                                                <p className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.15em]">Drop file or click</p>
                                                <p className="text-[9px] text-zinc-400 mt-1">PDF, JPG, PNG (Max 2MB)</p>
                                                <input type="file" onChange={handleFileChange} className="absolute inset-0 opacity-0 cursor-pointer" required />
                                            </div>
                                        ) : (
                                            <div className="absolute inset-0 flex flex-col">
                                                <div className="relative flex-1 bg-zinc-100 flex items-center justify-center overflow-hidden">
                                                    {data.file?.type.includes('image') ? (
                                                        <img src={filePreview} alt="Preview" className="w-full h-full object-cover" />
                                                    ) : (
                                                        <div className="flex flex-col items-center text-zinc-400">
                                                            <FileText size={48} className="mb-2" />
                                                            <p className="text-[10px] font-black uppercase">Document View</p>
                                                        </div>
                                                    )}
                                                    <Button
                                                        type="button"
                                                        variant="destructive"
                                                        size="icon"
                                                        className="absolute top-2 right-2 h-7 w-7 rounded-full shadow-lg"
                                                        onClick={() => { setData('file', null); setFilePreview(null); }}
                                                    >
                                                        <X size={14} />
                                                    </Button>
                                                </div>
                                                <div className="p-3 bg-white border-t border-zinc-100">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary border border-primary/5">
                                                            <Eye size={14} />
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <p className="text-[10px] font-bold text-zinc-900 truncate">{data.file?.name}</p>
                                                            <p className="text-[9px] text-zinc-400">{(data.file!.size / 1024 / 1024).toFixed(2)} MB</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                    {errors.file && <p className="text-[10px] text-red-500 font-bold">{errors.file}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Internal Notes</Label>
                                    <textarea
                                        className="w-full min-h-[100px] rounded-xl border border-zinc-200 bg-background p-3 text-xs font-medium focus:ring-2 focus:ring-primary/20 outline-none transition-all resize-none"
                                        value={data.notes}
                                        onChange={e => setData('notes', e.target.value)}
                                        placeholder="Private remarks..."
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="p-6 bg-muted/20 border-t border-border flex justify-end gap-3">
                            <Button type="button" variant="outline" className="rounded-xl px-6 h-11 text-xs font-bold" onClick={() => setIsUploadOpen(false)}>Cancel</Button>
                            <Button type="submit" disabled={processing} className="rounded-xl bg-primary hover:bg-primary/90 px-10 h-11 font-black text-xs uppercase tracking-widest shadow-md">
                                {processing ? 'Finalizing...' : 'Upload Data'}
                            </Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>
            <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
                <DialogContent className="sm:max-w-[500px] bg-card border-border p-0 overflow-hidden shadow-2xl">
                    <form onSubmit={submitEdit}>
                        <div className="p-6 pb-0">
                            <DialogHeader>
                                <DialogTitle className="text-xl font-black flex items-center gap-2"><Edit2 className="text-primary" size={24} /> Edit Document Details</DialogTitle>
                            </DialogHeader>
                        </div>
                        <div className="p-6 grid gap-4 max-h-[70vh] overflow-y-auto">
                            <div className="space-y-2"><Label>Document Title</Label><Input className="rounded-xl border-zinc-200" value={data.title} onChange={e => setData('title', e.target.value)} required /></div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2"><Label>Type</Label><Select value={data.type} onValueChange={val => setData('type', val)}><SelectTrigger className="rounded-xl"><SelectValue /></SelectTrigger><SelectContent className="rounded-xl">{['Contract', 'ID', 'Certification', 'Appraisal', 'Other'].map(t => (<SelectItem key={t} value={t} className="text-xs font-bold">{t}</SelectItem>))}</SelectContent></Select></div>
                                <div className="space-y-2"><Label>Expiry Date</Label><Input className="rounded-xl" type="date" value={data.expiry_date} onChange={e => setData('expiry_date', e.target.value)} /></div>
                            </div>
                            <div className="space-y-2"><Label>Internal Notes</Label><textarea className="w-full min-h-[100px] rounded-xl border border-zinc-200 bg-background p-3 text-xs font-medium focus:ring-2 focus:ring-primary/20 outline-none transition-all resize-none" value={data.notes} onChange={e => setData('notes', e.target.value)} /></div>
                        </div>
                        <div className="p-6 bg-muted/20 border-t border-border flex justify-end gap-3">
                            <Button type="button" variant="outline" className="rounded-xl px-6 h-11 text-xs font-bold" onClick={() => setIsEditOpen(false)}>Cancel</Button>
                            <Button type="submit" disabled={processing} className="rounded-xl bg-primary hover:bg-primary/90 px-10 h-11 font-black text-xs uppercase tracking-widest shadow-md">{processing ? 'Saving...' : 'Save Changes'}</Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>

            <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
                <DialogContent className="sm:max-w-[400px] bg-card border-border p-0 overflow-hidden shadow-2xl">
                    <div className="p-6 text-center">
                        <DialogHeader>
                            <div className="mx-auto w-16 h-16 rounded-full bg-red-100 flex items-center justify-center text-red-600 mb-4 animate-bounce"><Trash2 size={32} /></div>
                            <DialogTitle className="text-2xl font-black text-center mb-2">Delete Document?</DialogTitle>
                            <DialogDescription className="text-center font-medium">Are you sure you want to delete <strong>{currentDoc?.title}</strong>? This will permanently remove the record and the associated file.</DialogDescription>
                        </DialogHeader>
                    </div>
                    <div className="p-6 bg-muted/20 border-t border-border flex flex-col gap-2">
                        <Button type="button" disabled={processing} onClick={handleDelete} className="rounded-xl bg-red-600 hover:bg-red-700 h-12 font-black uppercase tracking-widest text-xs shadow-lg">{processing ? 'Deleting...' : 'CONFIRM DELETE'}</Button>
                        <Button type="button" variant="ghost" className="rounded-xl h-12 font-bold text-zinc-500" onClick={() => setIsDeleteOpen(false)}>No, Keep it</Button>
                    </div>
                </DialogContent>
            </Dialog>

            <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
                <DialogContent className="sm:max-w-[800px] bg-card border-border p-0 overflow-hidden shadow-2xl">
                    <div className="bg-zinc-900 flex justify-between items-center px-6 py-4">
                        <div><h3 className="text-white font-black uppercase tracking-[0.2em] text-xs">{currentDoc?.type}</h3><p className="text-zinc-400 text-[10px] font-bold mt-1 uppercase">{currentDoc?.title}</p></div>
                        <Button variant="ghost" size="icon" className="text-zinc-400 hover:text-white hover:bg-white/10" onClick={() => setIsViewOpen(false)}><X size={20} /></Button>
                    </div>
                    <div className="bg-zinc-800 flex items-center justify-center min-h-[400px] overflow-hidden">
                        {currentDoc && (
                            currentDoc.file_path.toLowerCase().match(/\.(jpg|jpeg|png|gif)$/) ? (
                                <img src={`/storage/${currentDoc.file_path}`} alt={currentDoc.title} className="max-w-full max-h-[70vh] object-contain" />
                            ) : (
                                <iframe src={`/storage/${currentDoc.file_path}`} title={currentDoc.title} className="w-full h-[70vh] border-none" />
                            )
                        )}
                    </div>
                    <div className="p-6 border-t border-border bg-card flex justify-between items-center">
                        <div className="flex gap-4">
                            <div><p className="text-[10px] font-black text-muted-foreground uppercase mb-1">Owner</p><p className="text-xs font-bold">{currentDoc?.user.name}</p></div>
                            <div><p className="text-[10px] font-black text-muted-foreground uppercase mb-1">Expiry</p><p className="text-xs font-bold text-red-500">{currentDoc?.expiry_date || 'No Expiry'}</p></div>
                        </div>
                        <Button variant="outline" className="rounded-xl gap-2 font-black" asChild><a href={route('admin.documents.download', currentDoc?.id || 0)}><Download size={14} /> Download Copy</a></Button>
                    </div>
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
}
