<?php

namespace Database\Seeders;

use App\Models\Activities;
use App\Models\Activity;
use Illuminate\Database\Seeder;
use App\Models\User;

class ActivitySeeder extends Seeder
{
    public function run(): void
    {

        $user = User::firstOrCreate(
            ['email' => 'test@example.com'],
            ['name' => 'Test User', 'password' => bcrypt('password')]
        );

        Activities::create([
            'title' => 'Randonnée dans les Alpes',
            'location' => 'Chamonix',
            'latitude' => 45.9237,
            'longitude' => 6.8694,
            'participants' => 5,
            'description' => 'Une randonnée en montagne avec des vues incroyables.',
            'why' => 'Rencontrer des passionnés de nature et prendre l’air.',
            'image' => 'https://example.com/image.jpg',
            'host_user_id' => $user->id,
        ]);
    }
}




