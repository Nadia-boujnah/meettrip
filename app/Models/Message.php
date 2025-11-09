<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Message extends Model
{
    // Les champs que j’autorise à être remplis lors d’un create() ou update()
    protected $fillable = [
        'conversation_id', // identifiant de la conversation à laquelle le message appartient
        'sender_id',       // utilisateur qui a envoyé le message
        'body',            // contenu du message
        'read_at',         // moment où le message a été lu (null s’il ne l’est pas encore)
    ];

    // Je cast automatiquement la colonne read_at en objet datetime (Carbon)
    protected $casts = [
        'read_at' => 'datetime',
    ];

    // Chaque message appartient à une seule conversation
    public function conversation(): BelongsTo
    {
        return $this->belongsTo(Conversation::class);
    }

    // Chaque message appartient à un utilisateur (l’expéditeur)
    public function sender(): BelongsTo
    {
        return $this->belongsTo(User::class, 'sender_id');
    }
}
