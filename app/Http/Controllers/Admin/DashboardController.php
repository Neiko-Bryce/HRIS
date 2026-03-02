<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Attendance;
use App\Models\Department;
use App\Models\Employee;
use App\Models\JobPosting;
use App\Models\LeaveRequest;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        $user = Auth::user();
        $role = $user->roles->first()->name ?? 'Employee';

        // 1. Employee Data (Personal)
        $personalAttendance = Attendance::where('user_id', $user->id)
            ->whereDate('date', Carbon::today())
            ->first();

        $personalLeaves = LeaveRequest::where('user_id', $user->id)
            ->latest()
            ->take(5)
            ->get();

        $employeeData = [
            'today_attendance' => $personalAttendance,
            'recent_leaves' => $personalLeaves,
        ];

        // 2. Head Employee Data (Department)
        $headData = null;
        if ($role === 'Head Employee') {
            $departmentId = $user->employee->department_id;

            // Get all user IDs in this department (exclude the head themselves if desired, but here we include all)
            $deptUserIds = Employee::where('department_id', $departmentId)->pluck('user_id');

            $teamPresentToday = Attendance::whereIn('user_id', $deptUserIds)
                ->whereDate('date', Carbon::today())
                ->where('status', 'present')
                ->count();

            $teamTotal = $deptUserIds->count();

            $teamPendingLeaves = LeaveRequest::with('user')
                ->whereIn('user_id', $deptUserIds)
                ->where('status', 'pending')
                ->latest()
                ->take(5)
                ->get();

            $headData = [
                'team_present' => $teamPresentToday,
                'team_total' => $teamTotal,
                'team_pending_leaves' => $teamPendingLeaves,
            ];
        }

        // 3. Admin / HR Data (Company-wide)
        $adminData = null;
        if (in_array($role, ['Super Administrator', 'HR Administrator'])) {
            $totalEmployees = Employee::count();
            $totalUsers = User::count();
            $pendingLeaves = LeaveRequest::where('status', 'head_approved')->orWhere('status', 'pending')->count();
            $presentToday = Attendance::whereDate('date', Carbon::today())
                ->where('status', 'present')
                ->count();
            $activePostings = JobPosting::where('status', 'open')->count();
            $departmentStats = Department::withCount('employees')->get();
            $recentLeaves = LeaveRequest::with('user')->latest()->take(5)->get();

            $adminData = [
                'stats' => [
                    'total_employees' => $totalEmployees,
                    'total_users' => $totalUsers,
                    'pending_leaves' => $pendingLeaves,
                    'present_today' => $presentToday,
                    'active_postings' => $activePostings,
                ],
                'department_stats' => $departmentStats,
                'recent_leaves' => $recentLeaves,
            ];
        }

        return Inertia::render('dashboard', [
            'userRole' => $role,
            'employeeData' => $employeeData,
            'headData' => $headData,
            'adminData' => $adminData,
        ]);
    }
}
