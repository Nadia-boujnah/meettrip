<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Inertia\Response;

class AuthenticatedSessionController extends Controller
{
    /**
     * Affiche la page de connexion.
     */
    public function create(Request $request): Response
    {
        return Inertia::render('auth/login', [
            'canResetPassword' => Route::has('password.request'),
            'status' => $request->session()->get('status'),
        ]);
    }

    /**
     * Traite la soumission du formulaire de connexion.
     */
    public function store(LoginRequest $request): RedirectResponse
    {
        // Valide + tente l'auth (via LoginRequest)
        $request->authenticate();

        // Régénère la session
        $request->session()->regenerate();

        $user = Auth::user();

        // Redirection par rôle
        if ($user && $user->role === 'admin') {
            // admin -> dashboard admin
            return redirect()->intended(
                Route::has('admin.dashboard') ? route('admin.dashboard') : '/admin/dashboard'
            );
        }

        // user classique -> Dashboard (nom de route variable selon ton projet)
        if (Route::has('Dashboard')) {
            return redirect()->intended(route('Dashboard'));
        }
        if (Route::has('dashboard')) {
            return redirect()->intended(route('dashboard'));
        }

        // Fallback si aucune route nommée n'existe
        return redirect()->intended('/dashboard');
    }

    /**
     * Déconnecte l'utilisateur.
     */
    public function destroy(Request $request): RedirectResponse
    {
        Auth::guard('web')->logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect('/');
    }
}
