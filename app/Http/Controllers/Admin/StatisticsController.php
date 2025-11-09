<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Activities;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class StatisticsController extends Controller
{
    public function index()
    {
        // -- On exclut les admins --
        $baseUsers = User::query()->where('role', '!=', 'admin');

        // -- Anti-brouillon : on garde uniquement les vrais comptes (mêmes filtres que la page IdentityValidation) --
        $baseUsersWithRealInfo = (clone $baseUsers)->where(function ($q) {
            $q->whereNotNull('email')
              ->orWhereNotNull('prenom')
              ->orWhereNotNull('nom');
        });

        // --- Compteurs utilisateurs ---
        $totalUsers = (clone $baseUsersWithRealInfo)->count();

        $validatedUsers = (clone $baseUsersWithRealInfo)
            ->where('verification_status', 'approved')
            ->count();

        // ✅ Identités à valider (même logique que la page /admin/identity-validation)
        $toReview = (clone $baseUsersWithRealInfo)
            ->where(function ($q) {
                $q->whereNull('verification_status')
                  ->orWhere('verification_status', '!=', 'approved');
            })
            ->count();

        // Si tu veux compter seulement ceux avec document :
        // ->whereNotNull('document')->where('document', '!=', '')

        // --- Rôles ---
        $organisateurs = (clone $baseUsers)->where('role', 'organisateur')->count();
        $participants  = (clone $baseUsers)->where('role', 'participant')->count();

        // --- Activités ---
        $totalActivities = Activities::count();

        // --- Statistiques d’évolution mensuelle des activités ---
        $year = now()->year;

        // Pour SQLite (compatible avec ta config actuelle)
        $perMonth = Activities::selectRaw('CAST(STRFTIME("%m", created_at) AS INTEGER) as m, COUNT(*) as c')
            ->whereYear('created_at', $year)
            ->groupBy('m')
            ->pluck('c', 'm');

        // On prépare un tableau [janv→déc] avec 0 si aucun résultat
        $series = [];
        for ($m = 1; $m <= 12; $m++) {
            $series[] = (int) ($perMonth[$m] ?? 0);
        }

        return Inertia::render('admin/Statistics', [
            'stats' => [
                'users'                => $totalUsers,
                'validated'            => $validatedUsers,
                'activities'           => $totalActivities,
                'identitiesToValidate' => $toReview,
                'roles' => [
                    'organisateurs' => $organisateurs,
                    'participants'  => $participants,
                ],
                'year'   => $year,
                'series' => $series,
            ],
        ]);
    }
}
