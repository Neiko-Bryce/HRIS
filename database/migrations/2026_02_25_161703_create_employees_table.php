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
        Schema::create('employees', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('employee_id')->unique(); // Sequential or custom
            
            // Personal Data
            $table->string('contact_number')->nullable();
            $table->text('address')->nullable();
            
            // Employment Details
            $table->date('join_date')->nullable();
            $table->string('department')->nullable();
            $table->string('position')->nullable();
            $table->string('salary_grade')->nullable();
            
            // Status Control
            $table->enum('status', ['active', 'inactive'])->default('active');
            
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('employees');
    }
};
