<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // Si tu veux aussi peupler les utilisateurs avec factory :
        \App\Models\User::factory(5)->create();

        // Appelle ton ActivitySeeder
        $this->call([
            ActivitySeeder::class,
        ]);
    }
}
