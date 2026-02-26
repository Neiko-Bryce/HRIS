<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\LeaveRequest;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class LeaveController extends Controller
{
    public function index()
    {
        $leaves = LeaveRequest::with(['user.employee', 'reviewer'])->latest()->get();
        $users = User::with('employee')->get();

        return Inertia::render('admin/leaves/index', [
            'leaves' => $leaves,
            'users' => $users,
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'user_id' => 'required|exists:users,id',
            'type' => 'required|in:sick,vacation,emergency,maternity,paternity',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after_or_equal:start_date',
            'reason' => 'required|string',
        ]);

        $startDate = Carbon::parse($request->start_date);
        $endDate = Carbon::parse($request->end_date);
        $totalDays = $startDate->diffInDays($endDate) + 1;

        LeaveRequest::create([
            'user_id' => $request->user_id,
            'type' => $request->type,
            'start_date' => $request->start_date,
            'end_date' => $request->end_date,
            'total_days' => $totalDays,
            'reason' => $request->reason,
            'status' => 'pending',
        ]);

        return redirect()->route('admin.leaves.index')->with('success', 'Leave request created.');
    }

    public function update(Request $request, LeaveRequest $leaf)
    {
        $request->validate([
            'status' => 'sometimes|in:pending,approved,denied',
            'type' => 'sometimes|in:sick,vacation,emergency,maternity,paternity',
            'start_date' => 'sometimes|date',
            'end_date' => 'sometimes|date|after_or_equal:start_date',
            'reason' => 'sometimes|string',
        ]);

        $data = $request->only(['type', 'start_date', 'end_date', 'reason', 'status']);

        // If approving or denying, record who reviewed
        if ($request->has('status') && in_array($request->status, ['approved', 'denied'])) {
            $data['reviewed_by'] = Auth::id();
            $data['reviewed_at'] = now();
        }

        // Recalculate total days if dates changed
        if ($request->has('start_date') && $request->has('end_date')) {
            $startDate = Carbon::parse($request->start_date);
            $endDate = Carbon::parse($request->end_date);
            $data['total_days'] = $startDate->diffInDays($endDate) + 1;
        }

        $leaf->update($data);

        return redirect()->route('admin.leaves.index')->with('success', 'Leave request updated.');
    }

    public function headApprove(LeaveRequest $leaf)
    {
        $leaf->update([
            'status' => 'head_approved',
            'reviewed_by' => Auth::id(),
            'reviewed_at' => now(),
        ]);

        return redirect()->back()->with('success', 'Department head approval recorded.');
    }

    public function hrApprove(LeaveRequest $leaf)
    {
        $leaf->update([
            'status' => 'approved',
            'reviewed_by' => Auth::id(),
            'reviewed_at' => now(),
        ]);

        return redirect()->back()->with('success', 'Leave fully approved by HR.');
    }

    public function destroy(LeaveRequest $leaf)
    {
        $leaf->delete();

        return redirect()->route('admin.leaves.index')->with('success', 'Leave request deleted.');
    }
}
