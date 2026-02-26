<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\JobPosting;
use App\Models\Applicant;
use App\Models\Department;
use Illuminate\Http\Request;
use Inertia\Inertia;

class RecruitmentController extends Controller
{
    public function index()
    {
        $jobPostings = JobPosting::with(['department', 'applicants'])->latest()->get();
        $departments = Department::all();

        return Inertia::render('admin/recruitment/index', [
            'jobPostings' => $jobPostings,
            'departments' => $departments,
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'department_id' => 'nullable|exists:departments,id',
            'description' => 'required|string',
            'requirements' => 'nullable|string',
            'type' => 'required|in:internal,external',
            'slots' => 'required|integer|min:1',
            'status' => 'required|in:open,closed,on-hold',
            'closing_date' => 'nullable|date',
        ]);

        JobPosting::create($request->only([
            'title', 'department_id', 'description', 'requirements',
            'type', 'slots', 'status', 'closing_date',
        ]));

        return redirect()->route('admin.recruitment.index')->with('success', 'Job posting created.');
    }

    public function update(Request $request, $id)
    {
        // Handle applicant status update
        if ($request->has('applicant_id')) {
            $request->validate([
                'applicant_id' => 'required|exists:applicants,id',
                'applicant_status' => 'required|in:applied,interviewed,hired,rejected',
                'notes' => 'nullable|string',
            ]);

            $applicant = Applicant::findOrFail($request->applicant_id);
            $applicant->update([
                'status' => $request->applicant_status,
                'notes' => $request->notes ?? $applicant->notes,
            ]);

            return redirect()->route('admin.recruitment.index')->with('success', 'Applicant status updated.');
        }

        // Handle job posting update
        $jobPosting = JobPosting::findOrFail($id);

        $request->validate([
            'title' => 'required|string|max:255',
            'department_id' => 'nullable|exists:departments,id',
            'description' => 'required|string',
            'requirements' => 'nullable|string',
            'type' => 'required|in:internal,external',
            'slots' => 'required|integer|min:1',
            'status' => 'required|in:open,closed,on-hold',
            'closing_date' => 'nullable|date',
        ]);

        $jobPosting->update($request->only([
            'title', 'department_id', 'description', 'requirements',
            'type', 'slots', 'status', 'closing_date',
        ]));

        return redirect()->route('admin.recruitment.index')->with('success', 'Job posting updated.');
    }

    public function storeApplicant(Request $request)
    {
        $request->validate([
            'job_posting_id' => 'required|exists:job_postings,id',
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'phone' => 'nullable|string|max:20',
            'notes' => 'nullable|string',
        ]);

        Applicant::create($request->only([
            'job_posting_id', 'name', 'email', 'phone', 'notes',
        ]));

        return redirect()->route('admin.recruitment.index')->with('success', 'Applicant added.');
    }

    public function hireApplicant(Request $request, $id)
    {
        $request->validate([
            'applicant_id' => 'required|exists:applicants,id',
            'department_id' => 'required|exists:departments,id',
            'position' => 'required|string|max:255',
            'employee_id' => 'required|string|unique:employees,employee_id',
            'join_date' => 'required|date',
        ]);

        $applicant = Applicant::findOrFail($request->applicant_id);
        $jobPosting = JobPosting::findOrFail($id);

        \DB::transaction(function () use ($applicant, $request) {
            // 1. Create User
            $user = User::create([
                'name' => $applicant->name,
                'email' => $applicant->email,
                'password' => \Hash::make('password123'), // Default password
            ]);
            $user->assignRole('Employee');

            // 2. Create Employee Profile
            Employee::create([
                'user_id' => $user->id,
                'employee_id' => $request->employee_id,
                'department_id' => $request->department_id,
                'position' => $request->position,
                'join_date' => $request->join_date,
                'status' => 'active',
            ]);

            // 3. Update Applicant
            $applicant->update([
                'status' => 'hired',
                'notes' => ($applicant->notes ? $applicant->notes . "\n" : "") . "Hired as " . $request->position . " on " . now()->toDateString(),
            ]);
        });

        return redirect()->route('admin.recruitment.index')->with('success', 'Applicant hired successfully. User and Employee records created.');
    }

    public function destroy($id)
    {
        $jobPosting = JobPosting::findOrFail($id);
        $jobPosting->delete();
        return redirect()->route('admin.recruitment.index')->with('success', 'Job posting deleted.');
    }
}
