<?php

namespace App\Http\Controllers;

use App\Models\Activities;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class ReservationsController extends Controller
{
    // GET /my-reservations
    public function index()
    {
        $user = Auth::user();

        $reservations = $user->reservedActivities()
            ->with(['hostUser:id,name,prenom,nom'])
            ->latest('activity_user.created_at')
            ->get()
            ->map(function ($a) {
                return [
                    'id'           => $a->id,
                    'title'        => $a->title,
                    'location'     => $a->location,
                    'description'  => $a->description,
                    'dates'        => $a->dates ?? [],
                    'date'         => $a->date,
                    'image'        => $a->image,
                    'image_url'    => $a->image_url,
                    'host_user'    => $a->hostUser?->only(['id','name','prenom','nom']),
                    'status'       => $a->pivot->status, // pending/accepted/rejected
                ];
            });

        return Inertia::render('MyReservations', [
            'reservations' => $reservations,
        ]);
    }

    // POST /activities/{id}/reserve
    public function store(Request $request, int $id)
    {
        $user = Auth::user();
        $activity = Activities::findOrFail($id);

        // Sécurité basique : l’host ne réserve pas sa propre activité
        if ($activity->host_user_id === $user->id) {
            return back()->with('error', "Vous êtes l'organisatrice/organisateur de cette activité.");
        }

        // Évite les doublons
        $already = $user->reservedActivities()->where('activities.id', $id)->exists();
        if ($already) {
            return back()->with('info', 'Réservation déjà enregistrée.');
        }

        $user->reservedActivities()->attach($id, ['status' => 'pending']);

        return back()->with('success', 'Réservation créée (en attente de validation).');
    }
}
