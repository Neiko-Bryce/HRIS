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

        // Define Permissions per Photo 2
        $permissions = [
            // User Management
            'manage users',
            'assign roles',
            'system configuration',
            'view all reports',

            // HR Management
            'employee management',
            'recruitment',
            'attendance monitoring',
            'leave management',
            'payroll management',
            'generate reports',

            // Managerial
            'team leave approvals',
            'performance monitoring',
            'team attendance',

            // Personal
            'personal profile management',
            'leave requests',
            'virtual dtr',
            'view payslips',
        ];

        foreach ($permissions as $permission) {
            Permission::create(['name' => $permission]);
        }

        // Define Roles and Assign Permissions

        // 1. Super Administrator
        $superAdmin = Role::create(['name' => 'Super Administrator']);
        $superAdmin->givePermissionTo(Permission::all());

        // 2. HR Administrator
        $hrAdmin = Role::create(['name' => 'HR Administrator']);
        $hrAdmin->givePermissionTo([
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

        // 3. Head Employee
        $headEmployee = Role::create(['name' => 'Head Employee']);
        $headEmployee->givePermissionTo([
            'team leave approvals',
            'performance monitoring',
            'team attendance',
            'personal profile management',
            'leave requests',
            'virtual dtr',
            'view payslips',
        ]);

        // 4. Employee
        $employee = Role::create(['name' => 'Employee']);
        $employee->givePermissionTo([
            'personal profile management',
            'leave requests',
            'virtual dtr',
            'view payslips',
        ]);
    }
}
