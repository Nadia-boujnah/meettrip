<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Activities extends Model
{
    // Table associée (optionnel si le nom correspond à la convention)
    protected $table = 'activities';

    // Champs qui peuvent être remplis en masse
    protected $fillable = [
        'image',
        'title',
        'location',
        'latitude',
        'longitude',
        'participants',
        'host_user_id',
        'dates',
    ];

    // Casts pour certains types (dates → json, latitude/longitude → float)
    protected $casts = [
        'latitude' => 'float',
        'longitude' => 'float',
        'dates' => 'array',
    ];

    // Relation avec le modèle User (organisateur)
    public function hostUser()
    {
        return $this->belongsTo(User::class, 'host_user_id');
    }
}
