<?php

namespace App\Http\Middleware;

use App\Models\Conversation;
use App\Models\Message;
use Illuminate\Foundation\Inspiring;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Middleware;
use Tighten\Ziggy\Ziggy;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that's loaded on the first page visit.
     */
    protected $rootView = 'app';

    /**
     * Determines the current asset version.
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        [$message, $author] = str(Inspiring::quotes()->random())->explode('-');

        $user = $request->user();

        // Compteur "pending" pour l'organisateur (comme avant)
        $hostPending = 0;
        if ($user) {
            $hostPending = DB::table('activity_user')
                ->where('host_id', $user->id)
                ->where('status', 'pending')
                ->count();
        }

        return [
            ...parent::share($request),

            'name'  => config('app.name'),
            'quote' => ['message' => trim($message), 'author' => trim($author)],

            'auth' => [
                'user' => $user,
            ],

            'host' => [
                'pending_reservations' => $hostPending,
            ],

            // ✅ Messagerie: compteurs partagés à toutes les pages
            'messaging' => function () use ($user) {
                if (!$user) {
                    return [
                        'unread_total'   => 0,
                        'unread_threads' => 0,
                    ];
                }

                // Total de messages non lus (envoyés par l'autre, non ouverts)
                $unreadTotal = Message::query()
                    ->whereNull('read_at')
                    ->where('sender_id', '!=', $user->id)
                    ->whereHas('conversation', function ($q) use ($user) {
                        $q->where('user_one_id', $user->id)
                          ->orWhere('user_two_id', $user->id);
                    })
                    ->count();

                // Nombre de conversations contenant au moins un non-lu (optionnel)
                $unreadThreads = Conversation::query()
                    ->where(function ($q) use ($user) {
                        $q->where('user_one_id', $user->id)
                          ->orWhere('user_two_id', $user->id);
                    })
                    ->where(function ($q) use ($user) {
                        $q->where(function ($q) use ($user) {
                            $q->where('user_one_id', $user->id)
                              ->whereColumn('last_message_at', '>', 'last_read_at_user_one');
                        })->orWhere(function ($q) use ($user) {
                            $q->where('user_two_id', $user->id)
                              ->whereColumn('last_message_at', '>', 'last_read_at_user_two');
                        });
                    })
                    ->count();

                return [
                    'unread_total'   => $unreadTotal,
                    'unread_threads' => $unreadThreads,
                ];
            },

            // Flash messages
            'flash' => [
                'success' => fn () => $request->session()->get('success'),
                'error'   => fn () => $request->session()->get('error'),
                'info'    => fn () => $request->session()->get('info'),
            ],

            // Ziggy
            'ziggy' => fn (): array => [
                ...(new Ziggy)->toArray(),
                'location' => $request->url(),
            ],
        ];
    }
}
