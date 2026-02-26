<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Department;
use App\Models\Employee;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;

class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $users = User::with(['roles', 'employee.departmentRelation'])->get();
        $departments = Department::all(['id', 'name']);

        return Inertia::render('admin/users/index', [
            'users' => $users,
            'departments' => $departments,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8',
            'role' => 'required|string|exists:roles,name',
            'department_id' => 'nullable|exists:departments,id',
            'position' => 'nullable|string',
        ]);

        return DB::transaction(function () use ($request) {
            $user = User::create([
                'name' => $request->name,
                'email' => $request->email,
                'password' => Hash::make($request->password),
            ]);

            $user->assignRole($request->role);

            // Sequential ID Generation logic (HRIS-YYYY-XXXX)
            $year = now()->year;
            $lastEmployee = Employee::where('employee_id', 'like', "HRIS-$year-%")
                ->orderBy('employee_id', 'desc')
                ->first();

            $sequence = $lastEmployee ? (int) substr($lastEmployee->employee_id, -4) + 1 : 1;
            $employeeId = "HRIS-$year-".str_pad($sequence, 4, '0', STR_PAD_LEFT);

            Employee::create([
                'user_id' => $user->id,
                'employee_id' => $employeeId,
                'department_id' => $request->department_id,
                'position' => $request->position,
                'status' => 'active',
            ]);

            return redirect()->route('admin.users.index')->with('success', 'User created successfully.');
        });
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, User $user)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users,email,'.$user->id,
            'role' => 'required|string|exists:roles,name',
            'department_id' => 'nullable|exists:departments,id',
            'position' => 'nullable|string',
            'status' => 'required|in:active,inactive',
        ]);

        return DB::transaction(function () use ($request, $user) {
            $user->update([
                'name' => $request->name,
                'email' => $request->email,
            ]);

            $user->syncRoles([$request->role]);

            $user->employee()->updateOrCreate(
                ['user_id' => $user->id],
                [
                    'department_id' => $request->department_id,
                    'position' => $request->position,
                    'status' => $request->status,
                ]
            );

            return redirect()->route('admin.users.index')->with('success', 'User updated successfully.');
        });
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(User $user)
    {
        // Prevent deleting self
        if (Auth::id() === $user->id) {
            return redirect()->back()->with('error', 'You cannot delete your own account.');
        }

        $user->delete();

        return redirect()->route('admin.users.index')->with('success', 'User deleted successfully.');
    }
}
