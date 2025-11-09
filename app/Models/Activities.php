<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;

class Activities extends Model
{
    use HasFactory;

    // Je précise explicitement la table, même si le nom est déjà cohérent
    protected $table = 'activities';

    // Les champs que j’autorise au remplissage de masse (create/update)
    protected $fillable = [
        'image',
        'title',
        'location',
        'latitude',
        'longitude',
        'participants',
        'host_user_id',
        'description',
        'dates', // JSON
        'why',
    ];

    // Je caste automatiquement certains attributs quand je les lis/écris
    protected $casts = [
        'latitude'  => 'float',
        'longitude' => 'float',
        'dates'     => 'array', // en BDD c’est du JSON, je veux un array PHP côté modèle
    ];

    // Ces attributs calculés seront ajoutés automatiquement au toArray()/toJson()
    protected $appends = ['image_url', 'date'];

    /** URL publique de l’image */
    public function getImageUrlAttribute(): ?string
    {
        // Je récupère la valeur brute stockée en BDD
        $img = $this->image;

        // Si rien en BDD, je renvoie une image neutre
        if (!$img) {
            return asset('images/null.png');
        }

        // Si on m’a déjà stocké une URL complète (http/https) ou un chemin absolu, je renvoie tel quel
        if (str_starts_with($img, 'http://') || str_starts_with($img, 'https://') || str_starts_with($img, '/')) {
            return $img;
        }

        // Sinon je récupère juste le nom de fichier (par sécurité)
        $filename = basename($img);

        // Cas standard: le fichier est sur le disque "public" dans storage/app/public/activities
        // Je renvoie l’URL via le symlink /storage
        if (Storage::disk('public')->exists('activities/' . $filename)) {
            return asset('storage/activities/' . $filename);
        }

        // Cas de secours: le fichier serait directement dans public/activities
        if (file_exists(public_path('activities/' . $filename))) {
            return asset('activities/' . $filename);
        }

        // Si je ne trouve rien, je renvoie une image de fallback
        return asset('images/null.png');
    }

    /** Première date du tableau "dates" */
    public function getDateAttribute(): ?string
    {
        // Si le champ "date" simple est présent en BDD, je le priorise
        if (array_key_exists('date', $this->attributes) && $this->attributes['date']) {
            return $this->attributes['date'];
        }

        // Sinon je regarde dans "dates" (JSON -> array) et je renvoie la première si dispo
        $dates = $this->dates;
        return (is_array($dates) && count($dates) > 0) ? ($dates[0] ?? null) : null;
    }

    // Alias pratique si on veut explicitement "first_date" côté front
    public function getFirstDateAttribute(): ?string
    {
        return $this->getDateAttribute();
    }

    /** Organisateur */
    public function hostUser()
    {
        // Relation vers l’utilisateur organisateur (clé étrangère host_user_id)
        return $this->belongsTo(User::class, 'host_user_id');
    }

    /** Fichier image présent sur le disque public ? */
    public function hasImage(): bool
    {
        // Je vérifie la présence de l’image sur le disque "public/activities"
        if (!$this->image) return false;
        $filename = basename($this->image);
        return Storage::disk('public')->exists('activities/' . $filename);
    }

    /**
     * Invités (réservations).
     * Pivot: activity_user(activity_id, user_id, host_id, status, timestamps)
     */
    public function guests()
    {
        // Relation many-to-many avec les users via la table pivot activity_user.
        // Je garde dans la pivot le status et le host_id pour suivre la demande.
        return $this->belongsToMany(User::class, 'activity_user', 'activity_id', 'user_id')
            ->withPivot(['status', 'host_id'])
            ->withTimestamps();
    }
}
