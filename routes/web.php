<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// Route vers la page d'accueil avec le composant React home.jsx
Route::get('/', function () {
    return Inertia::render('home');
})->name('home');

// Routes protégées par authentification
Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');
});
Route::get('/activities', function () {
    return Inertia::render('Activities');
})->name('activities');


// Autres fichiers de routes
require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
