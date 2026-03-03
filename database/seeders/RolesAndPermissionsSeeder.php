<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class RolesAndPermissionsSeeder extends Seeder
{
    public function run(): void
    {
        // Reset cached roles and permissions
        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();

        $permissions = [
            'manage users',
            'assign roles',
            'system configuration',
            'view all reports',
            'employee management',
            'recruitment',
            'attendance monitoring',
            'leave management',
            'payroll management',
            'generate reports',
            'team leave approvals',
            'performance monitoring',
            'team attendance',
            'personal profile management',
            'leave requests',
            'virtual dtr',
            'view payslips',
        ];

        // Create permissions safely
        foreach ($permissions as $permission) {
            Permission::findOrCreate($permission);
        }

        // Super Administrator
        $superAdmin = Role::findOrCreate('Super Administrator');
        $superAdmin->syncPermissions(Permission::all());

        // HR Administrator
        $hrAdmin = Role::findOrCreate('HR Administrator');
        $hrAdmin->syncPermissions([
            'employee management',
            'recruitment',
            'attendance monitoring',
            'leave management',
            'payroll management',
            'generate reports',
            'personal profile management',
            'leave requests',
            'virtual dtr',
            'view payslips',
        ]);

        // Head Employee
        $headEmployee = Role::findOrCreate('Head Employee');
        $headEmployee->syncPermissions([
            'team leave approvals',
            'performance monitoring',
            'team attendance',
            'personal profile management',
            'leave requests',
            'virtual dtr',
            'view payslips',
        ]);

        // Employee
        $employee = Role::findOrCreate('Employee');
        $employee->syncPermissions([
            'personal profile management',
            'leave requests',
            'virtual dtr',
            'view payslips',
        ]);
    }
}
