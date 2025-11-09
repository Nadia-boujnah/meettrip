<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AdminOrganizersController extends Controller
{
    /** Convertit la valeur de 'avatar' en URL publique exploitable */
    private function avatarUrl(?string $avatar): string
    {
        if (!$avatar || trim($avatar) === '') {
            return '/images/avatars/default.png'; // mets un fallback réel si tu veux
        }

        // URL absolue ?
        if (preg_match('#^https?://#i', $avatar)) {
            return $avatar;
        }

        // Déjà préfixé par /storage/...
        if (str_starts_with($avatar, '/storage/')) {
            return $avatar;
        }

        // Cas normal: 'avatars/xxx.png' => '/storage/avatars/xxx.png'
        return '/storage/' . ltrim($avatar, '/');
    }

    /** Convertit la valeur 'document' en URL publique si fournie */
    private function documentUrl(?string $path): ?string
    {
        if (!$path || trim($path) === '') return null;

        if (preg_match('#^https?://#i', $path)) return $path;
        if (str_starts_with($path, '/storage/')) return $path;

        return '/storage/' . ltrim($path, '/');
    }

    /** Map du statut de vérification vers un libellé affichable */
    private function verificationLabel($user): string
    {
        // Si tu utilises 'verification_status' dans users: 'pending' | 'approved' | 'rejected'
        $s = $user->verification_status ?? null;
        return match ($s) {
            'approved' => 'Oui',
            'rejected' => 'Refusé',
            'pending'  => 'En Attente',
            default    => ($user->email_verified_at ? 'Oui' : 'En Attente'),
        };
    }

    public function index(Request $request)
    {
        $search  = trim($request->get('search', ''));
        $date    = $request->get('date'); // 'YYYY-MM-DD'
        $perPage = (int) $request->get('perPage', 10);

        // ⚠️ RÔLES EN FRANÇAIS
        $ORG_ROLES = ['organisateur', 'organizer']; // on accepte les deux par sécurité

        // --- Organisateurs (avec filtres serveur)
        $orgBase = User::query()->whereIn('role', $ORG_ROLES);

        if ($search !== '') {
            $orgBase->where(function ($q) use ($search) {
                $q->where('prenom', 'like', "%{$search}%")
                  ->orWhere('nom', 'like', "%{$search}%")
                  ->orWhere('name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%");
            });
        }
        if ($date) {
            $orgBase->whereDate('created_at', '=', $date);
        }

        $organizers = $orgBase->latest()
            ->paginate($perPage)
            ->through(function (User $u) {
                return [
                    'id'           => $u->id,
                    'prenom'       => $u->prenom ?: ($u->name ?? ''),
                    'nom'          => $u->nom ?? '',
                    'email'        => $u->email,
                    'photo'        => $this->avatarUrl($u->avatar),            // ✅ avatar -> URL
                    'document_url' => $this->documentUrl($u->document),        // ✅ doc -> URL publique
                    'verifie'      => $this->verificationLabel($u),            // ✅ Oui / En Attente / Refusé
                    'inscription'  => optional($u->created_at)->format('Y-m-d'),
                ];
            })
            ->withQueryString();

        // --- Participants (liste simple)
        $participants = User::query()
            ->where('role', 'participant')
            ->latest()
            ->take(50)
            ->get()
            ->map(function (User $u) {
                return [
                    'id'          => $u->id,
                    'prenom'      => $u->prenom ?: ($u->name ?? ''),
                    'nom'         => $u->nom ?? '',
                    'email'       => $u->email,
                    'photo'       => $this->avatarUrl($u->avatar),            // ✅
                    'verifie'     => $this->verificationLabel($u),            // ✅
                    'inscription' => optional($u->created_at)->format('Y-m-d'),
                ];
            });

        return Inertia::render('admin/AdminOrganizers', [
            'organizers'   => $organizers,
            'participants' => $participants,
            'filters'      => [
                'search'  => $search,
                'date'    => $date,
                'perPage' => $perPage,
            ],
        ]);
    }

    public function destroy(User $user)
    {
        $user->delete(); // ou soft delete si activé
        return back()->with('success', 'Compte supprimé.');
    }
}
