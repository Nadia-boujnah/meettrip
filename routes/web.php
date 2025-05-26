<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// 🌐 PAGES PUBLIQUES
Route::get('/', fn() => Inertia::render('PublicPages/home'))->name('home');
Route::get('/about', fn() => Inertia::render('PublicPages/about'))->name('about');
Route::get('/contact', fn() => Inertia::render('PublicPages/contact'))->name('contact');
Route::get('/cgu', fn() => Inertia::render('PublicPages/cgu'))->name('cgu');
Route::get('/legal', fn() => Inertia::render('PublicPages/legal'))->name('legal');
Route::get('/privacy', fn() => Inertia::render('PublicPages/privacy'))->name('privacy');
Route::get('/activities', fn() => Inertia::render('PublicPages/Activities'))->name('activities');
Route::get('/activities/{id}', fn($id) => Inertia::render('PublicPages/details-activities', ['id' => (int) $id]))->name('activity.details');

// 👤 PAGES UTILISATEUR CONNECTÉ
Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/dashboard', fn() => Inertia::render('dashboard'))->name('dashboard');
    Route::get('/activitesconnected', fn() => Inertia::render('Activitiesconnected'))->name('activities.connected');
    Route::get('/activities/{id}/connected', fn($id) => Inertia::render('DetailsActivityConnected', ['id' => (int) $id]))->name('activity.details.connected');
    Route::get('/my-reservations', fn() => Inertia::render('MyReservations'))->name('my.reservations');
    Route::get('/messagerie', fn() => Inertia::render('Messagerie'))->name('messagerie');
    Route::get('/messages/{id}', fn($id) => Inertia::render('MessageDetail', ['id' => (int) $id]))->name('messages.show');
    Route::get('/annonces', fn() => Inertia::render('Annonces'))->name('annonces');
    Route::get('/carte', fn() => Inertia::render('MapConnected'))->name('map.connected');
});

// 👥 AUTRES PAGES
Route::get('/profil', fn() => Inertia::render('editProfil'))->name('edit.profil');
Route::get('/profil/modifier', fn() => Inertia::render('editProfil'))->name('edit.profil');
Route::middleware(['auth'])->get('/organisateur/{id}', fn($id) => Inertia::render('ProfilOrganisateur', ['id' => (int) $id]))->name('organisateur.profil');

// 🛠️ PAGES ADMINISTRATEUR
Route::middleware(['auth', 'verified'])->prefix('admin')->group(function () {
    Route::get('/dashboard', fn() => Inertia::render('admin/AdminDashboard'))->name('admin.dashboard');
    Route::get('/admin-organizers', fn() => Inertia::render('admin/AdminOrganizers'))->name('admin.organizers');
    Route::get('/identity-validation', fn() => Inertia::render('admin/IdentityValidation'))->name('admin.identity.validation');
    Route::get('/statistics', fn() => Inertia::render('admin/Statistics'))->name('admin.statistics');
    Route::get('/admin-activities', fn() => Inertia::render('admin/AdminActivities'))->name('admin.activities');
});


// 🔧 CONFIGURATION
require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
