<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Activities;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class ProfileController extends Controller
{
    /**
     * Helper: mappe une activité au format attendu par le front,
     * en produisant une URL d'image fiable (storage OU absolue).
     */
    private function mapActivity(Activities $a): array
    {
        // 1) URL absolue déjà fournie (CDN, http/https)
        if ($a->image_url && preg_match('#^https?://#i', $a->image_url)) {
            $full = $a->image_url;
        }
        // 2) Fichier stocké sur le disque "public" (ex: activities/rome.png)
        elseif ($a->image) {
            $path = str_starts_with($a->image, 'activities/')
                ? $a->image
                : ('activities/' . ltrim($a->image, '/'));
           $full = Storage::url($path);
        }
        // 3) Fallback: pas d'image
        else {
            $full = null;
        }

        return [
            'id'          => $a->id,
            'title'       => $a->title,
            'location'    => $a->location,
            'description' => $a->description,
            'dates'       => $a->dates ?? [],
            'image'       => $a->image,       // valeur brute côté BDD
            'image_url'   => $a->image_url,   // valeur brute éventuelle
            'image_full'  => $full,           // ✅ URL affichable directement
        ];
    }

    /**
     * Mon espace profil (utilisateur connecté)
     * GET /profil
     */
    public function me()
    {
        abort_unless(Auth::check(), 403);
        $u = Auth::user();

        $base = Activities::query()->where('host_user_id', $u->id);
        $activities_count = (clone $base)->count();

        $activities = (clone $base)
            ->latest()
            ->take(12)
            ->get()
            ->map(fn ($a) => $this->mapActivity($a));

        return Inertia::render('Profil', [
            'isOwner'          => true,
            'activities'       => $activities,
            'activities_count' => $activities_count,
            'user' => [
                'id'        => $u->id,
                'prenom'    => $u->prenom,
                'nom'       => $u->nom,
                'bio'       => $u->bio,
                'location'  => $u->location,
                'role'      => $u->role,
                'verifie'   => $u->verification_status === 'verified',
                'photo'     => $u->avatar   ? Storage::url($u->avatar)   : null,
                'document'  => $u->document ? Storage::url($u->document) : null,
            ],
        ]);
    }

    /**
     * Formulaire d’édition de mon profil
     * GET /profil/modifier
     */
    public function edit()
    {
        abort_unless(Auth::check(), 403);
        $u = Auth::user();

        return Inertia::render('EditProfil', [
            'user' => [
                'prenom'    => $u->prenom,
                'nom'       => $u->nom,
                'bio'       => $u->bio,
                'location'  => $u->location,
                'avatar'    => $u->avatar   ? Storage::url($u->avatar)   : null,
                'document'  => $u->document ? Storage::url($u->document) : null,
            ],
        ]);
    }

    /**
     * Soumission du formulaire d’édition
     * PUT /profil
     */
    public function update(Request $request)
    {
        abort_unless(Auth::check(), 403);
        $u = Auth::user();

        $data = $request->validate([
            'prenom'   => ['nullable', 'string', 'max:120'],
            'nom'      => ['nullable', 'string', 'max:120'],
            'bio'      => ['nullable', 'string', 'max:1000'],
            'location' => ['nullable', 'string', 'max:255'],
            'avatar'   => ['nullable', 'image', 'mimes:jpg,jpeg,png,webp', 'max:2048'],
            'document' => ['nullable', 'file',  'mimes:jpg,jpeg,png,pdf', 'max:4096'],
        ]);

        // Avatar
        if ($request->hasFile('avatar')) {
            if ($u->avatar && Storage::disk('public')->exists($u->avatar)) {
                Storage::disk('public')->delete($u->avatar);
            }
            $data['avatar'] = $request->file('avatar')->store('avatars', 'public');
        }

        // Document d’identité → on marque comme "verified"
        if ($request->hasFile('document')) {
            if ($u->document && Storage::disk('public')->exists($u->document)) {
                Storage::disk('public')->delete($u->document);
            }
            $data['document'] = $request->file('document')->store('documents', 'public');
            $data['verification_status'] = 'verified';
        }

        // Mettre à jour aussi 'name' (fallback d’affichage)
        $display = trim(($data['prenom'] ?? $u->prenom) . ' ' . ($data['nom'] ?? $u->nom));
        if ($display !== '') {
            $data['name'] = $display;
        }

        $u->update($data);

        return redirect()->route('profile.me')->with('success', 'Profil mis à jour avec succès.');
    }

    /**
     * Profil public d'un utilisateur
     * GET /profil/{user}
     */
    public function show(User $user)
    {
        $isOwner = Auth::check() && Auth::id() === $user->id;

        $base = Activities::query()->where('host_user_id', $user->id);
        $activities_count = (clone $base)->count();

        $activities = (clone $base)
            ->latest()
            ->take(12)
            ->get()
            ->map(fn ($a) => $this->mapActivity($a));

        return Inertia::render('Profil', [
            'isOwner'          => $isOwner,
            'activities'       => $activities,
            'activities_count' => $activities_count,
            'user' => [
                'id'        => $user->id,
                'prenom'    => $user->prenom,
                'nom'       => $user->nom,
                'bio'       => $user->bio,
                'location'  => $user->location,
                'role'      => $user->role,
                'verifie'   => $user->verification_status === 'verified',
                'photo'     => $user->avatar   ? Storage::url($user->avatar)   : null,
                'document'  => $user->document ? Storage::url($user->document) : null,
            ],
        ]);
    }
}
