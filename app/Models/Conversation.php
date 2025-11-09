<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Conversation extends Model
{
    // Les colonnes que j’autorise au remplissage de masse (create/update)
    protected $fillable = [
        'user_one_id',           // participant A
        'user_two_id',           // participant B
        'activity_id',           // optionnel : conversation rattachée à une activité
        'last_message_at',       // horodatage du dernier message reçu/envoyé
        'last_read_at_user_one', // dernière fois que user_one a lu la conv
        'last_read_at_user_two', // dernière fois que user_two a lu la conv
    ];

    // Je caste ces champs en objets Carbon automatiquement
    protected $casts = [
        'last_message_at'        => 'datetime',
        'last_read_at_user_one'  => 'datetime',
        'last_read_at_user_two'  => 'datetime',
    ];

    // Relations : je relie chaque côté de la conversation à un User
    public function userOne(): BelongsTo { return $this->belongsTo(User::class, 'user_one_id'); }
    public function userTwo(): BelongsTo { return $this->belongsTo(User::class, 'user_two_id'); }

    // La conversation peut être liée à une activité précise (messagerie contextuelle)
    public function activity(): BelongsTo { return $this->belongsTo(Activities::class, 'activity_id'); }

    // Une conversation possède plusieurs messages
    public function messages(): HasMany { return $this->hasMany(Message::class); }

    // Récupère "l'autre" participant par rapport à l'id de l'utilisateur courant
    public function otherParticipant(int $me): ?User
    {
        return $this->user_one_id === $me ? $this->userTwo : $this->userOne;
    }

    // Indique si la conversation est non lue pour un utilisateur donné :
    // - si pas de dernier message => rien à lire
    // - sinon je compare la date du dernier message avec la dernière lecture de l'utilisateur
    public function isUnreadFor(int $userId): bool
    {
        if (!$this->last_message_at) return false;
        $isUserOne = $this->user_one_id === $userId;
        $lastRead  = $isUserOne ? $this->last_read_at_user_one : $this->last_read_at_user_two;
        return !$lastRead || $this->last_message_at->gt($lastRead);
    }

    // Marque la conversation comme lue pour un utilisateur (par défaut "maintenant")
    // Je mets à jour le champ de lecture correspondant et je sauvegarde
    public function markReadFor(int $userId, $at = null): void
    {
        $at = $at ?? now();
        if ($this->user_one_id === $userId) {
            $this->last_read_at_user_one = $at;
        } elseif ($this->user_two_id === $userId) {
            $this->last_read_at_user_two = $at;
        }
        $this->save();
    }

    // Force l'état "non lu" pour un utilisateur (je remets son horodatage de lecture à null)
    public function markUnreadFor(int $userId): void
    {
        if     ($this->user_one_id === $userId) $this->last_read_at_user_one = null;
        elseif ($this->user_two_id === $userId) $this->last_read_at_user_two = null;
        $this->save();
    }
}
