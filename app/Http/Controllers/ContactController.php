<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;

class ContactController extends Controller
{
    public function send(Request $request)
    {
        $data = $request->validate([
            'name'    => ['required', 'string', 'max:255'],
            'email'   => ['required', 'email', 'max:255'],
            'message' => ['required', 'string', 'max:5000'],
        ]);

        // ✅ Adresse perso qui recevra les messages du formulaire
        $to = 'nadia.boujnah@laplateorme.io';  

        // Envoi d’un mail “simple” (texte brut)
        Mail::raw(
            "Nouveau message de contact depuis MeetTrip 👋\n\n".
            "Nom : {$data['name']}\n".
            "Email : {$data['email']}\n\n".
            "Message :\n{$data['message']}",
            function ($message) use ($to) {
                $message->to($to)
                        ->subject('📩 Nouveau message via le formulaire de contact MeetTrip');
            }
        );

        // Réponse JSON (ou redirection si tu veux afficher un message côté front)
        return response()->json(['ok' => true]);
    }
}
