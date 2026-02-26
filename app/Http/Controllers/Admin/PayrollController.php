<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Payslip;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PayrollController extends Controller
{
    public function index()
    {
        $payslips = Payslip::with(['user.employee'])->latest()->get();
        $users = User::with('employee')->get();

        return Inertia::render('admin/payroll/index', [
            'payslips' => $payslips,
            'users' => $users,
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'user_id' => 'required|exists:users,id',
            'period_start' => 'required|date',
            'period_end' => 'required|date|after_or_equal:period_start',
            'basic_pay' => 'required|numeric|min:0',
            'allowances' => 'nullable|numeric|min:0',
            'overtime_pay' => 'nullable|numeric|min:0',
            'remarks' => 'nullable|string',
            'auto_calc' => 'nullable|boolean',
        ]);

        $basicPay = (float) $request->basic_pay;
        $allowances = (float) ($request->allowances ?? 0);
        $overtimePay = (float) ($request->overtime_pay ?? 0);

        // Auto-calc logic (Simplified PH standard)
        if ($request->auto_calc) {
            // SSS: roughly 4.5% for employee
            $sss = $basicPay * 0.045;
            // PhilHealth: 5% shared, so 2.5% for employee
            $philhealth = $basicPay * 0.025;
            // Pag-IBIG: usually fixed 100 or 200
            $pagibig = 200;
            // Tax: simplified 10% for simulation
            $tax = ($basicPay > 20000) ? ($basicPay - 20000) * 0.15 : 0;
        } else {
            $sss = (float) ($request->sss ?? 0);
            $philhealth = (float) ($request->philhealth ?? 0);
            $pagibig = (float) ($request->pagibig ?? 0);
            $tax = (float) ($request->tax ?? 0);
        }

        $otherDeductions = (float) ($request->other_deductions ?? 0);

        $totalEarnings = $basicPay + $allowances + $overtimePay;
        $totalDeductions = $sss + $philhealth + $pagibig + $tax + $otherDeductions;
        $netPay = $totalEarnings - $totalDeductions;

        Payslip::create([
            'user_id' => $request->user_id,
            'period_start' => $request->period_start,
            'period_end' => $request->period_end,
            'basic_pay' => $basicPay,
            'allowances' => $allowances,
            'overtime_pay' => $overtimePay,
            'sss' => $sss,
            'philhealth' => $philhealth,
            'pagibig' => $pagibig,
            'tax' => $tax,
            'other_deductions' => $otherDeductions,
            'net_pay' => $netPay,
            'remarks' => $request->remarks,
        ]);

        return redirect()->route('admin.payroll.index')->with('success', 'Payslip created'.($request->auto_calc ? ' with auto-calculated contributions.' : '.'));
    }

    public function update(Request $request, Payslip $payroll)
    {
        $request->validate([
            'period_start' => 'required|date',
            'period_end' => 'required|date|after_or_equal:period_start',
            'basic_pay' => 'required|numeric|min:0',
            'allowances' => 'nullable|numeric|min:0',
            'overtime_pay' => 'nullable|numeric|min:0',
            'sss' => 'nullable|numeric|min:0',
            'philhealth' => 'nullable|numeric|min:0',
            'pagibig' => 'nullable|numeric|min:0',
            'tax' => 'nullable|numeric|min:0',
            'other_deductions' => 'nullable|numeric|min:0',
            'remarks' => 'nullable|string',
        ]);

        $basicPay = (float) $request->basic_pay;
        $allowances = (float) ($request->allowances ?? 0);
        $overtimePay = (float) ($request->overtime_pay ?? 0);
        $sss = (float) ($request->sss ?? 0);
        $philhealth = (float) ($request->philhealth ?? 0);
        $pagibig = (float) ($request->pagibig ?? 0);
        $tax = (float) ($request->tax ?? 0);
        $otherDeductions = (float) ($request->other_deductions ?? 0);

        $totalEarnings = $basicPay + $allowances + $overtimePay;
        $totalDeductions = $sss + $philhealth + $pagibig + $tax + $otherDeductions;
        $netPay = $totalEarnings - $totalDeductions;

        $payroll->update([
            'period_start' => $request->period_start,
            'period_end' => $request->period_end,
            'basic_pay' => $basicPay,
            'allowances' => $allowances,
            'overtime_pay' => $overtimePay,
            'sss' => $sss,
            'philhealth' => $philhealth,
            'pagibig' => $pagibig,
            'tax' => $tax,
            'other_deductions' => $otherDeductions,
            'net_pay' => $netPay,
            'remarks' => $request->remarks,
        ]);

        return redirect()->route('admin.payroll.index')->with('success', 'Payslip updated.');
    }

    public function destroy(Payslip $payroll)
    {
        $payroll->delete();

        return redirect()->route('admin.payroll.index')->with('success', 'Payslip deleted.');
    }
}
