<?php

namespace App\Http\Controllers;

use App\Models\Conversation;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class ConversationsController extends Controller
{
    public function index()
    {
        $me = Auth::id();

        $threads = Conversation::query()
            ->with([
                'userOne:id,name,prenom,nom',
                'userTwo:id,name,prenom,nom',
                'activity:id,title,location,image,host_user_id',
                'activity.hostUser:id,name,prenom,nom',
            ])
            ->where(fn($q) => $q->where('user_one_id', $me)->orWhere('user_two_id', $me))
            ->orderByDesc('last_message_at')
            ->get()
            ->map(function ($c) use ($me) {
                $other = $c->user_one_id === $me ? $c->userTwo : $c->userOne;

                // Compter les messages non lus pour MOI
                $unread = $c->messages()
                    ->whereNull('read_at')
                    ->where('sender_id', '!=', $me)
                    ->when($c->user_one_id === $me && $c->last_read_at_user_one, function ($q) use ($c) {
                        $q->where('created_at', '>', $c->last_read_at_user_one);
                    })
                    ->when($c->user_two_id === $me && $c->last_read_at_user_two, function ($q) use ($c) {
                        $q->where('created_at', '>', $c->last_read_at_user_two);
                    })
                    ->count();

                // URL publique de l'image activité
                $image = $c->activity?->image;
                $image_url = $image
                    ? (str_starts_with($image, 'http') ? $image : asset('storage/' . ltrim($image, '/')))
                    : null;

                return [
                    'id'       => $c->id,
                    'other'    => $other?->only(['id','name','prenom','nom']),
                    'activity' => $c->activity ? [
                        'id'        => $c->activity->id,
                        'title'     => $c->activity->title,
                        'location'  => $c->activity->location,
                        'image'     => $c->activity->image,    // brut
                        'image_url' => $image_url,             // à utiliser côté React
                        'host'      => $c->activity->hostUser?->only(['id','name','prenom','nom']),
                    ] : null,
                    'last_message_at' => $c->last_message_at?->toDateTimeString(),
                    'unread_count'    => $unread,
                ];
            });

        return Inertia::render('Messagerie', ['threads' => $threads]);
    }

    public function show(Conversation $conversation)
    {
        $this->authorizeView($conversation);
        $me = Auth::id();

        // Marquer comme lu pour moi
        $conversation->markReadFor($me);

        // Marquer tous les messages reçus non lus comme lus
        $conversation->messages()
            ->whereNull('read_at')
            ->where('sender_id', '!=', $me)
            ->update(['read_at' => now()]);

        $conversation->load([
            'messages.sender:id,name,prenom,nom',
            'activity:id,title,location,image,host_user_id',
            'activity.hostUser:id,name,prenom,nom',
            'userOne:id,name,prenom,nom',
            'userTwo:id,name,prenom,nom',
        ]);

        $image = $conversation->activity?->image;
        $image_url = $image
            ? (str_starts_with($image, 'http') ? $image : asset('storage/' . ltrim($image, '/')))
            : null;

        return Inertia::render('MessageDetail', [
            'conversation' => [
                'id' => $conversation->id,
                'other' => $conversation->user_one_id === $me
                    ? $conversation->userTwo?->only(['id','name','prenom','nom'])
                    : $conversation->userOne?->only(['id','name','prenom','nom']),
                'activity' => $conversation->activity ? [
                    'id'        => $conversation->activity->id,
                    'title'     => $conversation->activity->title,
                    'location'  => $conversation->activity->location,
                    'image'     => $conversation->activity->image,
                    'image_url' => $image_url,
                    'host'      => $conversation->activity->hostUser?->only(['id','name','prenom','nom']),
                ] : null,
            ],
            'messages' => $conversation->messages()
                ->orderBy('created_at')
                ->get()
                ->map(fn($m) => [
                    'id'        => $m->id,
                    'from_id'   => $m->sender_id,
                    'from_name' => $m->sender?->name ?? trim(($m->sender?->prenom.' '.$m->sender?->nom) ?? ''),
                    'body'      => $m->body,
                    'date'      => $m->created_at->toDateTimeString(),
                ]),
        ]);
    }

    // Supprimer une conversation
    public function destroy(Conversation $conversation)
    {
        $this->authorizeView($conversation);

        $conversation->messages()->delete();
        $conversation->delete();

        return redirect()->route('messagerie')->with('success', 'Conversation supprimée.');
    }

    private function authorizeView(Conversation $c): void
    {
        abort_unless(in_array(Auth::id(), [$c->user_one_id, $c->user_two_id]), 403);
    }
}
