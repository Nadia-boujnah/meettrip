<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('activities', function (Blueprint $table) {
            // Sur SQLite, JSON = TEXT, c'est ok
            if (! Schema::hasColumn('activities', 'dates')) {
                $table->json('dates')->nullable()->after('why');
            }
        });
    }

    public function down(): void
    {
        Schema::table('activities', function (Blueprint $table) {
            if (Schema::hasColumn('activities', 'dates')) {
                $table->dropColumn('dates');
            }
        });
    }
};
