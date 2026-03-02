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
        $user = Auth::user();
        $isSuperAdmin = $user->hasRole('Super Administrator');
        $isHR = $user->hasRole('HR Administrator');
        $isHead = $user->hasRole('Head Employee');

        $usersQuery = User::role(['HR Administrator', 'Head Employee', 'Employee'])
            ->with('employee.departmentRelation');

        $attendanceQuery = \App\Models\Attendance::with('user.employee')->latest();

        if (($isHead || $isHR) && ! $isSuperAdmin) {
            $departmentId = $user->employee->department_id ?? null;
            if ($departmentId) {
                $usersQuery->whereHas('employee', function ($q) use ($departmentId) {
                    $q->where('department_id', $departmentId);
                });
                $attendanceQuery->whereHas('user.employee', function ($q) use ($departmentId) {
                    $q->where('department_id', $departmentId);
                });
            } else {
                $usersQuery->where('id', '<', 0);
                $attendanceQuery->where('id', '<', 0);
            }
        }

        return Inertia::render('admin/attendance/index', [
            'attendances' => $attendanceQuery->get(),
            'users' => $usersQuery->get(),
        ]);
    }

    public function qrTerminal()
    {
        return Inertia::render('admin/attendance/qr-terminal');
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

        $shiftStartTime = \App\Models\Setting::where('key', 'shift_start_time')->value('value') ?? '08:00';
        $shiftEndTime = \App\Models\Setting::where('key', 'shift_end_time')->value('value') ?? '17:00';

        $attendance = \App\Models\Attendance::where('user_id', $user->id)
            ->whereDate('date', $today)
            ->first();

        if (! $attendance) {
            // Check if late
            $status = 'present';
            // Simple string comparison works for H:i:s and H:i
            if (substr($now, 0, 5) > $shiftStartTime) {
                $status = 'late';
            }

            \App\Models\Attendance::create([
                'user_id' => $user->id,
                'date' => $today,
                'time_in' => $now,
                'status' => $status,
            ]);

            return redirect()->back()->with('success', 'Checked in successfully.');
        }

        if ($attendance->time_out) {
            return redirect()->back()->with('error', 'You have already checked out for today.');
        }

        // Calculate checkout status (undertime, half-day)
        $timeIn = Carbon::createFromFormat('H:i:s', $attendance->time_in);
        $timeOut = Carbon::createFromFormat('H:i:s', $now);
        $hoursWorked = round($timeOut->diffInMinutes($timeIn) / 60, 2);

        $status = $attendance->status;
        if ($hoursWorked < 4) {
            $status = 'half-day';
        } elseif (substr($now, 0, 5) < $shiftEndTime && $status !== 'late') {
            $status = 'undertime';
        }

        $attendance->update([
            'time_out' => $now,
            'hours_worked' => $hoursWorked,
            'status' => $status,
        ]);

        return redirect()->back()->with('success', 'Checked out successfully. Status: '.$status);
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

        $shiftStartTime = \App\Models\Setting::where('key', 'shift_start_time')->value('value') ?? '08:00';
        $shiftEndTime = \App\Models\Setting::where('key', 'shift_end_time')->value('value') ?? '17:00';

        if ($timeIn) {
            $status = 'present';
            if ($timeIn->format('H:i') > $shiftStartTime) {
                $status = 'late';
            }

            if ($timeOut) {
                // Difference in hours
                $hoursWorked = round($timeOut->diffInMinutes($timeIn) / 60, 2);

                if ($hoursWorked < 4) {
                    $status = 'half-day';
                } elseif ($timeOut->format('H:i') < $shiftEndTime && $status !== 'late') {
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

        $shiftStartTime = \App\Models\Setting::where('key', 'shift_start_time')->value('value') ?? '08:00';
        $shiftEndTime = \App\Models\Setting::where('key', 'shift_end_time')->value('value') ?? '17:00';

        if ($timeIn) {
            $status = 'present';
            if ($timeIn->format('H:i') > $shiftStartTime) {
                $status = 'late';
            }

            if ($timeOut) {
                $hoursWorked = round($timeOut->diffInMinutes($timeIn) / 60, 2);
                if ($hoursWorked < 4) {
                    $status = 'half-day';
                } elseif ($timeOut->format('H:i') < $shiftEndTime && $status !== 'late') {
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
