<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use App\Models\User;

class DemoUsersSeeder extends Seeder
{
    public function run(): void
    {

        $rows = [
            // --- ORGANISATEURS VÉRIFIÉS ---
            ['prenom'=>'Giulia','nom'=>'Romano','email'=>'giulia@example.com','password'=>'password',
             'bio'=>"Nouvelle expatriée à Rome, j'aime partager mes découvertes culinaires et culturelles.",
             'location'=>'Rome, Italie','avatar'=>'avatars/giulia.png','document'=>'documents/giulia-doc.png',
             'verification_status'=>'verified','role'=>'organisateur'],
            ['prenom'=>'Marc','nom'=>'Delacroix','email'=>'marc@example.com','password'=>'password',
             'bio'=>"Navigateur passionné, j’organise des sorties en mer sur la côte d’Azur.",
             'location'=>'Cannes, France','avatar'=>'avatars/marc-delacroix.png','document'=>'documents/marc-doc.png',
             'verification_status'=>'verified','role'=>'organisateur'],
            ['prenom'=>'Aiko','nom'=>'Nakamura','email'=>'aiko@example.com','password'=>'password',
             'bio'=>"Habitante de Tokyo, je fais découvrir les traditions japonaises aux visiteurs.",
             'location'=>'Tokyo, Japon','avatar'=>'avatars/aiko.png','document'=>'documents/aiko-doc.png',
             'verification_status'=>'verified','role'=>'organisateur'],
            ['prenom'=>'Claire','nom'=>'Morel','email'=>'claire@example.com','password'=>'password',
             'bio'=>"Niçoise de cœur, j’adore partager les coins secrets de la Côte d’Azur.",
             'location'=>'Nice, France','avatar'=>'avatars/claire.png','document'=>'documents/claire-doc.png',
             'verification_status'=>'verified','role'=>'organisateur'],
            ['prenom'=>'Youssef','nom'=>'Benali','email'=>'youssef@example.com','password'=>'password',
             'bio'=>"Passionné du désert, j’organise des excursions et des nuits à la belle étoile.",
             'location'=>'Marrakech, Maroc','avatar'=>'avatars/youssef.png','document'=>'documents/youssef-doc.png',
             'verification_status'=>'verified','role'=>'organisateur'],
            ['prenom'=>'Haruki','nom'=>'Tanaka','email'=>'haruki@example.com','password'=>'password',
             'bio'=>"Amoureux de la nature, je propose des randonnées autour du mont Fuji.",
             'location'=>'Banff, Japon','avatar'=>'avatars/haruki.png','document'=>'documents/haruki-doc.png',
             'verification_status'=>'verified','role'=>'organisateur'],
            ['prenom'=>'Lina','nom'=>'Svensson','email'=>'lina@example.com','password'=>'password',
             'bio'=>"Guide suédoise passionnée, j’accompagne des visites dans les fjords scandinaves.",
             'location'=>'Västerland, Suède','avatar'=>'avatars/lina.png','document'=>'documents/lina-doc.png',
             'verification_status'=>'verified','role'=>'organisateur'],
            ['prenom'=>'Carlos','nom'=>'Méndez','email'=>'carlos@example.com','password'=>'password',
             'bio'=>"Chef mexicain, je partage ma passion pour la cuisine locale et les saveurs épicées.",
             'location'=>'Cancun, Mexique','avatar'=>'avatars/carlos.png','document'=>'documents/carlos-doc.png',
             'verification_status'=>'verified','role'=>'organisateur'],
            ['prenom'=>'Julie','nom'=>'Forestier','email'=>'julie@example.com','password'=>'password',
             'bio'=>"Fan de sensations fortes, j’organise des activités sportives en plein air.",
             'location'=>'Valbonne, France','avatar'=>'avatars/julie.png','document'=>'documents/julie-doc.png',
             'verification_status'=>'verified','role'=>'organisateur'],
            ['prenom'=>'Nadia','nom'=>'BOUJNAH','email'=>'nadia@example.com','password'=>'password',
             'bio'=>"Passionnée de voyages et de nouvelles rencontres. J'aime découvrir de nouvelles spécialités et endroits.",
             'location'=>'Cannes, France','avatar'=>'avatars/nadia-doc.png','document'=>'documents/nadia-doc.png',
             'verification_status'=>'verified','role'=>'organisateur'],

            // --- PARTICIPANTS EN ATTENTE ---
            ['prenom'=>'Sofia','nom'=>'Martinez','email'=>'sofia@example.com','password'=>'password',
             'bio'=>'Globe-trotteuse espagnole en tour d’Europe.','location'=>'Grenade, Espagne',
             'avatar'=>'avatars/sofia.png','document'=>'documents/sofia-doc.png',
             'verification_status'=>'pending','role'=>'participant'],
            ['prenom'=>'Liam','nom'=>'Dupont','email'=>'liam@example.com','password'=>'password',
             'bio'=>'Étudiant français en Erasmus en Italie.','location'=>'Bologne, Italie',
             'avatar'=>'avatars/liam.png','document'=>'documents/liam-doc.png',
             'verification_status'=>'pending','role'=>'participant'],
            ['prenom'=>'Anya','nom'=>'Petrova','email'=>'anya@example.com','password'=>'password',
             'bio'=>'Photographe freelance en vadrouille.','location'=>'Tbilissi, Géorgie',
             'avatar'=>'avatars/anya.png','document'=>'documents/anya-doc.png',
             'verification_status'=>'pending','role'=>'participant'],
            ['prenom'=>'Jonas','nom'=>'Berg','email'=>'jonas@example.com','password'=>'password',
             'bio'=>'Digital nomad entre les fjords et les startups.','location'=>'Oslo, Norvège',
             'avatar'=>'avatars/jonas.png','document'=>'documents/jonas-doc.png',
             'verification_status'=>'pending','role'=>'participant'],
        ];

       foreach ($rows as $r) {
    // Construire le champ 'name' requis par la table users
    $r['name'] = trim(($r['prenom'] ?? '') . ' ' . ($r['nom'] ?? ''));
    if ($r['name'] === '') {
        $r['name'] = $r['email'] ?? 'Utilisateur';
    }

    User::updateOrCreate(
        ['email' => $r['email']],
        array_merge($r, ['password' => Hash::make($r['password'])])
    );
}

    }
}
