import { useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Plus, Star, Search, Edit2, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

interface PerformanceReview {
    id: number;
    user_id: number;
    reviewer_id: number;
    review_period: string;
    rating: number;
    comments: string;
    user?: { name: string; employee?: { position: string } };
    reviewer?: { name: string };
}

interface PerformanceUser {
    id: number;
    name: string;
    employee?: { position: string; department_relation?: { name: string } };
}

export default function PerformanceIndex({ reviews, users }: { reviews: PerformanceReview[], users: PerformanceUser[] }) {
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [editingReview, setEditingReview] = useState<PerformanceReview | null>(null);
    const [searchQuery, setSearchQuery] = useState('');

    const { data: addData, setData: setAddData, post: postAdd, reset: resetAdd, errors: addErrors, processing: adding } = useForm({
        user_id: '',
        review_period: '',
        rating: '',
        comments: '',
    });

    const { data: editData, setData: setEditData, put: putEdit, errors: editErrors, processing: editing } = useForm({
        review_period: '',
        rating: '',
        comments: '',
    });

    const { delete: destroy, processing: deleting } = useForm();

    const getRatingColor = (rating: number) => {
        if (rating >= 4) return 'bg-yellow-400';
        if (rating >= 3) return 'bg-yellow-300';
        return 'bg-yellow-200';
    };

    const getRatingLabel = (rating: number) => {
        if (rating === 5) return 'Excellent';
        if (rating === 4) return 'Very Good';
        if (rating === 3) return 'Good';
        if (rating === 2) return 'Fair';
        return 'Poor';
    };
    const openAddModal = () => {
        resetAdd();
        setIsAddModalOpen(true);
    };

    const submitAdd = (e: React.FormEvent) => {
        e.preventDefault();
        postAdd(route('admin.performance.store'), {
            onSuccess: () => {
                setIsAddModalOpen(false);
                resetAdd();
                toast.success('Performance review added successfully.');
            },
            onError: () => {
                toast.error('Please check the form for errors.');
            }
        });
    };

    const handleEdit = (review: PerformanceReview) => {
        setEditingReview(review);
        setEditData({
            review_period: review.review_period,
            rating: review.rating.toString(),
            comments: review.comments || '',
        });
        setIsEditModalOpen(true);
    };

    const submitEdit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingReview) return;
        putEdit(route('admin.performance.update', editingReview.id), {
            onSuccess: () => {
                setIsEditModalOpen(false);
                toast.success('Performance review updated successfully.');
            },
        });
    };

    const openDeleteModal = (review: PerformanceReview) => {
        setEditingReview(review);
        setIsDeleteModalOpen(true);
    };

    const submitDelete = () => {
        if (!editingReview) return;
        destroy(route('admin.performance.destroy', editingReview.id), {
            onSuccess: () => {
                setIsDeleteModalOpen(false);
                toast.success('Review deleted successfully.');
            }
        });
    };

    const filteredReviews = reviews.filter((r: PerformanceReview) =>
        r.user?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.review_period?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <AppLayout>
            <Head title="Performance Monitoring" />

            <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-black text-foreground tracking-tight">Performance Monitoring</h1>
                        <p className="text-muted-foreground text-sm font-1 mt-1">
                            Evaluate and manage employee performance reviews.
                        </p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search employees..."
                                className="pl-9 w-full sm:w-[250px] bg-background"
                                value={searchQuery}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <Button onClick={openAddModal} className="flex gap-2">
                            <Plus size={16} /> New Review
                        </Button>
                    </div>
                </div>

                <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-muted/50 text-xs uppercase font-black tracking-wider text-muted-foreground">
                                <tr>
                                    <th className="px-6 py-4 rounded-tl-xl border-b border-border">Employee</th>
                                    <th className="px-6 py-4 border-b border-border">Period</th>
                                    <th className="px-6 py-4 border-b border-border">Rating</th>
                                    <th className="px-6 py-4 border-b border-border">Reviewer</th>
                                    <th className="px-6 py-4 border-b border-border text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                                {filteredReviews.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-12 text-center text-muted-foreground">
                                            <Star className="mx-auto h-8 w-8 mb-3 opacity-20" />
                                            <p className="font-medium">No performance reviews found</p>
                                        </td>
                                    </tr>
                                ) : (
                                    filteredReviews.map((review: PerformanceReview) => (
                                        <tr key={review.id} className="hover:bg-muted/30 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="font-bold text-foreground">{review.user?.name}</div>
                                                <div className="text-xs text-muted-foreground">{review.user?.employee?.position || 'N/A'}</div>
                                            </td>
                                            <td className="px-6 py-4 font-medium">
                                                {review.review_period}
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    <div className="flex items-center gap-0.5">
                                                        {Array.from({ length: 5 }).map((_, i) => (
                                                            <Star
                                                                key={i}
                                                                size={12}
                                                                className={i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground/20"}
                                                            />
                                                        ))}
                                                    </div>
                                                    <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded ${getRatingColor(review.rating).replace('bg-', 'bg-')}/10 ${getRatingColor(review.rating).replace('bg-', 'text-')}`}>
                                                        {getRatingLabel(review.rating)}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-muted-foreground">
                                                {review.reviewer?.name}
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg" onClick={() => handleEdit(review)}>
                                                        <Edit2 size={14} className="text-blue-500" />
                                                    </Button>
                                                    <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg" onClick={() => openDeleteModal(review)}>
                                                        <Trash2 size={14} className="text-red-500" />
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Add Review Modal */}
            <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle className="font-black text-xl">New Performance Review</DialogTitle>
                        <DialogDescription>Submit a new review for an employee.</DialogDescription>
                    </DialogHeader>
                    <form onSubmit={submitAdd} className="space-y-4 pt-4">
                        <div className="space-y-2">
                            <Label htmlFor="user_id" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Employee</Label>
                            <Select value={addData.user_id} onValueChange={(v) => setAddData('user_id', v)}>
                                <SelectTrigger className="h-11">
                                    <SelectValue placeholder="Select employee" />
                                </SelectTrigger>
                                <SelectContent>
                                    {users.map((user: PerformanceUser) => (
                                        <SelectItem key={user.id} value={user.id.toString()}>
                                            {user.name} ({user.employee?.department_relation?.name || 'No Dept'})
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {addErrors.user_id && <p className="text-sm text-red-500">{addErrors.user_id}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="review_period" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Review Period</Label>
                            <Input
                                id="review_period"
                                placeholder="e.g. Q1 2026 or Annual 2026"
                                className="h-11"
                                value={addData.review_period}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAddData('review_period', e.target.value)}
                            />
                            {addErrors.review_period && <p className="text-sm text-red-500">{addErrors.review_period}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="rating" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Rating (1 to 5)</Label>
                            <Select value={addData.rating} onValueChange={(v) => setAddData('rating', v)}>
                                <SelectTrigger className="h-11">
                                    <SelectValue placeholder="Select rating" />
                                </SelectTrigger>
                                <SelectContent>
                                    {[1, 2, 3, 4, 5].map((num) => (
                                        <SelectItem key={num} value={num.toString()}>
                                            {num} - {num === 5 ? 'Excellent' : num === 1 ? 'Poor' : 'Rating'}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {addErrors.rating && <p className="text-sm text-red-500">{addErrors.rating}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="comments" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Comments</Label>
                            <Textarea
                                id="comments"
                                placeholder="General feedback and remarks..."
                                className="min-h-[100px] resize-none"
                                value={addData.comments}
                                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setAddData('comments', e.target.value)}
                            />
                            {addErrors.comments && <p className="text-sm text-red-500">{addErrors.comments}</p>}
                        </div>

                        <DialogFooter className="pt-4 border-t border-border">
                            <Button type="button" variant="outline" onClick={() => setIsAddModalOpen(false)}>Cancel</Button>
                            <Button type="submit" disabled={adding}>Submit Review</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Edit Review Modal */}
            <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle className="font-black text-xl">Edit Review</DialogTitle>
                        <DialogDescription>Update performance details for {editingReview?.user?.name}.</DialogDescription>
                    </DialogHeader>
                    <form onSubmit={submitEdit} className="space-y-4 pt-4">
                        <div className="space-y-2">
                            <Label htmlFor="edit_review_period" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Review Period</Label>
                            <Input
                                id="edit_review_period"
                                className="h-11"
                                value={editData.review_period}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEditData('review_period', e.target.value)}
                            />
                            {editErrors.review_period && <p className="text-sm text-red-500">{editErrors.review_period}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="edit_rating" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Rating</Label>
                            <Select value={editData.rating} onValueChange={(v) => setEditData('rating', v)}>
                                <SelectTrigger className="h-11">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {[1, 2, 3, 4, 5].map((num) => (
                                        <SelectItem key={num} value={num.toString()}>
                                            {num}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {editErrors.rating && <p className="text-sm text-red-500">{editErrors.rating}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="edit_comments" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Comments</Label>
                            <Textarea
                                id="edit_comments"
                                className="min-h-[100px] resize-none"
                                value={editData.comments}
                                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setEditData('comments', e.target.value)}
                            />
                            {editErrors.comments && <p className="text-sm text-red-500">{editErrors.comments}</p>}
                        </div>

                        <DialogFooter className="pt-4 border-t border-border">
                            <Button type="button" variant="outline" onClick={() => setIsEditModalOpen(false)}>Cancel</Button>
                            <Button type="submit" disabled={editing}>Save Changes</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Delete Review Modal */}
            <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle className="font-black text-xl text-red-600">Delete Review</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete the performance review for {editingReview?.user?.name} ({editingReview?.review_period})? This cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="mt-6">
                        <Button variant="outline" onClick={() => setIsDeleteModalOpen(false)}>Cancel</Button>
                        <Button variant="destructive" onClick={submitDelete} disabled={deleting}>Delete</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
}
