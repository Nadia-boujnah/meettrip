<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;

class Activities extends Model
{
    use HasFactory;

    protected $table = 'activities';

    protected $fillable = [
        'image',
        'title',
        'location',
        'latitude',
        'longitude',
        'participants',
        'host_user_id',
        'description',
        'dates', // stocké en JSON
        'why',
    ];

    protected $casts = [
        'latitude'  => 'float',
        'longitude' => 'float',
        'dates'     => 'array', // Laravel convertit automatiquement JSON ↔ array
    ];

    // On ajoute des attributs calculés pour le front (Inertia)
    protected $appends = ['image_url', 'date'];

    /**
     * Retourne l’URL publique de l’image (pour le front)
     * Exemple : /storage/activities/rome.png
     */
    public function getImageUrlAttribute(): ?string
    {
        if (!$this->image) {
            return null;
        }

        // Assure que le lien soit accessible via /storage/... (symlink créé)
        return asset(Storage::url($this->image));
    }

    /**
     * Retourne la première date du tableau "dates"
     */
    public function getDateAttribute(): ?string
    {
        // Si une vraie colonne "date" existe un jour
        if (array_key_exists('date', $this->attributes) && $this->attributes['date']) {
            return $this->attributes['date'];
        }

        // Sinon, on prend la première valeur du tableau JSON "dates"
        $dates = $this->dates;
        return (is_array($dates) && count($dates) > 0)
            ? ($dates[0] ?? null)
            : null;
    }

    /**
     * Alias facultatif : première date, utile pour les tris ou filtres
     */
    public function getFirstDateAttribute(): ?string
    {
        return $this->getDateAttribute();
    }

    /**
     * Relation vers l'utilisateur organisateur
     */
    public function hostUser()
    {
        return $this->belongsTo(User::class, 'host_user_id');
    }

    /**
     * Petit helper : savoir si l’activité a une image stockée
     */
    public function hasImage(): bool
    {
        return !empty($this->image) && Storage::exists($this->image);
    }
}
