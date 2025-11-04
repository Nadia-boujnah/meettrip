<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Illuminate\Http\Request;

// CONTROLLERS
use App\Http\Controllers\Admin\AdminActivitiesController;
use App\Http\Controllers\ActivitiesConnectedController;
use App\Models\Activities;
use App\Http\Controllers\ContactController;
use App\Http\Controllers\ConversationsController;
use App\Http\Controllers\MessagesController;

/*
| PAGES PUBLIQUES
*/
Route::get('/', function () {
    $latest = Activities::query()
        ->latest()
        ->take(4)
        ->get()
        ->map(fn($a) => [
            'id'           => $a->id,
            'title'        => $a->title,
            'location'     => $a->location,
            'participants' => $a->participants,
            'description'  => $a->description,
            'why'          => $a->why,
            'dates'        => $a->dates ?? [],
            'date'         => $a->date,
            'image'        => $a->image,
            'image_url'    => $a->image_url,
            'latitude'     => $a->latitude,
            'longitude'    => $a->longitude,
        ]);

    $forMap = Activities::query()
        ->whereNotNull('latitude')
        ->whereNotNull('longitude')
        ->latest()
        ->take(200)
        ->get()
        ->map(fn($a) => [
            'id'        => $a->id,
            'title'     => $a->title,
            'location'  => $a->location,
            'lat'       => (float)$a->latitude,
            'lng'       => (float)$a->longitude,
            'image'     => $a->image,
            'image_url' => $a->image_url,
        ]);

    return Inertia::render('PublicPages/home', [
        'latestActivities' => $latest,
        'mapActivities'    => $forMap,
    ]);
})->name('home');

Route::get('/about', fn () => Inertia::render('PublicPages/about'))->name('about');
Route::get('/contact', fn () => Inertia::render('PublicPages/contact'))->name('contact');
Route::get('/cgu', fn () => Inertia::render('PublicPages/cgu'))->name('cgu');
Route::get('/legal', fn () => Inertia::render('PublicPages/legal'))->name('legal');
Route::get('/privacy', fn () => Inertia::render('PublicPages/privacy'))->name('privacy');
Route::post('/contact', [ContactController::class, 'send'])->name('contact.send');

/*
| ACTIVITÉS (BDD)
*/
Route::get('/activities', function () {
    $activities = Activities::query()
        ->latest()
        ->paginate(9)
        ->through(function ($a) {
            return [
                'id'           => $a->id,
                'title'        => $a->title,
                'location'     => $a->location,
                'participants' => $a->participants,
                'description'  => $a->description,
                'why'          => $a->why,
                'dates'        => $a->dates ?? [],
                'date'         => $a->date,
                'image'        => $a->image,
                'image_url'    => $a->image_url,
                'latitude'     => $a->latitude,
                'longitude'    => $a->longitude,
                'host_user'    => $a->hostUser?->only(['id','name']),
            ];
        });

    return Inertia::render('PublicPages/activities', [
        'activities' => $activities,
    ]);
})->name('activities');

Route::get('/activities/{id}', function (int $id) {
    $a = Activities::with('hostUser')->findOrFail($id);

    return Inertia::render('PublicPages/details-activities', [
        'activity' => [
            'id'           => $a->id,
            'title'        => $a->title,
            'location'     => $a->location,
            'participants' => $a->participants,
            'description'  => $a->description,
            'why'          => $a->why,
            'dates'        => $a->dates ?? [],
            'date'         => $a->date,
            'image'        => $a->image,
            'image_url'    => $a->image_url,
            'latitude'     => $a->latitude,
            'longitude'    => $a->longitude,
            'host_user'    => $a->hostUser?->only(['id','name']),
        ],
    ]);
})->whereNumber('id')->name('activity.details');

Route::get('/seo-example', fn () => Inertia::render('PublicPages/SeoExample'));

/*
| DASHBOARD UTILISATEUR (route nommée 'dashboard')
*/
Route::middleware(['auth', 'verified', 'role:user'])
    ->get('/dashboard', fn () => Inertia::render('Dashboard'))
    ->name('dashboard');

/*
| UTILISATEUR CONNECTÉ
*/
Route::middleware(['auth', 'verified', 'role:user'])->group(function () {
    Route::get('/my-reservations', fn () => Inertia::render('MyReservations'))
    ->name('my.reservations');

Route::get('/annonces', fn () => Inertia::render('Annonces'))
    ->name('annonces');

    Route::get('/dashboard/client', fn () => Inertia::render('Dashboard'))
        ->name('dashboard.client');

    // Activities Connected 
    Route::get('/activitesconnected', [ActivitiesConnectedController::class, 'index'])
        ->name('activities.connected');
    Route::get('/activitiesconnected', [ActivitiesConnectedController::class, 'index']); // alias

    Route::get('/activities/{id}/connected', [ActivitiesConnectedController::class, 'show'])
        ->whereNumber('id')
        ->name('activity.details.connected');

    // ✅ Messagerie (contrôleur)
    Route::get('/messagerie', [ConversationsController::class, 'index'])->name('messagerie');

    Route::get('/messages/{conversation}', [ConversationsController::class, 'show'])
        ->whereNumber('conversation')
        ->name('messages.show');

    Route::post('/messages', [MessagesController::class, 'store'])->name('messages.store');
    Route::post('/messages/{conversation}/reply', [MessagesController::class, 'reply'])
        ->whereNumber('conversation')
        ->name('messages.reply');


    // ⬇️ Ancienne vue directe renommée (démo)
    Route::get('/messagerie-demo', fn () => Inertia::render('Messagerie'))->name('messagerie.demo');

    // ⚠️ IMPORTANT : deux paramètres AVANT un paramètre (évite les collisions)
    Route::get('/messagerie/{user}/{activity}', function (int $user, int $activity) {
        $a = \App\Models\Activities::with('hostUser:id,name,prenom,nom')->findOrFail($activity);

        return Inertia::render('Messagerie', [
            'contactId' => $user,
            'activityContext' => [
                'id'       => $a->id,
                'title'    => $a->title,
                'location' => $a->location,
                'image'    => $a->image,
                'host'     => [
                    'id'     => $a->hostUser?->id,
                    'name'   => $a->hostUser?->name,
                    'prenom' => $a->hostUser?->prenom,
                    'nom'    => $a->hostUser?->nom,
                ],
            ],
        ]);
    })->whereNumber('user')->whereNumber('activity')->name('messagerie.user.activity');

    Route::get('/messagerie/{user}', fn (int $user) => Inertia::render('Messagerie', [
        'contactId' => $user,
    ]))->whereNumber('user')->name('messagerie.user');

// Supprimer une conversation
Route::delete('/messages/{conversation}', [ConversationsController::class, 'destroy'])
    ->whereNumber('conversation')->name('messages.destroy');


    Route::get('/carte', fn () => Inertia::render('MapConnected'))->name('map.connected');
    Route::get('/profil', fn () => Inertia::render('Profil'))->name('profil');
    Route::get('/profil/modifier', fn () => Inertia::render('EditProfil'))->name('edit.profil');
    Route::get('/organisateur/{id}', fn (int $id) => Inertia::render('ProfilOrganisateur', ['id' => $id]))
        ->whereNumber('id')
        ->name('organisateur.profil');
    
});

/*
| ADMIN
*/
Route::middleware(['auth', 'verified', 'role:admin'])->group(function () {
    Route::get('/admin/dashboard', fn () => Inertia::render('admin/AdminDashboard'))->name('admin.dashboard');
    Route::get('/admin/admin-organizers', fn () => Inertia::render('admin/AdminOrganizers'))->name('admin.organizers');
    Route::get('/admin/identity-validation', fn () => Inertia::render('admin/IdentityValidation'))->name('admin.identity.validation');
    Route::get('/admin/statistics', fn () => Inertia::render('admin/Statistics'))->name('admin.statistics');
    Route::get('/admin/admin-activities', [AdminActivitiesController::class, 'index'])->name('admin.activities');
});

// Autres fichiers de routes
require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
