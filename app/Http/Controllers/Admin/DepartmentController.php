<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Department;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DepartmentController extends Controller
{
    public function index()
    {
        $departments = Department::withCount('employees')->get();

        return Inertia::render('admin/departments/index', [
            'departments' => $departments,
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255|unique:departments',
            'code' => 'nullable|string|max:10',
            'description' => 'nullable|string',
        ]);

        Department::create($request->only('name', 'code', 'description'));

        return redirect()->route('admin.departments.index')->with('success', 'Department created.');
    }

    public function update(Request $request, Department $department)
    {
        $request->validate([
            'name' => 'required|string|max:255|unique:departments,name,'.$department->id,
            'code' => 'nullable|string|max:10',
            'description' => 'nullable|string',
        ]);

        $department->update($request->only('name', 'code', 'description'));

        return redirect()->route('admin.departments.index')->with('success', 'Department updated.');
    }

    public function destroy(Department $department)
    {
        if ($department->employees()->count() > 0) {
            return redirect()->back()->with('error', 'Cannot delete department with assigned employees.');
        }

        $department->delete();

        return redirect()->route('admin.departments.index')->with('success', 'Department deleted.');
    }
}
