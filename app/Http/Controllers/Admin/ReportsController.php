<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Attendance;
use App\Models\Employee;
use Inertia\Inertia;
use Symfony\Component\HttpFoundation\StreamedResponse;

class ReportsController extends Controller
{
    public function index()
    {
        return Inertia::render('admin/reports/index');
    }

    public function exportEmployees()
    {
        $employees = Employee::with('user', 'departmentRelation')->get();

        return $this->csvResponse('employees_'.date('Y-m-d').'.csv', function ($handle) use ($employees) {
            fputcsv($handle, ['ID', 'Name', 'Email', 'Department', 'Position', 'Status']);
            foreach ($employees as $emp) {
                fputcsv($handle, [
                    $emp->employee_id,
                    $emp->user->name,
                    $emp->user->email,
                    $emp->departmentRelation->name ?? 'N/A',
                    $emp->position,
                    $emp->status,
                ]);
            }
        });
    }

    public function exportAttendance()
    {
        $attendance = Attendance::with('user')->get();

        return $this->csvResponse('attendance_'.date('Y-m-d').'.csv', function ($handle) use ($attendance) {
            fputcsv($handle, ['Employee', 'Date', 'Time In', 'Time Out', 'Hours', 'Status']);
            foreach ($attendance as $record) {
                fputcsv($handle, [
                    $record->user->name,
                    $record->date,
                    $record->time_in,
                    $record->time_out,
                    $record->hours_worked,
                    $record->status,
                ]);
            }
        });
    }

    private function csvResponse($filename, $callback)
    {
        return new StreamedResponse(function () use ($callback) {
            $handle = fopen('php://output', 'w');
            $callback($handle);
            fclose($handle);
        }, 200, [
            'Content-Type' => 'text/csv',
            'Content-Disposition' => 'attachment; filename="'.$filename.'"',
        ]);
    }
}
