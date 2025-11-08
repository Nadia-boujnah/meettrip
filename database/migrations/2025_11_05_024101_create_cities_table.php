<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('cities', function (Blueprint $table) {
            $table->id();
            $table->string('name');             // Paris
            $table->string('country');          // France
            $table->decimal('lat', 10, 7);      // 48.8566000
            $table->decimal('lng', 10, 7);      // 2.3522000
            $table->timestamps();

            $table->index(['name', 'country']);
        });
    }
    public function down(): void {
        Schema::dropIfExists('cities');
    }
};
