<?php

namespace App\Providers;

use Illuminate\Foundation\Support\Providers\AuthServiceProvider as ServiceProvider;
use Illuminate\Support\Facades\Gate;   
use App\Models\User;                  

class AuthServiceProvider extends ServiceProvider
{
    protected $policies = [
        // Model => Policy::class,
    ];

    public function boot(): void
    {
        // Droit "admin" basé sur la colonne users.role
        Gate::define('admin', function (User $user) {
            return $user->role === 'admin';   // adapte si ta colonne est différente
        });
    }
}
