<?php

namespace Database\Seeders;

use App\Models\City;
use Illuminate\Database\Seeder;

class CitySeeder extends Seeder
{
    public function run(): void
    {
        $rows = [
            ['Paris', 'France', 48.8566, 2.3522],
            ['Marseille', 'France', 43.2965, 5.3698],
            ['Lyon', 'France', 45.7640, 4.8357],
            ['Tunis', 'Tunisie', 36.8065, 10.1815],
            ['Rome', 'Italie', 41.9028, 12.4964],
            ['Madrid', 'Espagne', 40.4168, -3.7038],
            ['Stockholm', 'Suède', 59.3293, 18.0686],
            ['Casablanca', 'Maroc', 33.5731, -7.5898],
            ['Montréal', 'Canada', 45.5017, -73.5673],
            ['New York', 'États-Unis', 40.7128, -74.0060],
        ];

        foreach ($rows as [$name, $country, $lat, $lng]) {
            City::updateOrCreate(
                ['name' => $name, 'country' => $country],
                ['lat' => $lat, 'lng' => $lng]
            );
        }
    }
}
