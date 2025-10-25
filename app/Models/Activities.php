<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage; // ✅ à ajouter pour Storage::url()

class Activities extends Model
{
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
        'dates',
        'why',
    ];

    protected $casts = [
        'latitude' => 'float',
        'longitude' => 'float',
        'dates' => 'array',
    ];

    // ✅ Ajout de l'accessor pour avoir une URL publique utilisable côté front
    protected $appends = ['image_url'];

    public function getImageUrlAttribute()
    {
        // Si une image est définie, retourne l'URL accessible via /storage/...
        return $this->image
            ? asset(Storage::url($this->image))
            : null;
    }

    // ✅ Relation organisateur
    public function hostUser()
    {
        return $this->belongsTo(User::class, 'host_user_id');
    }
}
