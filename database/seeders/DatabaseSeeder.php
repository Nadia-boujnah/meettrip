<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Database\Seeders\ActivitySeeder;
use Database\Seeders\CitySeeder;
use Database\Seeders\DemoInteractionSeeder;
use Database\Seeders\DemoUsersSeeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Si tu veux aussi peupler les utilisateurs avec factory :
        // \App\Models\User::factory(5)->create();

        // Appelle tes seeders dans le bon ordre
        $this->call([
            ActivitySeeder::class,
            DemoInteractionSeeder::class,
            CitySeeder::class,
            DemoUsersSeeder::class, // ✅ ton seeder d’utilisateurs
        ]);
    }
}
