<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('messages', function (Blueprint $t) {
            $t->id();

            // Relation avec la conversation
            $t->foreignId('conversation_id')->constrained('conversations')->cascadeOnDelete();

            // Auteur du message
            $t->foreignId('sender_id')->constrained('users')->cascadeOnDelete();

            // Contenu du message
            $t->text('body');

            // Statut de lecture
            $t->timestamp('read_at')->nullable();

            $t->timestamps();
        });
    }

    public function down(): void {
        Schema::dropIfExists('messages');
    }
};
