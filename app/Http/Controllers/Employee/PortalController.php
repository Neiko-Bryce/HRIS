<?php

namespace App\Http\Controllers\Employee;

use App\Http\Controllers\Controller;
use App\Models\LeaveRequest;
use App\Models\Payslip;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class PortalController extends Controller
{
    public function leaves()
    {
        $leaves = LeaveRequest::where('user_id', Auth::id())->latest()->get();

        return Inertia::render('employee/leaves/index', [
            'leaves' => $leaves,
        ]);
    }

    public function payslips()
    {
        $payslips = Payslip::where('user_id', Auth::id())->latest()->get();

        return Inertia::render('employee/payslips/index', [
            'payslips' => $payslips,
        ]);
    }
}
