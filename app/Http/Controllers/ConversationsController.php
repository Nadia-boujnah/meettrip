<?php

namespace App\Http\Controllers;

use Illuminate\Support\Carbon;
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

                return [
                    'id'       => $c->id,
                    'other'    => $other?->only(['id','name','prenom','nom']),
                    'activity' => $c->activity ? [
                        'id'       => $c->activity->id,
                        'title'    => $c->activity->title,
                        'location' => $c->activity->location,
                        'image'    => $c->activity->image,
                        'host'     => $c->activity->hostUser?->only(['id','name','prenom','nom']),
                    ] : null,
                    'last_message_at' => $c->last_message_at
                        ? Carbon::parse($c->last_message_at)->toDateTimeString()
                        : null,
                ];
            });

        return Inertia::render('Messagerie', ['threads' => $threads]);
    }

    public function show(Conversation $conversation)
    {
        $this->authorizeView($conversation);

        $conversation->load([
            'messages.sender:id,name,prenom,nom',
            'activity:id,title,location,image,host_user_id',
            'activity.hostUser:id,name,prenom,nom',
            'userOne:id,name,prenom,nom',
            'userTwo:id,name,prenom,nom',
        ]);

        return Inertia::render('MessageDetail', [
            'conversation' => [
                'id' => $conversation->id,
                'other' => $conversation->user_one_id === Auth::id()
                    ? $conversation->userTwo?->only(['id','name','prenom','nom'])
                    : $conversation->userOne?->only(['id','name','prenom','nom']),
                'activity' => $conversation->activity ? [
                    'id'      => $conversation->activity->id,
                    'title'   => $conversation->activity->title,
                    'location'=> $conversation->activity->location,
                    'image'   => $conversation->activity->image,
                    'host'    => $conversation->activity->hostUser?->only(['id','name','prenom','nom']),
                ] : null,
            ],
            'messages' => $conversation->messages()
                ->orderBy('created_at')
                ->get()
                ->map(fn($m) => [
                    'id'        => $m->id,
                    'from_id'   => $m->sender_id,
                    'from_name' => $m->sender?->name ?? ($m->sender?->prenom.' '.$m->sender?->nom),
                    'body'      => $m->body,
                    'date'      => $m->created_at->toDateTimeString(),
                ]),
        ]);
    }

    // 🗑️ Supprimer une conversation
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
