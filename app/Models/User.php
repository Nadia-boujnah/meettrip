<?php

namespace App\Models;

use App\Models\Activities; // <- ton modèle d’activités
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

    // Affichage pratique
    public function getDisplayNameAttribute(): string
    {
        $full = trim(($this->prenom ?? '').' '.($this->nom ?? ''));
        return $full !== '' ? $full : ($this->name ?? 'Utilisateur');
    }

    // ✅ Activités créées par cet utilisateur
    public function hostedActivities(): HasMany
    {
        return $this->hasMany(Activities::class, 'host_user_id');
    }

    // ✅ Activités auxquelles cet utilisateur participe
    public function joinedActivities(): BelongsToMany
    {
        return $this->belongsToMany(Activities::class, 'activity_user');
    }

    public function reservedActivities(): BelongsToMany
    {
        return $this->belongsToMany(Activities::class, 'activity_user', 'user_id', 'activity_id')
            ->withPivot(['status'])
            ->withTimestamps();
    }
}
