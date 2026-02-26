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
        if (config('database.default') !== 'sqlite') {
            Schema::table('leave_requests', function (Blueprint $table) {
                $table->enum('status', ['pending', 'head_approved', 'approved', 'denied'])->default('pending')->change();
            });
        }
    }

    public function down(): void
    {
        if (config('database.default') !== 'sqlite') {
            Schema::table('leave_requests', function (Blueprint $table) {
                $table->enum('status', ['pending', 'approved', 'denied'])->default('pending')->change();
            });
        }
    }
};
