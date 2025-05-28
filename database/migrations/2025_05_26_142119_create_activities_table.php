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
            $table->string('image')->nullable(); // chemin de l'image
            $table->string('title');
            $table->string('location');
            $table->double('longitude')->nullable();
            $table->double('latitude')->nullable();
            $table->unsignedInteger('participants')->default(0);
            $table->string('description');
            $table->string('why');
            $table->foreignIdFor(User::class, 'host_user')->nullable()->constrained();
            $table->timestamps();

            // Clé étrangère (optionnelle)
            $table->foreign('host_user_id')->references('id')->on('users')->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('activities');
    }
};
