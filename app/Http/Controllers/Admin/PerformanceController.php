<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\PerformanceReview;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class PerformanceController extends Controller
{
    public function index()
    {
        $user = Auth::user();
        $isSuperAdminOrHr = $user->hasRole(['Super Administrator', 'HR Administrator']);
        $isHead = $user->hasRole('Head Employee');

        $reviewsQuery = PerformanceReview::with(['user.employee', 'reviewer'])->latest();
        $usersQuery = User::whereHas('roles', function ($q) {
            $q->where('name', 'Employee');
        })->with('employee.departmentRelation');

        if ($isHead && ! $isSuperAdminOrHr) {
            $departmentId = $user->employee->departmentRelation->id ?? null;
            if ($departmentId) {
                // Head sees employees in their department
                $usersQuery->whereHas('employee', function ($q) use ($departmentId) {
                    $q->where('department_id', $departmentId);
                });
                // Head sees reviews for employees in their department
                $reviewsQuery->whereHas('user.employee', function ($q) use ($departmentId) {
                    $q->where('department_id', $departmentId);
                });
            } else {
                $usersQuery->where('id', '<', 0);
                $reviewsQuery->where('id', '<', 0);
            }
        }

        return Inertia::render('admin/performance/index', [
            'reviews' => $reviewsQuery->get(),
            'users' => $usersQuery->get(),
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'user_id' => 'required|exists:users,id',
            'review_period' => 'required|string|max:50',
            'rating' => 'required|integer|min:1|max:5',
            'comments' => 'nullable|string',
        ]);

        PerformanceReview::create([
            'user_id' => $request->user_id,
            'reviewer_id' => Auth::id(),
            'review_period' => $request->review_period,
            'rating' => $request->rating,
            'comments' => $request->comments,
        ]);

        return redirect()->route('admin.performance.index')->with('success', 'Performance review submitted.');
    }

    public function update(Request $request, PerformanceReview $performance)
    {
        $request->validate([
            'review_period' => 'required|string|max:50',
            'rating' => 'required|integer|min:1|max:5',
            'comments' => 'nullable|string',
        ]);

        $performance->update([
            'review_period' => $request->review_period,
            'rating' => $request->rating,
            'comments' => $request->comments,
        ]);

        return redirect()->route('admin.performance.index')->with('success', 'Performance review updated.');
    }

    public function destroy(PerformanceReview $performance)
    {
        $performance->delete();

        return redirect()->route('admin.performance.index')->with('success', 'Performance review deleted.');
    }
}
