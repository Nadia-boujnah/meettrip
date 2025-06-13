<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('activity_dates', function (Blueprint $table) {
            $table->id();
            $table->foreignId('activity_id')->constrained()->onDelete('cascade');
            $table->date('date');
            $table->timestamps();

            $table->unique(['activity_id', 'date']); // Évite les doublons de date pour une même activité
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('activity_dates');
    }
};
