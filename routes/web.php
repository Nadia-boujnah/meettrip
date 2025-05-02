<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;


Route::get('/', function () {
    return Inertia::render('home');
})->name('home');


Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');
});


Route::get('/activities', function () {
    return Inertia::render('activities');
})->name('activities');


Route::get('/activities/{id}', function ($id) {
    return Inertia::render('details-activities', ['id' => (int) $id]);
})->name('activity.details');

Route::get('/about', function () {
    return Inertia::render('about');
})->name('about');

Route::get('/contact', function () {
    return Inertia::render('contact');
})->name('contact');

Route::get('/cgu', function () {
    return Inertia::render('cgu');
})->name('cgu');

Route::get('/legal', function () {
    return Inertia::render('legal');
})->name('legal');

Route::get('/privacy', function () {
    return Inertia::render('privacy');
})->name('privacy');




require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
