<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

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
use App\Http\Controllers\Admin\AdminDashboardController;
use App\Http\Controllers\Admin\AdminOrganizersController;
use App\Http\Controllers\Admin\IdentityValidationController;
use App\Http\Controllers\Admin\StatisticsController;


// PROFIL PUBLIC
use App\Http\Controllers\ProfileController;

// AUTH CONTROLLERS
use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\Auth\RegisteredUserController;

// 🔹 PARAMÈTRES (Settings)
use App\Http\Controllers\Settings\PasswordController as SettingsPasswordController;
use App\Http\Controllers\Settings\ProfileController  as SettingsProfileController;

// MODELS
use App\Models\Activities;

// 🔐 Middleware (pour le hot-fix FQCN)
use App\Http\Middleware\AdminMiddleware;


/* ----------------------- AUTH (INVITÉS) ----------------------- */
Route::middleware('guest')->group(function () {
    Route::get('/login',    [AuthenticatedSessionController::class, 'create'])->name('login');
    Route::post('/login',   [AuthenticatedSessionController::class, 'store']);
    Route::get('/register', [RegisteredUserController::class, 'create'])->name('register');
    Route::post('/register',[RegisteredUserController::class, 'store']);
});

Route::post('/logout', [AuthenticatedSessionController::class, 'destroy'])
    ->middleware('auth')->name('logout');

/* ----------------------- PAGES PUBLIQUES ---------------------- */
Route::get('/cities/search', [CitiesController::class, 'search'])->name('cities.search');

Route::get('/', function () {
    $latest = Activities::query()
        ->latest()->take(4)->get()
        ->map(fn($a) => [
            'id'          => $a->id,
            'title'       => $a->title,
            'location'    => $a->location,
            'participants'=> $a->participants,
            'description' => $a->description,
            'why'         => $a->why,
            'dates'       => $a->dates ?? [],
            'date'        => $a->date,
            'image'       => $a->image,
            'image_url'   => $a->image_url,
            'latitude'    => $a->latitude,
            'longitude'   => $a->longitude,
        ]);

    $forMap = Activities::query()
        ->whereNotNull('latitude')->whereNotNull('longitude')
        ->latest()->take(200)->get()
        ->map(fn($a) => [
            'id'        => $a->id,
            'title'     => $a->title,
            'location'  => $a->location,
            'lat'       => (float) $a->latitude,
            'lng'       => (float) $a->longitude,
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

/* ----------------------- ACTIVITÉS (public) ------------------- */
Route::get('/activities', function () {
    $activities = Activities::query()
        ->latest()->paginate(9)
        ->through(function ($a) {
            return [
                'id'          => $a->id,
                'title'       => $a->title,
                'location'    => $a->location,
                'participants'=> $a->participants,
                'description' => $a->description,
                'why'         => $a->why,
                'dates'       => $a->dates ?? [],
                'date'        => $a->date,
                'image'       => $a->image,
                'image_url'   => $a->image_url,
                'latitude'    => $a->latitude,
                'longitude'   => $a->longitude,
                'host_user'   => $a->hostUser?->only(['id','name']),
            ];
        });

    return Inertia::render('PublicPages/activities', ['activities' => $activities]);
})->name('activities');

Route::get('/activities/{id}', function (int $id) {
    $a = Activities::with('hostUser')->findOrFail($id);

    return Inertia::render('PublicPages/details-activities', [
        'activity' => [
            'id'          => $a->id,
            'title'       => $a->title,
            'location'    => $a->location,
            'participants'=> $a->participants,
            'description' => $a->description,
            'why'         => $a->why,
            'dates'       => $a->dates ?? [],
            'date'        => $a->date,
            'image'       => $a->image,
            'image_url'   => $a->image_url,
            'latitude'    => $a->latitude,
            'longitude'   => $a->longitude,
            'host_user'   => $a->hostUser?->only(['id','name']),
        ]
    ]);
})->whereNumber('id')->name('activity.details');

/* ----------------------- PROFIL PUBLIC ------------------------ */
Route::get('/profil/{user}', [ProfileController::class, 'show'])
    ->whereNumber('user')->name('profile.show');

/* ----------------------- ZONE AUTH ---------------------------- */
Route::middleware(['auth'])->group(function () {

    // Dashboards
    Route::get('/dashboard', fn () => redirect()->route('profile.me'))->name('dashboard');
    Route::get('/dashboard/client', fn () => redirect()->route('profile.me'))->name('dashboard.client');

    // Annonces
    Route::get('/annonces', [AnnoncesController::class, 'index'])->name('annonces');

    // Mes réservations (VOYAGEUR) + Créer une réservation
    Route::get('/my-reservations', [ReservationsController::class, 'index'])->name('my.reservations');
    Route::post('/activities/{id}/reserve', [ReservationsController::class, 'store'])
        ->whereNumber('id')->name('activities.reserve');

    // 🔹 Demandes reçues (ORGANISATEUR) + actions
    Route::get('/host/reservations', [ReservationsController::class, 'inbox'])->name('host.reservations');
    Route::patch('/host/reservations/{activity}/{guest}/accept', [ReservationsController::class, 'accept'])
        ->whereNumber(['activity','guest'])->name('host.reservations.accept');
    Route::patch('/host/reservations/{activity}/{guest}/decline', [ReservationsController::class, 'decline'])
        ->whereNumber(['activity','guest'])->name('host.reservations.decline');

    // Activities Connected
    Route::get('/activitesconnected',  [ActivitiesConnectedController::class, 'index'])->name('activities.connected');
    Route::get('/activitiesconnected', [ActivitiesConnectedController::class, 'index']);
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

    Route::get('/messagerie-demo', fn () => Inertia::render('Messagerie'))->name('messagerie.demo');

    Route::get('/messagerie/{user}/{activity}', function (int $user, int $activity) {
        $a = \App\Models\Activities::with('hostUser:id,name,prenom,nom')->findOrFail($activity);
        return Inertia::render('Messagerie', [
            'contactId' => $user,
            'activityContext' => [
                'id'    => $a->id,
                'title' => $a->title,
                'location' => $a->location,
                'image' => $a->image,
                'host'  => [
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

    // Carte
    Route::get('/carte', [ActivitiesConnectedController::class, 'map'])->name('map.connected');

    // Mon profil
    Route::get('/profil', [\App\Http\Controllers\ProfileController::class, 'me'])->name('profile.me');
    Route::get('/profil/modifier', [\App\Http\Controllers\ProfileController::class, 'edit'])->name('profile.edit');
    Route::put('/profil', [\App\Http\Controllers\ProfileController::class, 'update'])->name('profile.update');

    // CRUD annonces
    Route::get('/activities/create',      [AnnoncesController::class, 'create'])->name('activities.create');
    Route::post('/activities',            [AnnoncesController::class, 'store'])->name('activities.store');
    Route::get('/activities/{id}/edit',   [AnnoncesController::class, 'edit'])->whereNumber('id')->name('activities.edit');
    Route::put('/activities/{id}',        [AnnoncesController::class, 'update'])->whereNumber('id')->name('activities.update');
    Route::delete('/activities/{id}',     [AnnoncesController::class, 'destroy'])->whereNumber('id')->name('activities.destroy');

    /* ---------------- PARAMÈTRES (Settings) ------------------- */
    Route::redirect('/parametres', '/parametres/profile');

    Route::get('/parametres/profile',   [SettingsProfileController::class,  'edit'])->name('settings.profile.edit');
    Route::patch('/parametres/profile', [SettingsProfileController::class,  'update'])->name('settings.profile.update');
    Route::delete('/parametres/profile',[SettingsProfileController::class,  'destroy'])->name('settings.profile.destroy');

    Route::get('/parametres/password',  [SettingsPasswordController::class, 'edit'])->name('settings.password.edit');
    Route::put('/parametres/password',  [SettingsPasswordController::class, 'update'])->name('settings.password.update');

    Route::get('/parametres/appearance', fn () => Inertia::render('settings/appearance'))->name('settings.appearance');
});

/* ----------------------- ADMIN ------------------------------- */
// ⬅️ Groupe admin existant (conservé). Pour éviter le conflit d’URL,
// je renomme juste l’ancienne page en “/admin/admin-organizers-old”.
Route::middleware(['auth','role:admin'])
    ->prefix('admin')
    ->name('admin.')
    ->group(function () {
        Route::get('/dashboard',           [AdminDashboardController::class, 'index'])->name('dashboard');
        Route::get('/admin-organizers-old', fn () => Inertia::render('admin/AdminOrganizers'))->name('organizers'); // ancien rendu direct conservé
        Route::get('/identity-validation', fn () => Inertia::render('admin/IdentityValidation'))->name('identity.validation');
        Route::get('/statistics',          fn () => Inertia::render('admin/Statistics'))->name('statistics');
        Route::get('/admin-activities',    [AdminActivitiesController::class, 'index'])->name('activities');
    });


Route::middleware(['auth', AdminMiddleware::class])
    ->prefix('admin')->name('admin.')
    ->group(function () {
        Route::get('/admin-organizers', [AdminOrganizersController::class, 'index'])
            ->name('organizers.index');
        Route::delete('/users/{user}', [AdminOrganizersController::class, 'destroy'])
            ->name('users.destroy');
    });


Route::middleware(['auth', \App\Http\Middleware\AdminMiddleware::class])
    ->prefix('admin')->name('admin.')
    ->group(function () {
        // Liste des pièces à valider
        Route::get('/identity-validation', [IdentityValidationController::class, 'index'])
            ->name('identity.validation');

        // Actions
        Route::patch('/identity-validation/{user}/approve', [IdentityValidationController::class, 'approve'])
            ->whereNumber('user')->name('identity.approve');

        Route::patch('/identity-validation/{user}/reject', [IdentityValidationController::class, 'reject'])
            ->whereNumber('user')->name('identity.reject');
    });


Route::middleware(['auth','role:admin'])
    ->prefix('admin')->name('admin.')
    ->group(function () {
        Route::get('/statistics', [StatisticsController::class, 'index'])
            ->name('statistics');
    });


Route::get('/admin-activities', [AdminActivitiesController::class, 'index'])
    ->name('admin.activities');

Route::delete('/admin-activities/{activity}', [AdminActivitiesController::class, 'destroy'])
    ->whereNumber('activity')
    ->name('admin.activities.destroy');
