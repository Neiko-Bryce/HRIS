<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('documents', function (Blueprint $table) {
            if (Schema::hasColumn('documents', 'name')) {
                $table->renameColumn('name', 'title');
            }
            if (! Schema::hasColumn('documents', 'expiry_date')) {
                $table->date('expiry_date')->nullable()->after('file_path');
            }
            if (! Schema::hasColumn('documents', 'notes')) {
                $table->text('notes')->nullable()->after('expiry_date');
            }
        });
    }

    public function down(): void
    {
        Schema::table('documents', function (Blueprint $table) {
            $table->renameColumn('title', 'name');
            $table->dropColumn(['expiry_date', 'notes']);
        });
    }
};
