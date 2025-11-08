<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            // Profil
            if (!Schema::hasColumn('users', 'prenom'))   $table->string('prenom')->nullable()->after('name');
            if (!Schema::hasColumn('users', 'nom'))      $table->string('nom')->nullable()->after('prenom');
            if (!Schema::hasColumn('users', 'bio'))      $table->text('bio')->nullable()->after('password');
            if (!Schema::hasColumn('users', 'location')) $table->string('location')->nullable()->after('bio');
            if (!Schema::hasColumn('users', 'avatar'))   $table->string('avatar')->nullable()->after('location');   // ex: avatars/nadia.png
            if (!Schema::hasColumn('users', 'document')) $table->string('document')->nullable()->after('avatar');   // ex: documents/nadia-doc.png

            // Vérification: pending | verified | rejected
            if (!Schema::hasColumn('users', 'verification_status')) {
                $table->string('verification_status')->default('pending')->index();
            }

            // Rôle: admin | organisateur | participant
            // On remplace l'ancien enum('admin','user') par un string simple
            if (Schema::hasColumn('users', 'role')) {
                $table->string('role')->default('participant')->change();
            } else {
                $table->string('role')->default('participant')->index();
            }
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            // rollback soft
            $table->dropColumn(['prenom','nom','bio','location','avatar','document','verification_status']);
            // on ne revient pas à l'ancien enum, on laisse role en string
        });
    }
};
