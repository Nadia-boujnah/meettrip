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
        'dates', // JSON
        'why',
    ];

    protected $casts = [
        'latitude'  => 'float',
        'longitude' => 'float',
        'dates'     => 'array',
    ];

    // Exposés à Inertia
    protected $appends = ['image_url', 'date'];

    /** URL publique de l’image */
    public function getImageUrlAttribute(): ?string
    {
        $img = $this->image;
        if (!$img) {
            return asset('images/null.png');
        }

        if (str_starts_with($img, 'http://') || str_starts_with($img, 'https://') || str_starts_with($img, '/')) {
            return $img;
        }

        $filename = basename($img);

        if (Storage::disk('public')->exists('activities/' . $filename)) {
            return asset('storage/activities/' . $filename);
        }

        if (file_exists(public_path('activities/' . $filename))) {
            return asset('activities/' . $filename);
        }

        return asset('images/null.png');
    }

    /** Première date du tableau "dates" */
    public function getDateAttribute(): ?string
    {
        if (array_key_exists('date', $this->attributes) && $this->attributes['date']) {
            return $this->attributes['date'];
        }

        $dates = $this->dates;
        return (is_array($dates) && count($dates) > 0) ? ($dates[0] ?? null) : null;
    }

    public function getFirstDateAttribute(): ?string
    {
        return $this->getDateAttribute();
    }

    /** Organisateur */
    public function hostUser()
    {
        return $this->belongsTo(User::class, 'host_user_id');
    }

    /** Fichier image présent sur le disque public ? */
    public function hasImage(): bool
    {
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
        return $this->belongsToMany(User::class, 'activity_user', 'activity_id', 'user_id')
            ->withPivot(['status', 'host_id'])
            ->withTimestamps();
    }
}
