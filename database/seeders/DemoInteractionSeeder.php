<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use App\Models\User;
use App\Models\Activities;

class DemoInteractionSeeder extends Seeder
{
    public function run(): void
    {
        // 1) Organisatrice démo
        $host = User::firstOrCreate(
            ['email' => 'host.demo@test.com'],
            [
                'name' => 'Hôte Démo',
                'password' => Hash::make('password'),
                'role' => 'user',
                'email_verified_at' => now(),
            ]
        );

        // 2) Claire Morel (participante)
        $claire = User::firstOrCreate(
            ['email' => 'claire.morel@test.com'],
            [
                'name' => 'Claire Morel',
                'password' => Hash::make('password'),
                'role' => 'user',
                'email_verified_at' => now(),
            ]
        );

        // 3) Une activité hébergée par l’organisatrice
        $activity = Activities::firstOrCreate(
            ['title' => 'Excursion bateau', 'host_user_id' => $host->id],
            [
                'location'     => 'Cannes, France',
                'participants' => 8,
                'description'  => 'Naviguez au coucher du soleil.',
                // image depuis assets front (pas storage)
                'image'        => 'images/excursionbateau.png',
                // dates stockées en JSON (ton modèle cast en array)
                'dates'        => ['10-08-2025', '25-08-2025'],
                'latitude'     => 43.5528,
                'longitude'    => 7.0174,
            ]
        );

        // 4) Réservation de Claire -> statut "pending"
        if (! $claire->reservedActivities()->where('activities.id', $activity->id)->exists()) {
            $claire->reservedActivities()->attach($activity->id, [
                'status' => 'pending',
                // 'requested_date' => '2025-08-25', // dé-commente si tu as ajouté la colonne
            ]);
        }
    }
}
