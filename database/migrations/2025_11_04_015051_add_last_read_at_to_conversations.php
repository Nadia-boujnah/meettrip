<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('conversations', function (Blueprint $table) {
            if (!Schema::hasColumn('conversations', 'last_read_at_user_one')) {
                $table->timestamp('last_read_at_user_one')->nullable()->after('last_message_at');
            }
            if (!Schema::hasColumn('conversations', 'last_read_at_user_two')) {
                $table->timestamp('last_read_at_user_two')->nullable()->after('last_read_at_user_one');
            }
        });
    }

    public function down(): void
    {
        Schema::table('conversations', function (Blueprint $table) {
            // On ne drop que si la colonne existe (utile sur sqlite)
            if (Schema::hasColumn('conversations', 'last_read_at_user_two')) {
                $table->dropColumn('last_read_at_user_two');
            }
            if (Schema::hasColumn('conversations', 'last_read_at_user_one')) {
                $table->dropColumn('last_read_at_user_one');
            }
        });
    }
};
