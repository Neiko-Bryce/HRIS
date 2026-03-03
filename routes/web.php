<?php

use App\Http\Controllers\Admin\AttendanceController;
use App\Http\Controllers\Admin\DepartmentController;
use App\Http\Controllers\Admin\DocumentController;
use App\Http\Controllers\Admin\EmployeeController;
use App\Http\Controllers\Admin\LeaveController;
use App\Http\Controllers\Admin\PayrollController;
use App\Http\Controllers\Admin\PerformanceController;
use App\Http\Controllers\Admin\RecruitmentController;
use App\Http\Controllers\Admin\ReportsController;
use App\Http\Controllers\Admin\RoleController;
use App\Http\Controllers\Admin\SystemConfigController;
use App\Http\Controllers\Admin\UserController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

// Public kiosk routes — no login required (designed for wall-mounted displays)
Route::get('/attendance/kiosk', [AttendanceController::class, 'qrTerminal'])->name('attendance.kiosk');
Route::get('/attendance/kiosk-logs', [AttendanceController::class, 'kioskLogs'])->name('attendance.kiosk-logs');

Route::middleware(['auth'])->group(function () {
    Route::get('dashboard', [App\Http\Controllers\Admin\DashboardController::class, 'index'])->name('dashboard');
    Route::get('/attendance/check', [AttendanceController::class, 'check'])->name('attendance.check');
    Route::post('/attendance/scan', [AttendanceController::class, 'processScan'])->name('attendance.scan');

    // Employee Portal (Personal Records)
    Route::get('/my/leaves', [App\Http\Controllers\Employee\PortalController::class, 'leaves'])->name('employee.leaves.index');
    Route::get('/my/payslips', [App\Http\Controllers\Employee\PortalController::class, 'payslips'])->name('employee.payslips.index');

    // Admin Routes — Super Administrator only
    Route::middleware(['role:Super Administrator'])->prefix('admin')->name('admin.')->group(function () {
        Route::resource('users', UserController::class);
        Route::resource('departments', DepartmentController::class)->except(['create', 'show', 'edit']);
        Route::get('roles', [RoleController::class, 'index'])->name('roles.index');
        Route::get('settings', [SystemConfigController::class, 'index'])->name('settings.index');
        Route::put('settings', [SystemConfigController::class, 'update'])->name('settings.update');
    });

    // HR Operations — HR Admin and Super Admin
    Route::middleware(['role:Super Administrator|HR Administrator'])->prefix('admin')->name('admin.')->group(function () {
        Route::resource('employees', EmployeeController::class)->except(['create', 'show', 'edit', 'store']);
        Route::resource('payroll', PayrollController::class)->except(['create', 'show', 'edit']);
        Route::resource('attendance', AttendanceController::class)->except(['create', 'show', 'edit']);
        Route::resource('recruitment', RecruitmentController::class)->except(['create', 'show', 'edit']);
        Route::post('recruitment/{recruitment}/hire', [RecruitmentController::class, 'hireApplicant'])->name('recruitment.hire');
        Route::post('recruitment/applicants', [RecruitmentController::class, 'storeApplicant'])->name('recruitment.applicants.store');
        Route::resource('documents', DocumentController::class)->only(['index', 'store', 'destroy']);
        Route::get('documents/{document}/download', [DocumentController::class, 'download'])->name('documents.download');
        Route::put('documents/{document}', [DocumentController::class, 'update'])->name('documents.update');
        Route::get('documents/download-all/{user}', [DocumentController::class, 'downloadAll'])->name('documents.downloadAll');
        Route::get('reports', [ReportsController::class, 'index'])->name('reports.index');
        Route::get('reports/employees', [ReportsController::class, 'exportEmployees'])->name('reports.employees');
        Route::get('reports/attendance', [ReportsController::class, 'exportAttendance'])->name('reports.attendance');

        // Virtual DTR Display Terminal (legacy admin link — redirects to public kiosk)
        Route::get('attendance/qr-terminal', function () {
            return redirect()->route('attendance.kiosk');
        })->name('attendance.qr-terminal');

        // HR Leave Management
        Route::resource('leaves', LeaveController::class)->except(['create', 'show', 'edit'])->parameters(['leaves' => 'leaf']);
        Route::post('leaves/{leaf}/hr-approve', [LeaveController::class, 'hrApprove'])->name('leaves.hr-approve');
    });

    // Head Employee / HR Operations
    Route::middleware(['role:Super Administrator|HR Administrator|Head Employee'])->prefix('admin')->name('admin.')->group(function () {
        Route::post('leaves/{leaf}/head-approve', [LeaveController::class, 'headApprove'])->name('leaves.head-approve');
        Route::resource('performance', PerformanceController::class)->except(['create', 'show', 'edit']);
    });
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
