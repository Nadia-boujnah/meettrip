<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Activities;

class ActivitySeeder extends Seeder
{
    public function run(): void
    {
        $activities = [
            [
                'title' => 'Visite de Rome',
                'location' => 'Rome, Italie',
                'image' => 'activities/rome.png',
                'description' => "Plongez dans l'histoire antique de Rome avec une visite guidée du Colisée et du Forum.",
                'why' => "Pour découvrir les trésors de l'Empire romain et marcher sur les pas des empereurs.",
                'host_user_id' => 1,
            ],
            [
                'title' => 'Excursion bateau',
                'location' => 'Cannes, France',
                'image' => 'activities/excursionbateau.png',
                'description' => "Naviguez au coucher du soleil le long de la Côte d'Azur.",
                'why' => "Une parenthèse détente avec vue sur les plus belles criques.",
                'host_user_id' => 1,
            ],
            [
                'title' => 'Visite de Tokyo',
                'location' => 'Tokyo, Japon',
                'image' => 'activities/visitejapon.png',
                'description' => "Explorez les rues animées de Shibuya et Asakusa avec un guide local.",
                'why' => "Pour vivre l'énergie urbaine du Japon, entre tradition et modernité.",
                'host_user_id' => 1,
            ],
            [
                'title' => 'Coucher de soleil',
                'location' => 'Nice, France',
                'image' => 'activities/couchersoleil.png',
                'description' => "Un moment paisible à partager sur les plages de Nice.",
                'why' => "Pour s'offrir un instant de calme face à la mer Méditerranée.",
                'host_user_id' => 1,
            ],
            [
                'title' => "Désert d'Agafay",
                'location' => 'Marrakech, Maroc',
                'image' => 'activities/hommedésert.png',
                'description' => "Aventure dans le désert avec dîner et feu de camp.",
                'why' => "Pour découvrir les paysages arides du Maroc dans une ambiance chaleureuse.",
                'host_user_id' => 1,
            ],
            [
                'title' => 'Exploration forêt',
                'location' => 'Banff, Japon',
                'image' => 'activities/femmeforet.png',
                'description' => "Randonnée découverte dans la forêt japonaise.",
                'why' => "Pour se reconnecter à la nature loin des sentiers touristiques.",
                'host_user_id' => 1,
            ],
            [
                'title' => 'Randonnée',
                'location' => 'Västerland, Suède',
                'image' => 'activities/montagne.png',
                'description' => "Marche guidée dans les montagnes suédoises.",
                'why' => "Pour respirer l’air pur et admirer les panoramas scandinaves.",
                'host_user_id' => 1,
            ],
            [
                'title' => 'Partage Repas locale',
                'location' => 'Cancun, Mexique',
                'image' => 'activities/repasmexique.png',
                'description' => "Découvrez les saveurs locales autour d’une grande tablée.",
                'why' => "Pour goûter aux spécialités et échanger des anecdotes culturelles.",
                'host_user_id' => 1,
            ],
            [
                'title' => 'Accrobranche',
                'location' => 'Valbonne, France',
                'image' => 'activities/femmeaccrobranche.png',
                'description' => "Une journée d’activités suspendues dans la nature.",
                'why' => "Pour se dépasser et rigoler entre amis dans un cadre verdoyant.",
                'host_user_id' => 1,
            ],
            [
                'title' => 'Atelier poterie',
                'location' => 'Mandelieu-la-Napoule',
                'image' => 'activities/poterie.png',
                'description' => 'Un atelier créatif au bord de la mer pour découvrir la poterie.',
                'why' => 'Pour apprendre une activité artisanale les pieds dans le sable.',
                'host_user_id' => 1,
            ],
            [
                'title' => 'Pique-nique bord de mer',
                'location' => 'Théoule-sur-Mer',
                'image' => 'activities/picnique.png',
                'description' => 'Partage d’un moment convivial autour d’un pique-nique au soleil.',
                'why' => 'Pour rencontrer des gens dans un cadre naturel et détendu.',
                'host_user_id' => 1,
            ],
        ];

        foreach ($activities as $activity) {
            Activities::create($activity);
        }
    }
}
