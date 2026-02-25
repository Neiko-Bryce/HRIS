<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // 1. Seed Roles and Permissions
        $this->call(RolesAndPermissionsSeeder::class);

        // 2. Create Super Admin User
        $admin = User::factory()->create([
            'name' => 'Super Admin',
            'email' => 'admin@hris.com',
            'password' => bcrypt('password'), // Use a secure default for development
        ]);

        $admin->assignRole('Super Administrator');

        // 3. Create initial employee profile for the admin
        $admin->employee()->create([
            'employee_id' => 'HRIS-2026-0001',
            'department' => 'Administration',
            'position' => 'System Administrator',
            'status' => 'active',
        ]);
    }
}
