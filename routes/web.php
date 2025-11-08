<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Illuminate\Http\Request;

// PUBLIC CONTROLLERS
use App\Http\Controllers\ContactController;
use App\Http\Controllers\CitiesController;

// FEATURE CONTROLLERS
use App\Http\Controllers\AnnoncesController;
use App\Http\Controllers\ActivitiesConnectedController;
use App\Http\Controllers\ReservationsController;
use App\Http\Controllers\ConversationsController;
use App\Http\Controllers\MessagesController;
use App\Http\Controllers\Admin\AdminActivitiesController;
use App\Http\Controllers\DashboardClientController;

// AUTH CONTROLLERS (important: pour /login /register)
use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\Auth\RegisteredUserController;

// MODELS
use App\Models\Activities;

/*
|--------------------------------------------------------------------------
| AUTH (toujours côté invités)
|--------------------------------------------------------------------------
| Ces routes ne doivent JAMAIS être protégées par 'auth' ou autre rôle.
*/
Route::middleware('guest')->group(function () {
    Route::get('/login',    [AuthenticatedSessionController::class, 'create'])->name('login');
    Route::post('/login',   [AuthenticatedSessionController::class, 'store']);
    Route::get('/register', [RegisteredUserController::class, 'create'])->name('register');
    Route::post('/register',[RegisteredUserController::class, 'store']);
});

// Déconnexion (réservée aux connectés)
Route::post('/logout', [AuthenticatedSessionController::class, 'destroy'])
    ->middleware('auth')
    ->name('logout');


/*
|--------------------------------------------------------------------------
| PAGES PUBLIQUES
|--------------------------------------------------------------------------
*/
Route::get('/cities/search', [CitiesController::class, 'search'])->name('cities.search');

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

Route::get('/about',   fn () => Inertia::render('PublicPages/about'))->name('about');
Route::get('/contact', fn () => Inertia::render('PublicPages/contact'))->name('contact');
Route::post('/contact',[ContactController::class, 'send'])->name('contact.send');
Route::get('/cgu',     fn () => Inertia::render('PublicPages/cgu'))->name('cgu');
Route::get('/legal',   fn () => Inertia::render('PublicPages/legal'))->name('legal');
Route::get('/privacy', fn () => Inertia::render('PublicPages/privacy'))->name('privacy');
Route::get('/seo-example', fn () => Inertia::render('PublicPages/SeoExample'));


/*
|--------------------------------------------------------------------------
| ACTIVITÉS (public)
|--------------------------------------------------------------------------
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


/*
|--------------------------------------------------------------------------
| UTILISATEUR CONNECTÉ (zones privées)
|--------------------------------------------------------------------------
| NB: on enlève 'role:user' qui bloquait — on garde 'auth' (+ 'verified' si tu l'utilises).
*/
Route::middleware(['auth'])->group(function () {

    // Dashboard client (même page pour /dashboard et /dashboard/client)
    Route::get('/dashboard',        [DashboardClientController::class, 'client'])->name('dashboard');
    Route::get('/dashboard/client', [DashboardClientController::class, 'client'])->name('dashboard.client');

    // Annonces (liste)
    Route::get('/annonces', [AnnoncesController::class, 'index'])->name('annonces');

    // Mes réservations
    Route::get('/my-reservations', [ReservationsController::class, 'index'])->name('my.reservations');
    Route::post('/activities/{id}/reserve', [ReservationsController::class, 'store'])
        ->whereNumber('id')->name('activities.reserve');

    // Activities Connected
    Route::get('/activitesconnected',  [ActivitiesConnectedController::class, 'index'])->name('activities.connected');
    Route::get('/activitiesconnected', [ActivitiesConnectedController::class, 'index']); // alias
    Route::get('/activities/{id}/connected', [ActivitiesConnectedController::class, 'show'])
        ->whereNumber('id')->name('activity.details.connected');

    // Messagerie
    Route::get('/messagerie', [ConversationsController::class, 'index'])->name('messagerie');
    Route::get('/messages/{conversation}', [ConversationsController::class, 'show'])
        ->whereNumber('conversation')->name('messages.show');
    Route::post('/messages', [MessagesController::class, 'store'])->name('messages.store');
    Route::post('/messages/{conversation}/reply', [MessagesController::class, 'reply'])
        ->whereNumber('conversation')->name('messages.reply');
    Route::delete('/messages/{conversation}', [ConversationsController::class, 'destroy'])
        ->whereNumber('conversation')->name('messages.destroy');

    // Démo Messagerie
    Route::get('/messagerie-demo', fn () => Inertia::render('Messagerie'))->name('messagerie.demo');

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

    // Carte connectée
    Route::get('/carte', [ActivitiesConnectedController::class, 'map'])->name('map.connected');

    // Profil (pour l’instant en simple render, tu pourras brancher ton contrôleur)
    Route::get('/profil', fn () => Inertia::render('Profil'))->name('profil');
    Route::get('/profil/modifier', fn () => Inertia::render('EditProfil'))->name('edit.profil');
    Route::get('/organisateur/{id}', fn (int $id) => Inertia::render('ProfilOrganisateur', ['id' => $id]))
        ->whereNumber('id')->name('organisateur.profil');

    // CRUD annonces
    Route::get('/activities/create',      [AnnoncesController::class, 'create'])->name('activities.create');
    Route::post('/activities',            [AnnoncesController::class, 'store'])->name('activities.store');
    Route::get('/activities/{id}/edit',   [AnnoncesController::class, 'edit'])->whereNumber('id')->name('activities.edit');
    Route::put('/activities/{id}',        [AnnoncesController::class, 'update'])->whereNumber('id')->name('activities.update');
    Route::delete('/activities/{id}',     [AnnoncesController::class, 'destroy'])->whereNumber('id')->name('activities.destroy');
});


/*
|--------------------------------------------------------------------------
| ADMIN (protégé)
|--------------------------------------------------------------------------
*/
Route::middleware(['auth', 'role:admin'])->group(function () {
    Route::get('/admin/dashboard',          fn () => Inertia::render('admin/AdminDashboard'))->name('admin.dashboard');
    Route::get('/admin/admin-organizers',   fn () => Inertia::render('admin/AdminOrganizers'))->name('admin.organizers');
    Route::get('/admin/identity-validation',fn () => Inertia::render('admin/IdentityValidation'))->name('admin.identity.validation');
    Route::get('/admin/statistics',         fn () => Inertia::render('admin/Statistics'))->name('admin.statistics');
    Route::get('/admin/admin-activities',   [AdminActivitiesController::class, 'index'])->name('admin.activities');
});

// autres fichiers de routes si tu en as besoin
// require __DIR__.'/settings.php';
// require __DIR__.'/auth.php';
