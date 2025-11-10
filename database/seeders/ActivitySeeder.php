<?php

namespace Database\Seeders;

use App\Models\Activities;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class ActivitySeeder extends Seeder
{
    public function run(): void
    {
        $now = now();

        // Helper pour créer ou récupérer un hôte
        $ensureHost = function (string $name): int {
            $email = Str::slug($name, '.') . '@example.com';
            $user = User::firstOrCreate(
                ['email' => $email],
                [
                    'name' => $name,
                    'password' => Hash::make('password'),
                    'role' => 'user',
                    'created_at' => now(),
                    'updated_at' => now(),
                ]
            );
            return $user->id;
        };

        $activities = [
            [
                'title' => 'Visite de Rome',
                'image' => 'rome.png',
                'location' => 'Rome, Italie',
                'latitude' => 41.9028,
                'longitude' => 12.4964,
                'participants' => 3,
                'description' => "Plongez dans l'histoire antique de Rome avec une visite guidée du Colisée et du Forum.",
                'host_user_id' => $ensureHost('Giulia Romano'),
                'dates' => ['05-08-2025', '20-08-2025'],
            ],
            [
                'title' => 'Excursion bateau',
                'image' => 'excursionbateau.png',
                'location' => 'Cannes, France',
                'latitude' => 43.5528,
                'longitude' => 7.0174,
                'participants' => 2,
                'description' => "Naviguez au coucher du soleil le long de la Côte d'Azur.",
                'host_user_id' => $ensureHost('Marc Delacroix'),
                'dates' => ['10-08-2025', '25-08-2025'],
            ],
            [
                'title' => 'Visite de Tokyo',
                'image' => 'visitejapon.png',
                'location' => 'Tokyo, Japon',
                'latitude' => 35.6895,
                'longitude' => 139.6917,
                'participants' => 1,
                'description' => "Explorez les rues animées de Shibuya et Asakusa avec un guide local.",
                'host_user_id' => $ensureHost('Aiko Nakamura'),
                'dates' => ['12-08-2025', '30-08-2025'],
            ],
            [
                'title' => 'Coucher de soleil',
                'image' => 'couchersoleil.png',
                'location' => 'Nice, France',
                'latitude' => 43.7102,
                'longitude' => 7.2620,
                'participants' => 4,
                'description' => "Un moment paisible à partager sur les plages de Nice.",
                'host_user_id' => $ensureHost('Claire Morel'),
                'dates' => ['15-08-2025', '28-08-2025'],
            ],
            [
                'title' => "Désert d'Agafay",
                'image' => 'hommedésert.png',
                'location' => 'Marrakech, Maroc',
                'latitude' => 31.3965,
                'longitude' => -8.1116,
                'participants' => 4,
                'description' => "Aventure dans le désert avec dîner et feu de camp.",
                'host_user_id' => $ensureHost('Youssef Benali'),
                'dates' => ['18-08-2025', '28-08-2025'],
            ],
            [
                'title' => 'Exploration forêt',
                'image' => 'femmeforet.png',
                'location' => 'Banff, Japon',
                'latitude' => 36.2048,
                'longitude' => 138.2529,
                'participants' => 3,
                'description' => "Randonnée découverte dans la forêt japonaise.",
                'host_user_id' => $ensureHost('Haruki Tanaka'),
                'dates' => ['07-08-2025', '22-08-2025'],
            ],
            [
                'title' => 'Randonnée',
                'image' => 'montagne.png',
                'location' => 'Västerland, Suède',
                'latitude' => 58.9690,
                'longitude' => 11.2340,
                'participants' => 4,
                'description' => "Marche guidée dans les montagnes suédoises.",
                'host_user_id' => $ensureHost('Lina Svensson'),
                'dates' => ['13-08-2025', '27-08-2025'],
            ],
            [
                'title' => 'Partage Repas locale',
                'image' => 'repasmexique.png',
                'location' => 'Cancun, Mexique',
                'latitude' => 21.1619,
                'longitude' => -86.8515,
                'participants' => 2,
                'description' => "Découvrez les saveurs locales autour d’une grande tablée.",
                'host_user_id' => $ensureHost('Carlos Méndez'),
                'dates' => ['09-10-2025', '02-09-2025'],
            ],
            [
                'title' => 'Accrobranche',
                'image' => 'femmeaccrobranche.png',
                'location' => 'Valbonne, France',
                'latitude' => 43.6411,
                'longitude' => 7.0086,
                'participants' => 3,
                'description' => "Une journée d’activités suspendues dans la nature.",
                'host_user_id' => $ensureHost('Julie Forestier'),
                'dates' => ['15-09-2025', '20-09-2025'],
            ],
            [
                'title' => 'Atelier poterie',
                'image' => 'poterie.png',
                'location' => 'Mandelieu-la-Napoule',
                'latitude' => 43.5436,
                'longitude' => 6.9370,
                'participants' => 1,
                'description' => 'Un atelier créatif au bord de la mer pour découvrir la poterie.',
                'host_user_id' => $ensureHost('Nadia BOUJNAH'),
                'dates' => ['25-07-2025'],
            ],
            [
                'title' => 'Pique-nique bord de mer',
                'image' => 'picnique.png',
                'location' => 'Théoule-sur-Mer',
                'latitude' => 43.5039,
                'longitude' => 6.9387,
                'participants' => 1,
                'description' => 'Partage d’un moment convivial autour d’un pique-nique au soleil.',
                'host_user_id' => $ensureHost('Nadia BOUJNAH'),
                'dates' => ['28-07-2025'],
            ],
        ];

        foreach ($activities as $a) {
            Activities::updateOrCreate(['title' => $a['title']], array_merge($a, [
                'created_at' => $now,
                'updated_at' => $now,
            ]));
        }
    }
}
