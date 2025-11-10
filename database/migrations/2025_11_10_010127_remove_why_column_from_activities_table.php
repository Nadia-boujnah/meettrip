<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        // Supprime la colonne seulement si elle existe (évite l'erreur en prod/CI)
        if (Schema::hasColumn('activities', 'why')) {
            Schema::table('activities', function (Blueprint $table) {
                $table->dropColumn('why');
            });
        }
    }

    public function down(): void
    {
        // En rollback, on la recrée uniquement si elle n'existe pas déjà
        if (!Schema::hasColumn('activities', 'why')) {
            Schema::table('activities', function (Blueprint $table) {
                $table->string('why', 255)->nullable();
            });
        }
    }
};
