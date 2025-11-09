<?php

namespace App\Http\Controllers;

use App\Models\Conversation;
use App\Models\Message;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class MessagesController extends Controller
{
    // Créer une conversation + premier message
    public function store(Request $request)
    {
        $data = $request->validate([
            'contact_id'  => 'required|integer|exists:users,id',
            'activity_id' => 'nullable|integer|exists:activities,id',
            'body'        => 'required|string|min:1',
        ]);

        $me = Auth::id();
        abort_if($data['contact_id'] === $me, 422, "Impossible de s'envoyer un message à soi-même.");

        // Ordonner les IDs pour éviter les doublons
        $one = min($me, $data['contact_id']);
        $two = max($me, $data['contact_id']);

        $conversation = Conversation::firstOrCreate(
            ['user_one_id' => $one, 'user_two_id' => $two, 'activity_id' => $data['activity_id'] ?? null],
            ['last_message_at' => now()]
        );

        Message::create([
            'conversation_id' => $conversation->id,
            'sender_id'       => $me,
            'body'            => $data['body'],
        ]);

        $conversation->update(['last_message_at' => now()]);

        return redirect()->route('messages.show', $conversation->id)
            ->with('success', 'Message envoyé avec succès');
    }

    // Répondre dans une conversation existante
    public function reply(Request $request, Conversation $conversation)
    {
        abort_unless(in_array(Auth::id(), [$conversation->user_one_id, $conversation->user_two_id]), 403);

        $data = $request->validate([
            'body' => 'required|string|min:1',
        ]);

        Message::create([
            'conversation_id' => $conversation->id,
            'sender_id'       => Auth::id(),
            'body'            => $data['body'],
        ]);

        $conversation->update(['last_message_at' => now()]);

        return back()->with('success', 'Message envoyé.');
    }
}
