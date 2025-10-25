<?php

use App\Models\User;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    
    public function up(): void
    {
        Schema::create('activities', function (Blueprint $table) {
            $table->id();
            $table->string('image')->nullable(); // URL de l'image
            $table->string('title'); // Titre de l'activité
            $table->string('location'); // Lieu
            $table->double('longitude')->nullable(); // Coordonnée
            $table->double('latitude')->nullable();  // Coordonnée
            $table->unsignedInteger('participants')->default(0); // Nombre actuel de participants
            $table->text('description'); // Description
            $table->string('why'); // Pourquoi participer ?
            $table->foreignIdFor(User::class, 'host_user_id') // Clé étrangère
                  ->nullable()
                  ->constrained('users')
                  ->onDelete('cascade');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('activities');
    }
};
