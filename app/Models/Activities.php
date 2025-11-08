<?php

namespace App\Models;

use App\Models\User;
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

    // Attributs calculés exposés au front (Inertia)
    protected $appends = ['image_url', 'date'];

    /**
     * URL publique de l’image
     * - En BDD on ne garde que le nom de fichier (ex: "rome.png")
     * - On sert depuis storage/app/public/activities -> /storage/activities/rome.png
     */
public function getImageUrlAttribute(): ?string
{
    $img = $this->image;
    if (!$img) {
        return asset('images/null.png'); // ou null si tu préfères
    }

    // URL absolue déjà prête ?
    if (str_starts_with($img, 'http://') || str_starts_with($img, 'https://') || str_starts_with($img, '/')) {
        return $img;
    }

    // On réduit toujours à un nom de fichier (évite les préfixes "activities/" etc.)
    $filename = basename($img);

    // 1) Préférence: storage (storage/app/public/activities)
    if (\Illuminate\Support\Facades\Storage::disk('public')->exists('activities/' . $filename)) {
        return asset('storage/activities/' . $filename);
    }

    // 2) Fallback: public/activities (anciennes images)
    if (file_exists(public_path('activities/' . $filename))) {
        return asset('activities/' . $filename);
    }

    // 3) Dernier recours: placeholder
    return asset('images/null.png');
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
     * Savoir si l’activité a un fichier image stocké
     */
    public function hasImage(): bool
    {
        if (!$this->image) return false;

        // On teste l’existence sur le disque "public"
        $filename = basename($this->image);
        return Storage::disk('public')->exists('activities/' . $filename);
    }

    /**
     * Participants (invités)
     */
    public function guests()
    {
        return $this->belongsToMany(User::class, 'activity_user', 'activity_id', 'user_id')
            ->withPivot(['status'])
            ->withTimestamps();
    }
}
