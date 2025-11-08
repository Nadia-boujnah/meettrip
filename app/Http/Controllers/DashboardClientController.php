<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class DashboardClientController extends Controller
{
    public function client()
    {
        $me = Auth::id();

        // 🟦 2 dernières réservations (table pivot activity_user)
        $reservations = DB::table('activity_user as au')
            ->join('activities as a', 'a.id', '=', 'au.activity_id')
            ->select('au.id', 'a.title', 'a.location', 'au.created_at as date')
            ->where('au.user_id', $me)
            ->orderByDesc('au.created_at')
            ->limit(2)
            ->get();

   // 🟩 2 dernières conversations + nom de l’organisateur (fallback: u.name)
$threads = DB::table('conversations as c')
    ->leftJoin('activities as act', 'act.id', '=', 'c.activity_id')
    ->leftJoin('users as u', 'u.id', '=', 'act.host_user_id')
    ->where(function ($q) use ($me) {
        $q->where('c.user_one_id', $me)->orWhere('c.user_two_id', $me);
    })
    ->orderByDesc('c.last_message_at')
    ->limit(2)
    ->get([
        'c.id',
        DB::raw("COALESCE(u.name, 'Organisateur') as organizer_name"),
        'c.last_message_at',
    ]);


        // 🟨 2 dernières annonces créées par l’utilisateur
        $annonces = DB::table('activities')
            ->select('id', 'title', 'location', 'created_at as date')
            ->where('host_user_id', $me)
            ->orderByDesc('created_at')
            ->limit(2)
            ->get();

        // 🔹 Envoi vers Inertia (Dashboard.jsx)
        return Inertia::render('Dashboard', [
            'auth'         => ['user' => Auth::user()],
            'reservations' => $reservations,
            'threads'      => $threads,
            'annonces'     => $annonces,
        ]);
    }
}
