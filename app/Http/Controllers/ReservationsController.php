<?php

namespace App\Http\Controllers;

use App\Models\Activities;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage; // pour construire l'URL de l'image
use Inertia\Inertia;

class ReservationsController extends Controller
{
    /**
     * VOYAGEUR — Mes réservations
     * GET /my-reservations
     */
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
                    'image_url'    => $a->image_url, // accessor du modèle Activities
                    'host_user'    => $a->hostUser?->only(['id','name','prenom','nom']),
                    'status'       => $a->pivot->status,
                ];
            });

        return Inertia::render('MyReservations', [
            'reservations' => $reservations,
        ]);
    }

    /**
     * Créer une réservation (voyageur)
     * POST /activities/{id}/reserve
     */
    public function store(Request $request, int $id)
    {
        $user   = Auth::user();
        $activity = Activities::findOrFail($id);

        if ($activity->host_user_id === $user->id) {
            return back()->with('error', "Vous êtes l'organisateur·rice de cette activité.");
        }

        $already = $user->reservedActivities()->where('activities.id', $id)->exists();
        if ($already) {
            return back()->with('info', 'Réservation déjà enregistrée.');
        }

        $requestedDate = $request->input('requested_date');

        $user->reservedActivities()->attach($id, [
            'host_id'        => $activity->host_user_id,
            'status'         => 'pending',
            // 'requested_date' => $requestedDate,
        ]);

        return back()->with('success', 'Demande envoyée. En attente de validation de l’organisateur.');
    }

    /**
     * ORGANISATEUR — Demandes reçues
     * GET /host/reservations
     */
    public function inbox()
    {
        $hostId = Auth::id();

        $rows = DB::table('activity_user AS au')
            ->join('activities AS a', 'a.id', '=', 'au.activity_id')
            ->join('users AS guest', 'guest.id', '=', 'au.user_id')
            ->where('au.host_id', $hostId)
            ->orderByDesc('au.created_at')
            ->get([
                'au.activity_id',
                'au.user_id as guest_id',
                'au.status',
                'au.created_at',
                'a.title',
                'a.location',
                'a.image',
                'a.dates',
                'guest.name as guest_name',
                'guest.prenom as guest_prenom',
                'guest.nom as guest_nom',
            ])
            ->map(function ($r) {
                // Nom invité
                $guestDisplay = trim(($r->guest_prenom ?? '').' '.($r->guest_nom ?? ''));
                if ($guestDisplay === '') {
                    $guestDisplay = $r->guest_name ?? 'Invité';
                }

                // ✅ URL image publique
                $imageUrl = null;
                if (!empty($r->image)) {
                    if (str_starts_with($r->image, 'http') || str_starts_with($r->image, '/')) {
                        $imageUrl = $r->image;
                    } else {
                        $filename = basename($r->image);
                        if (Storage::disk('public')->exists("activities/{$filename}")) {
                            // ✅ Cas exact : public/storage/activities
                            $imageUrl = asset("storage/activities/{$filename}");
                        } elseif (file_exists(public_path("storage/activities/{$filename}"))) {
                            $imageUrl = asset("storage/activities/{$filename}");
                        }
                    }
                }

                if (!$imageUrl) {
                    $imageUrl = asset('images/placeholder.png'); // image de secours
                }

                // ✅ Date à afficher : 1ère valeur du JSON "dates"
                $date = null;
                if ($r->dates) {
                    $arr = json_decode($r->dates, true);
                    if (is_array($arr) && count($arr) > 0) {
                        $date = $arr[0] ?? null;
                    }
                }

                return [
                    'activity_id' => $r->activity_id,
                    'guest_id'    => $r->guest_id,
                    'status'      => $r->status,
                    'created_at'  => $r->created_at,
                    'activity'    => [
                        'title'     => $r->title,
                        'location'  => $r->location,
                        'image'     => $r->image,
                        'image_url' => $imageUrl,
                        'date'      => $date,
                    ],
                    'guest'       => [
                        'id'   => $r->guest_id,
                        'name' => $guestDisplay,
                    ],
                ];
            });

        return Inertia::render('Host/Reservations', [
            'items' => $rows,
        ]);
    }

    /**
     * ORGANISATEUR — Accepter une demande
     */
    public function accept(int $activityId, int $guestId)
    {
        $updated = DB::table('activity_user')
            ->where('activity_id', $activityId)
            ->where('user_id', $guestId)
            ->where('host_id', Auth::id())
            ->where('status', 'pending')
            ->update([
                'status'     => 'accepted',
                'updated_at' => now(),
            ]);

        if (!$updated) {
            return back()->with('error', 'Impossible de valider cette demande.');
        }

        return back()->with('success', 'Réservation acceptée.');
    }

    /**
     * ORGANISATEUR — Refuser une demande
     */
    public function decline(int $activityId, int $guestId)
    {
        $updated = DB::table('activity_user')
            ->where('activity_id', $activityId)
            ->where('user_id', $guestId)
            ->where('host_id', Auth::id())
            ->where('status', 'pending')
            ->update([
                'status'     => 'declined',
                'updated_at' => now(),
            ]);

        if (!$updated) {
            return back()->with('error', 'Impossible de refuser cette demande.');
        }

        return back()->with('success', 'Réservation refusée.');
    }
        /**
     * ORGANISATEUR — Mettre à jour le statut (accepted / declined / pending)
     * PATCH /host/reservations/{activity}/{guest}/status
     */
    public function updateStatus(Request $request, int $activityId, int $guestId)
    {
        $hostId = Auth::id();

        $data = $request->validate([
            'status' => 'required|string|in:pending,accepted,declined',
        ]);

        $updated = DB::table('activity_user')
            ->where('activity_id', $activityId)
            ->where('user_id', $guestId)
            ->where('host_id', $hostId)
            ->update([
                'status'     => $data['status'],
                'updated_at' => now(),
            ]);

        if (!$updated) {
            return back()->with('error', 'Impossible de modifier le statut de cette demande.');
        }

        $labels = [
            'pending'  => 'remise en attente',
            'accepted' => 'acceptée',
            'declined' => 'refusée',
        ];

        return back()->with('success', 'Réservation '.$labels[$data['status']].'.');
    }

}
