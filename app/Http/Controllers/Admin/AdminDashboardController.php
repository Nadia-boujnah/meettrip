<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Activities;
use Inertia\Inertia;

class AdminDashboardController extends Controller
{
    public function index()
    {
        // -- Base : on exclut les admins
        $baseUsers = User::query()->where('role', '!=', 'admin');

        // -- Anti-brouillon (même filtre que Statistics + IdentityValidation)
        $baseUsersWithRealInfo = (clone $baseUsers)->where(function ($q) {
            $q->whereNotNull('email')
              ->orWhereNotNull('prenom')
              ->orWhereNotNull('nom');
        });

        // --- Compteurs utilisateurs (même logique que Statistics) ---
        $totalUsers = (clone $baseUsersWithRealInfo)->count();

        $validated = (clone $baseUsersWithRealInfo)
            ->where('verification_status', 'approved')
            ->count();

        // ✅ Identités à valider = NULL OU != 'approved' (exactement comme Statistics)
        $toReview = (clone $baseUsersWithRealInfo)
            ->where(function ($q) {
                $q->whereNull('verification_status')
                  ->orWhere('verification_status', '!=', 'approved');
            })
            ->count();

        // Si tu veux uniquement ceux qui ont un document, dé-commente :
        // ->whereNotNull('document')->where('document', '!=', '')

        // Répartition des rôles (pas besoin d’anti-brouillon ici)
        $organizers   = (clone $baseUsers)->where('role', 'organisateur')->count();
        $participants = (clone $baseUsers)->where('role', 'participant')->count();

        // --- Activités ---
        $totalActivities = Activities::count();

        // --- Série mensuelle des activités (année courante) ---
        $year = now()->year;

        // SQLite friendly
        $perMonth = Activities::selectRaw('CAST(STRFTIME("%m", created_at) AS INTEGER) as m, COUNT(*) as c')
            ->whereYear('created_at', $year)
            ->groupBy('m')
            ->pluck('c', 'm');

        $labels = ['Janv','Fév','Mars','Avr','Mai','Juin','Juil','Août','Sept','Oct','Nov','Déc'];
        $series = [];
        for ($m = 1; $m <= 12; $m++) {
            $series[] = (int) ($perMonth[$m] ?? 0);
        }

        return Inertia::render('admin/AdminDashboard', [
            'metrics' => [
                'users'      => $totalUsers,
                'validated'  => $validated,
                'activities' => $totalActivities,
                'toReview'   => $toReview, // << doit matcher Statistics (ici 5)
            ],
            'breakdown' => [
                'validated'    => $validated,
                'pending'      => $toReview,   // même notion que “à valider”
                'rejected'     => (clone $baseUsersWithRealInfo)->where('verification_status', 'rejected')->count(),
                'organizers'   => $organizers,
                'participants' => $participants,
            ],
            'activitySeries' => [
                'labels' => $labels,
                'data'   => $series,
                'year'   => $year,
            ],
        ]);
    }
}
