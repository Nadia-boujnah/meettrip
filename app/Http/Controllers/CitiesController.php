<?php

namespace App\Http\Controllers;

use App\Models\City;
use Illuminate\Http\Request;

class CitiesController extends Controller
{
    // petite recherche "LIKE" locale, sans API externe
    public function search(Request $request)
    {
        $q = trim((string) $request->query('q', ''));
        if ($q === '' || mb_strlen($q) < 2) {
            return response()->json([]);
        }

        $cities = City::query()
            ->where('name', 'like', "%{$q}%")
            ->orWhere('country', 'like', "%{$q}%")
            ->orderBy('name')
            ->limit(20)
            ->get(['id', 'name', 'country', 'lat', 'lng'])
            ->map(fn($c) => [
                'id' => $c->id,
                'label' => "{$c->name}, {$c->country}",
                'name' => $c->name,
                'country' => $c->country,
                'lat' => (float)$c->lat,
                'lng' => (float)$c->lng,
            ]);

        return response()->json($cities);
    }
}
