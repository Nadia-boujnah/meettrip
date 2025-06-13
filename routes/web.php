<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Illuminate\Http\Request;

// ✅ IMPORT DES CONTRÔLEURS
use App\Http\Controllers\ActivitiesController;
use App\Http\Controllers\Admin\AdminActivitiesController;
use App\Http\Controllers\ActivitiesConnectedController;
use App\Models\Activities;

// 🌐 PAGES PUBLIQUES
Route::get('/', fn() => Inertia::render('PublicPages/Home'))->name('home');
Route::get('/about', fn() => Inertia::render('PublicPages/About'))->name('about');
Route::get('/contact', fn() => Inertia::render('PublicPages/Contact'))->name('contact');
Route::get('/cgu', fn() => Inertia::render('PublicPages/Cgu'))->name('cgu');
Route::get('/legal', fn() => Inertia::render('PublicPages/Legal'))->name('legal');
Route::get('/privacy', fn() => Inertia::render('PublicPages/Privacy'))->name('privacy');
Route::get('/activities', fn() => Inertia::render('PublicPages/Activities'))->name('activities');
Route::get('/activities/{id}', fn($id) => Inertia::render('PublicPages/Details-activities', ['id' => (int) $id]))->name('activity.details');

// 👤 UTILISATEUR CONNECTÉ
Route::middleware(['auth', 'verified', 'role:user'])->group(function () {
    Route::get('/dashboard/client', fn() => Inertia::render('Dashboard'))->name('user.dashboard');

    // ✅ ACTIVITÉS CONNECTÉES (vers contrôleur)
    Route::get('/activitesconnected', [ActivitiesConnectedController::class, 'index'])->name('activities.connected');
    Route::get('/activities/{id}/connected', [ActivitiesConnectedController::class, 'show'])->name('activity.details.connected');

    // ✅ ANNONCES (affichage)
    Route::get('/annonces', function () {
        $activities = Activities::latest()->get(); // ou ->with('hostUser') si besoin
        return Inertia::render('Annonces', [
            'activities' => $activities
        ]);
    })->name('annonces');

    // ✅ ANNONCES (enregistrement depuis formulaire)
    Route::post('/activities', [ActivitiesConnectedController::class, 'store'])->name('activities.store');

    // Autres pages utilisateur
    Route::get('/my-reservations', fn() => Inertia::render('MyReservations'))->name('my.reservations');
    Route::get('/messagerie', fn() => Inertia::render('Messagerie'))->name('messagerie');
    Route::get('/messages/{id}', fn($id) => Inertia::render('MessageDetail', ['id' => (int) $id]))->name('messages.show');
    Route::get('/carte', fn() => Inertia::render('MapConnected'))->name('map.connected');
    Route::get('/profil', fn() => Inertia::render('Profil'))->name('profil');
    Route::get('/profil/modifier', fn() => Inertia::render('EditProfil'))->name('edit.profil');
    Route::get('/organisateur/{id}', fn($id) => Inertia::render('ProfilOrganisateur', ['id' => (int) $id]))->name('organisateur.profil');
});

// 🔁 Redirection tableau de bord global
Route::redirect('/dashboard', '/admin/dashboard');

// 🛠️ ESPACE ADMINISTRATEUR
Route::middleware(['auth', 'verified', 'role:admin'])->group(function () {
    Route::get('/admin/dashboard', fn() => Inertia::render('admin/AdminDashboard'))->name('admin.dashboard');
    Route::get('/admin/admin-organizers', fn() => Inertia::render('admin/AdminOrganizers'))->name('admin.organizers');
    Route::get('/admin/identity-validation', fn() => Inertia::render('admin/IdentityValidation'))->name('admin.identity.validation');
    Route::get('/admin/statistics', fn() => Inertia::render('admin/Statistics'))->name('admin.statistics');
    Route::get('/admin/admin-activities', [AdminActivitiesController::class, 'index'])->name('admin.activities');
});

// 🧩 AUTRES ROUTES
require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
