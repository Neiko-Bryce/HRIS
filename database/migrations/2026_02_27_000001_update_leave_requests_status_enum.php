<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        if (config('database.default') === 'pgsql') {
            \Illuminate\Support\Facades\DB::statement('ALTER TABLE leave_requests DROP CONSTRAINT IF EXISTS leave_requests_status_check');
            \Illuminate\Support\Facades\DB::statement("ALTER TABLE leave_requests ADD CONSTRAINT leave_requests_status_check CHECK (status::text = ANY (ARRAY['pending'::character varying, 'head_approved'::character varying, 'approved'::character varying, 'denied'::character varying]::text[]))");
        } elseif (config('database.default') !== 'sqlite') {
            Schema::table('leave_requests', function (Blueprint $table) {
                $table->enum('status', ['pending', 'head_approved', 'approved', 'denied'])->default('pending')->change();
            });
        }
    }

    public function down(): void
    {
        if (config('database.default') === 'pgsql') {
            \Illuminate\Support\Facades\DB::statement('ALTER TABLE leave_requests DROP CONSTRAINT IF EXISTS leave_requests_status_check');
            \Illuminate\Support\Facades\DB::statement("ALTER TABLE leave_requests ADD CONSTRAINT leave_requests_status_check CHECK (status::text = ANY (ARRAY['pending'::character varying, 'approved'::character varying, 'denied'::character varying]::text[]))");
        } elseif (config('database.default') !== 'sqlite') {
            Schema::table('leave_requests', function (Blueprint $table) {
                $table->enum('status', ['pending', 'approved', 'denied'])->default('pending')->change();
            });
        }
    }
};
