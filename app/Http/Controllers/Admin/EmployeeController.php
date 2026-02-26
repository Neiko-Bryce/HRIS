<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Department;
use App\Models\Employee;
use Illuminate\Http\Request;
use Inertia\Inertia;

class EmployeeController extends Controller
{
    public function index()
    {
        $employees = Employee::with(['user.roles', 'departmentRelation'])->get();
        $departments = Department::all();

        return Inertia::render('admin/employees/index', [
            'employees' => $employees,
            'departments' => $departments,
        ]);
    }

    public function update(Request $request, Employee $employee)
    {
        $request->validate([
            'contact_number' => 'nullable|string|max:20',
            'address' => 'nullable|string',
            'join_date' => 'nullable|date',
            'department' => 'nullable|string',
            'department_id' => 'nullable|exists:departments,id',
            'position' => 'nullable|string',
            'salary_grade' => 'nullable|string',
            'status' => 'required|in:active,inactive',
            'photo' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048', // Added validation for photo
        ]);

        $employee->update($request->only([
            'contact_number', 'address', 'join_date', 'department',
            'department_id', 'position', 'salary_grade', 'status',
        ]));

        if ($request->hasFile('photo')) {
            // Delete old photo if exists
            if ($employee->photo_path) {
                \Storage::disk('public')->delete($employee->photo_path);
            }
            $path = $request->file('photo')->store('employees', 'public');
            $employee->update(['photo_path' => $path]);
        }

        return redirect()->route('admin.employees.index')->with('success', 'Employee updated successfully.');
    }

    public function destroy(Employee $employee)
    {
        // Delete employee photo if exists
        if ($employee->photo_path) {
            \Storage::disk('public')->delete($employee->photo_path);
        }

        $employee->delete();

        return redirect()->route('admin.employees.index')->with('success', 'Employee record deleted.');
    }
}
