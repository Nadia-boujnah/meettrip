<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('activity_user', function (Blueprint $table) {
            if (!Schema::hasColumn('activity_user', 'status')) {
                $table->string('status')->default('pending')->index(); // pending|accepted|rejected
            }
        });
    }

    public function down(): void
    {
        Schema::table('activity_user', function (Blueprint $table) {
            if (Schema::hasColumn('activity_user', 'status')) {
                $table->dropColumn('status');
            }
        });
    }
};
