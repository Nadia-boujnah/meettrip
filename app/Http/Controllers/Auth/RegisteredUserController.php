<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;
use Inertia\Inertia;
use Inertia\Response;

class RegisteredUserController extends Controller
{
    /**
     * Affiche la page d'inscription (formulaire)
     */
    public function create(): Response
    {
        // correspond à resources/js/pages/auth/register.jsx
        return Inertia::render('auth/register');
    }

    /**
     * Gère la soumission du formulaire d'inscription
     */
    public function store(Request $request)
    {
        $request->validate([
            'name'       => ['required', 'string', 'max:255'],
            'email'      => ['required', 'string', 'lowercase', 'email', 'max:255', 'unique:' . User::class],
            'password'   => ['required', 'confirmed', Rules\Password::defaults()],
            'accept_cgu' => ['accepted'],
        ]);

        $user = User::create([
            'name'     => $request->name,
            'email'    => $request->email,
            'password' => Hash::make($request->password),
            'role'     => $request->input('role', 'user'), // par défaut "user"
        ]);

        event(new Registered($user));
        Auth::login($user);

        // ✅ Redirection selon le rôle
        return $user->role === 'admin'
            ? to_route('admin.dashboard')
            : to_route('Dashboard');
    }
}
