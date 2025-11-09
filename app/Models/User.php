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

    protected $fillable = [
        'name','email','password',
        'prenom','nom','bio','location','avatar','document','verification_status','role',
    ];

    protected $hidden = ['password','remember_token'];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    /** Affichage pratique */
    public function getDisplayNameAttribute(): string
    {
        $full = trim(($this->prenom ?? '') . ' ' . ($this->nom ?? ''));
        return $full !== '' ? $full : ($this->name ?? 'Utilisateur');
    }

    /** Activités que j’organise */
    public function hostedActivities(): HasMany
    {
        return $this->hasMany(Activities::class, 'host_user_id');
    }

    /**
     * Activités que j’ai réservées (en tant que voyageur/guest).
     * Pivot = activity_user(user_id -> moi, activity_id -> activity)
     */
    public function reservedActivities(): BelongsToMany
    {
        return $this->belongsToMany(Activities::class, 'activity_user', 'user_id', 'activity_id')
            ->withPivot(['status', 'host_id'])
            ->withTimestamps();
    }

    /**
     * Réservations reçues sur MES activités (en tant qu’organisateur/host).
     * On relie l’utilisateur (host_id) aux activités via la pivot.
     * La pivot contient aussi le "guest" (user_id) et le "status".
     */
    public function receivedReservations(): BelongsToMany
    {
        return $this->belongsToMany(Activities::class, 'activity_user', 'host_id', 'activity_id')
            ->withPivot(['status', 'user_id']) // user_id = guest
            ->withTimestamps();
    }


    public function joinedActivities(): BelongsToMany
    {
        return $this->belongsToMany(Activities::class, 'activity_user')
            ->withPivot(['status', 'host_id'])
            ->withTimestamps();
    }
}
