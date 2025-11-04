<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Conversation extends Model
{
    protected $fillable = [
    'user_one_id',
    'user_two_id',
    'activity_id',
    'last_message_at',
    'last_read_at_user_one',
    'last_read_at_user_two',
    ];

    protected $casts = [
    'last_message_at'        => 'datetime',
    'last_read_at_user_one'  => 'datetime',
    'last_read_at_user_two'  => 'datetime',
    ];

    public function userOne(): BelongsTo { return $this->belongsTo(User::class,'user_one_id'); }
    public function userTwo(): BelongsTo { return $this->belongsTo(User::class,'user_two_id'); }
    public function activity(): BelongsTo { return $this->belongsTo(Activities::class,'activity_id'); }
    public function messages(): HasMany { return $this->hasMany(Message::class); }

    public function otherParticipant(int $me): ?User {
        return $this->user_one_id === $me ? $this->userTwo : $this->userOne;
    }

    public function isUnreadFor(int $userId): bool
    {
        if (!$this->last_message_at) return false;
        $isUserOne = $this->user_one_id === $userId;
        $lastRead  = $isUserOne ? $this->last_read_at_user_one : $this->last_read_at_user_two;
        return !$lastRead || $this->last_message_at->gt($lastRead);
    }

    public function markReadFor(int $userId, $at = null): void
    {
        $at = $at ?? now();
        if ($this->user_one_id === $userId)      $this->last_read_at_user_one = $at;
        elseif ($this->user_two_id === $userId)  $this->last_read_at_user_two = $at;
        $this->save();
    }

    public function markUnreadFor(int $userId): void
    {
        if     ($this->user_one_id === $userId) $this->last_read_at_user_one = null;
        elseif ($this->user_two_id === $userId) $this->last_read_at_user_two = null;
        $this->save();
    }
}
