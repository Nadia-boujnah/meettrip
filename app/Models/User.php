<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class User extends Authenticatable
{
    use HasFactory, Notifiable;

    // Je définis ici tous les champs que je peux remplir en masse (create / update)
    protected $fillable = [
        'name','email','password',
        'prenom','nom','bio','location','avatar','document','verification_status','role',
    ];

    // Je cache certains champs sensibles quand je convertis le modèle en JSON
    protected $hidden = ['password','remember_token'];

    // Je cast certains champs automatiquement en objets ou formats spécifiques
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime', // date de vérification du mail
            'password' => 'hashed',            // hachage automatique du mot de passe
        ];
    }

    /** Affichage pratique */
    // Cet accessor me permet d’afficher un nom complet proprement
    // → je combine prénom + nom, sinon je tombe sur "name" ou "Utilisateur"
    public function getDisplayNameAttribute(): string
    {
        $full = trim(($this->prenom ?? '') . ' ' . ($this->nom ?? ''));
        return $full !== '' ? $full : ($this->name ?? 'Utilisateur');
    }

    /** Activités que j’organise */
    // Relation 1:N → un utilisateur peut organiser plusieurs activités
    public function hostedActivities(): HasMany
    {
        return $this->hasMany(Activities::class, 'host_user_id');
    }

    /**
     * Activités que j’ai réservées (en tant que voyageur/guest).
     * Table pivot : activity_user(user_id = moi, activity_id = activité)
     */
    public function reservedActivities(): BelongsToMany
    {
        return $this->belongsToMany(Activities::class, 'activity_user', 'user_id', 'activity_id')
            ->withPivot(['status', 'host_id']) // je garde le statut de la réservation et l’id de l’organisateur
            ->withTimestamps(); // pour savoir quand la réservation a été faite
    }

    /**
     * Réservations reçues sur MES activités (en tant qu’organisateur/host).
     * Je relie l’utilisateur (host_id) aux activités via la table pivot.
     * La pivot contient aussi le "guest" (user_id) et le "status" de la demande.
     */
    public function receivedReservations(): BelongsToMany
    {
        return $this->belongsToMany(Activities::class, 'activity_user', 'host_id', 'activity_id')
            ->withPivot(['status', 'user_id']) // user_id ici = voyageur invité
            ->withTimestamps();
    }

    // Variante plus générique pour retrouver les activités auxquelles je participe
    public function joinedActivities(): BelongsToMany
    {
        return $this->belongsToMany(Activities::class, 'activity_user')
            ->withPivot(['status', 'host_id'])
            ->withTimestamps();
    }
}
