<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('activity_user', function (Blueprint $table) {
            // 1) Ajoute host_id SANS contrainte (SQLite-friendly)
            if (!Schema::hasColumn('activity_user', 'host_id')) {
                $table->unsignedBigInteger('host_id')->nullable()->after('user_id');
                $table->index('host_id');
            }

            // 2) Ajoute status si besoin
            if (!Schema::hasColumn('activity_user', 'status')) {
                $table->string('status')->default('pending'); // pending | accepted | declined | cancelled
            }

            // 3) Ajoute les timestamps si absents (suivant tes relations)
            if (!Schema::hasColumn('activity_user', 'created_at')) {
                $table->timestamp('created_at')->nullable();
            }
            if (!Schema::hasColumn('activity_user', 'updated_at')) {
                $table->timestamp('updated_at')->nullable();
            }
        });

        // 4) Renseigne host_id depuis activities.host_user_id (compatible SQLite)
        DB::statement("
            UPDATE activity_user
            SET host_id = (
                SELECT host_user_id
                FROM activities
                WHERE activities.id = activity_user.activity_id
            )
            WHERE host_id IS NULL
        ");

        // 5) (OPTIONNEL) ajouter une FK si ce n’est PAS SQLite
        if (DB::getDriverName() !== 'sqlite') {
            Schema::table('activity_user', function (Blueprint $table) {
                $table->foreign('host_id')->references('id')->on('users')->cascadeOnDelete();
            });
        }
    }

    public function down(): void
    {
        // supprime proprement ce qu’on a ajouté
        if (DB::getDriverName() !== 'sqlite') {
            Schema::table('activity_user', function (Blueprint $table) {
                if (Schema::hasColumn('activity_user', 'host_id')) {
                    $table->dropForeign(['host_id']);
                }
            });
        }

        Schema::table('activity_user', function (Blueprint $table) {
            if (Schema::hasColumn('activity_user', 'host_id')) {
                $table->dropIndex(['host_id']);
                $table->dropColumn('host_id');
            }
            // NE PAS forcément drop 'status' si tu l’utilises déjà ailleurs
            // if (Schema::hasColumn('activity_user', 'status')) $table->dropColumn('status');

            if (Schema::hasColumn('activity_user', 'created_at')) $table->dropColumn('created_at');
            if (Schema::hasColumn('activity_user', 'updated_at')) $table->dropColumn('updated_at');
        });
    }
};
