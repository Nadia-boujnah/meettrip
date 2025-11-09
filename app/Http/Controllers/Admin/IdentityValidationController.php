<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class IdentityValidationController extends Controller
{
    private function toPublicUrl(?string $path, ?string $fallback = null): ?string
    {
        if (!$path || trim($path) === '') return $fallback;
        if (preg_match('#^https?://#i', $path)) return $path;
        if (str_starts_with($path, '/storage/')) return $path;
        return '/storage/' . ltrim($path, '/');
    }

    public function index(Request $request)
    {
        // Par défaut on n’affiche QUE les comptes à traiter
        // (= tout sauf "approved")
        $status = $request->get('status', 'pending'); // pending | all

        $q = User::query()
            ->where('role', '!=', 'admin')
            ->where(function ($qq) {
                // ignorer les lignes vides héritées
                $qq->whereNotNull('email')
                   ->orWhereNotNull('prenom')
                   ->orWhereNotNull('nom');
            });

        if ($status === 'pending') {
            $q->where(function ($qq) {
                $qq->whereNull('verification_status')
                   ->orWhere('verification_status', '!=', 'approved');
            });
        }

        $users = $q->latest()
            ->paginate(25)
            ->through(function (User $u) {
                return [
                    'id'                  => $u->id,
                    'prenom'              => $u->prenom ?: ($u->name ?? ''),
                    'nom'                 => $u->nom ?? '',
                    'email'               => $u->email,
                    'role'                => $u->role,
                    'location'            => $u->location ?: '—',
                    'inscription'         => optional($u->created_at)->format('Y-m-d'),
                    'photo'               => $this->toPublicUrl($u->avatar, '/storage/avatars/default.png'),
                    'document_url'        => $this->toPublicUrl($u->document),
                    'verification_status' => $u->verification_status, // utile côté front
                ];
            })
            ->withQueryString();

        return Inertia::render('admin/IdentityValidation', [
            'participants' => $users,
            'filters' => [
                'status' => $status, // pour garder ?status=pending
            ],
        ]);
    }

    public function approve(User $user)
    {
        // tu peux supprimer cette garde si tu veux traiter aussi “organisateur”
        // if ($user->role !== 'participant') {
        //     return back()->with('error', 'Utilisateur invalide.');
        // }

        $user->forceFill([
            'verification_status' => 'approved',
        ])->save();

        // on revient sur la liste en conservant ?status=pending
        return back()->with('success', 'Identité validée.')->withInput();
    }

    public function reject(User $user)
    {
        $user->forceFill([
            'verification_status' => 'rejected',
        ])->save();

        return back()->with('success', 'Identité refusée.')->withInput();
    }
}
