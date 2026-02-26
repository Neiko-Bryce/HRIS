<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Attendance;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class AttendanceController extends Controller
{
    public function index()
    {
        // Filter out users with 'Super Administrator' role
        $users = User::role(['HR Administrator', 'Head Employee', 'Employee'])
            ->with('employee.departmentRelation')
            ->get();

        $attendances = \App\Models\Attendance::with('user.employee')->latest()->get();

        return Inertia::render('admin/attendance/index', [
            'attendances' => $attendances,
            'users' => $users,
        ]);
    }

    public function check()
    {
        $user = Auth::user();
        if ($user->hasRole('Super Administrator')) {
            return redirect()->route('dashboard')->with('error', 'Super Admins do not use Virtual DTR.');
        }

        $todayAttendance = \App\Models\Attendance::where('user_id', $user->id)
            ->whereDate('date', now()->toDateString())
            ->first();

        return Inertia::render('attendance/Scan', [
            'todayAttendance' => $todayAttendance,
        ]);
    }

    public function processScan(Request $request)
    {
        $user = Auth::user();
        $today = now()->toDateString();
        $now = now()->toTimeString();

        $attendance = \App\Models\Attendance::where('user_id', $user->id)
            ->whereDate('date', $today)
            ->first();

        if (! $attendance) {
            \App\Models\Attendance::create([
                'user_id' => $user->id,
                'date' => $today,
                'check_in' => $now,
                'status' => 'present',
            ]);

            return redirect()->back()->with('success', 'Checked in successfully.');
        }

        if ($attendance->check_out) {
            return redirect()->back()->with('error', 'You have already checked out for today.');
        }

        $attendance->update([
            'check_out' => $now,
        ]);

        return redirect()->back()->with('success', 'Checked out successfully.');
    }

    public function store(Request $request)
    {
        $request->validate([
            'user_id' => 'required|exists:users,id',
            'date' => 'required|date',
            'time_in' => 'nullable|date_format:H:i',
            'time_out' => 'nullable|date_format:H:i',
            'remarks' => 'nullable|string',
        ]);

        $timeIn = $request->time_in ? Carbon::createFromFormat('H:i', $request->time_in) : null;
        $timeOut = $request->time_out ? Carbon::createFromFormat('H:i', $request->time_out) : null;
        $hoursWorked = 0;
        $status = 'absent';

        if ($timeIn) {
            $status = 'present';
            if ($timeIn->format('H:i') > '08:00') {
                $status = 'late';
            }

            if ($timeOut) {
                // Difference in hours
                $hoursWorked = round($timeOut->diffInMinutes($timeIn) / 60, 2);

                if ($hoursWorked < 4) {
                    $status = 'half-day';
                } elseif ($timeOut->format('H:i') < '17:00' && $status !== 'late') {
                    $status = 'undertime';
                }
            }
        }

        Attendance::updateOrCreate(
            ['user_id' => $request->user_id, 'date' => $request->date],
            [
                'time_in' => $request->time_in,
                'time_out' => $request->time_out,
                'hours_worked' => $hoursWorked,
                'status' => $status,
                'remarks' => $request->remarks,
            ]
        );

        return redirect()->route('admin.attendance.index')->with('success', 'Attendance record saved. Status auto-calculated.');
    }

    public function update(Request $request, Attendance $attendance)
    {
        $request->validate([
            'time_in' => 'nullable|date_format:H:i',
            'time_out' => 'nullable|date_format:H:i',
            'remarks' => 'nullable|string',
        ]);

        $timeIn = $request->time_in ? Carbon::createFromFormat('H:i', $request->time_in) : null;
        $timeOut = $request->time_out ? Carbon::createFromFormat('H:i', $request->time_out) : null;
        $hoursWorked = 0;
        $status = 'absent';

        if ($timeIn) {
            $status = 'present';
            if ($timeIn->format('H:i') > '08:00') {
                $status = 'late';
            }

            if ($timeOut) {
                $hoursWorked = round($timeOut->diffInMinutes($timeIn) / 60, 2);
                if ($hoursWorked < 4) {
                    $status = 'half-day';
                } elseif ($timeOut->format('H:i') < '17:00' && $status !== 'late') {
                    $status = 'undertime';
                }
            }
        }

        $attendance->update([
            'time_in' => $request->time_in,
            'time_out' => $request->time_out,
            'hours_worked' => $hoursWorked,
            'status' => $status,
            'remarks' => $request->remarks,
        ]);

        return redirect()->route('admin.attendance.index')->with('success', 'Attendance updated. Status auto-calculated.');
    }

    public function destroy(Attendance $attendance)
    {
        $attendance->delete();

        return redirect()->route('admin.attendance.index')->with('success', 'Attendance record deleted.');
    }
}
