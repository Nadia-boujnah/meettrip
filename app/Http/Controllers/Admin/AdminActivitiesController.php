<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Activities;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AdminActivitiesController extends Controller
{
    private function urlFromStorage(?string $path, ?string $fallback = null): ?string
    {
        if (!$path || trim($path) === '') {
            return $fallback;
        }
        if (preg_match('#^https?://#i', $path)) return $path;
        if (str_starts_with($path, '/storage/')) return $path;
        return '/storage/' . ltrim($path, '/');
    }

    public function index(Request $request)
    {
        $search   = trim((string) $request->query('search', ''));
        $location = trim((string) $request->query('location', ''));
        $perPage  = (int) $request->query('perPage', 10);

        $q = Activities::query()
            ->with('hostUser:id,name')
            ->latest();

        if ($search !== '') {
            $q->where(function ($qq) use ($search) {
                $qq->where('title', 'like', "%{$search}%")
                   ->orWhereHas('hostUser', function ($qh) use ($search) {
                       $qh->where('name', 'like', "%{$search}%");
                   });
            });
        }

        if ($location !== '') {
            $q->where('location', $location);
        }

        $activities = $q->paginate($perPage)->through(function (Activities $a) {
            // dates peut être un tableau JSON ou une seule date
            $dates = [];
            if (is_array($a->dates) && count($a->dates)) {
                $dates = $a->dates;
            } elseif (!empty($a->date)) {
                $dates = [$a->date];
            }

            return [
                'id'           => $a->id,
                'title'        => $a->title,
                'location'     => $a->location,
                'participants' => (int) $a->participants,
                'dates'        => $dates,
                'image'        => $this->urlFromStorage($a->image_url ?: $a->image, '/storage/activities/default.png'),
                'host_user'    => [
                    'name' => $a->hostUser?->name ?? '—',
                ],
            ];
        })->withQueryString();

        $locations = Activities::query()
            ->whereNotNull('location')
            ->distinct()
            ->orderBy('location')
            ->pluck('location')
            ->values();

        return Inertia::render('admin/AdminActivities', [
            'activities' => $activities,
            'filters'    => [
                'search'   => $search,
                'location' => $location,
                'perPage'  => $perPage,
            ],
            'locations'  => $locations,
        ]);
    }

    public function destroy(Activities $activity)
    {
        $activity->delete();
        return back()->with('success', 'Activité supprimée.');
    }
}
