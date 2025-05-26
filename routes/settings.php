<?php

use App\Http\Controllers\Settings\PasswordController;
use App\Http\Controllers\Settings\ProfileController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::middleware('auth')->group(function () {
    Route::redirect('parametres', 'parametres/profile');

    Route::get('parametres/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('parametres/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('parametres/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    Route::get('parametres/password', [PasswordController::class, 'edit'])->name('password.edit');
    Route::put('parametres/password', [PasswordController::class, 'update'])->name('password.update');

    Route::get('parametres/appearance', function () {
        return Inertia::render('parametres/appearance');
    })->name('appearance');
});
