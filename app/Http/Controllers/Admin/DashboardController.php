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
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        $totalEmployees = Employee::count();
        $totalUsers = User::count();
        $pendingLeaves = LeaveRequest::where('status', 'pending')->count();
        $presentToday = Attendance::whereDate('date', Carbon::today())
            ->where('status', 'present')
            ->count();

        $departmentStats = Department::withCount('employees')->get();

        $recentLeaves = LeaveRequest::with('user')->latest()->take(5)->get();
        $activePostings = JobPosting::where('status', 'open')->count();

        return Inertia::render('dashboard', [
            'stats' => [
                'total_employees' => $totalEmployees,
                'total_users' => $totalUsers,
                'pending_leaves' => $pendingLeaves,
                'present_today' => $presentToday,
                'active_postings' => $activePostings,
            ],
            'department_stats' => $departmentStats,
            'recent_leaves' => $recentLeaves,
        ]);
    }
}
