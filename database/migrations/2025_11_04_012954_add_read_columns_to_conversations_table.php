<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::table('conversations', function (Blueprint $table) {
            $table->timestamp('last_read_at_user_one')->nullable()->after('last_message_at');
            $table->timestamp('last_read_at_user_two')->nullable()->after('last_read_at_user_one');
        });
    }
    public function down(): void {
        Schema::table('conversations', function (Blueprint $table) {
            $table->dropColumn(['last_read_at_user_one','last_read_at_user_two']);
        });
    }
};
