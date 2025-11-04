<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('conversations', function (Blueprint $t) {
            $t->id();

            // Les deux participants (relation vers la table users)
            $t->foreignId('user_one_id')->constrained('users')->cascadeOnDelete();
            $t->foreignId('user_two_id')->constrained('users')->cascadeOnDelete();

            // Optionnel : conversation liée à une activité
            $t->foreignId('activity_id')->nullable()->constrained('activities')->nullOnDelete();

            $t->timestamp('last_message_at')->nullable();
            $t->timestamps();

            // Pour éviter les doublons de conversation entre 2 mêmes utilisateurs sur la même activité
            $t->unique(['user_one_id','user_two_id','activity_id']);
        });
    }

    public function down(): void {
        Schema::dropIfExists('conversations');
    }
};
