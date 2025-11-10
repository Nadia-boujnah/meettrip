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

        // -- Comptes "réels"
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

        // Identités à valider
        $toReview = (clone $baseUsersWithRealInfo)
            ->where(function ($q) {
                $q->whereNull('verification_status')
                  ->orWhere('verification_status', '!=', 'approved');
            })
            ->count();

        // Rôles
        $organisateurs = (clone $baseUsers)->where('role', 'organisateur')->count();
        $participants  = (clone $baseUsers)->where('role', 'participant')->count();

        // Activités
        $totalActivities = Activities::count();

        // ---- Evolution mensuelle (multi-SGBD) ----
        $year   = now()->year;
        $driver = DB::connection()->getDriverName(); // "mysql", "mariadb", "sqlite", ...

        if (in_array($driver, ['mysql', 'mariadb'])) {
            // MySQL / MariaDB
            $perMonth = Activities::selectRaw('MONTH(created_at) as m, COUNT(*) as c')
                ->whereYear('created_at', $year)
                ->groupByRaw('MONTH(created_at)')
                ->orderBy('m')
                ->pluck('c', 'm');
        } elseif ($driver === 'sqlite') {
            // SQLite
            $perMonth = Activities::selectRaw('CAST(STRFTIME("%m", created_at) AS INTEGER) as m, COUNT(*) as c')
                ->whereYear('created_at', $year)
                ->groupBy('m')
                ->orderBy('m')
                ->pluck('c', 'm');
        } else {
            // Fallback (ex. PostgreSQL)
            $perMonth = Activities::selectRaw('EXTRACT(MONTH FROM created_at)::int as m, COUNT(*) as c')
                ->whereYear('created_at', $year)
                ->groupBy('m')
                ->orderBy('m')
                ->pluck('c', 'm');
        }

        // Tableau [janv→déc]
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
