import giulia from '@/assets/images/giulia.png';
import marc from '@/assets/images/marc-delacroix.png';
import aiko from '@/assets/images/aiko.png';
import claire from '@/assets/images/claire.png';
import youssef from '@/assets/images/youssef.png';
import haruki from '@/assets/images/haruki.png';
import lina from '@/assets/images/lina.png';
import carlos from '@/assets/images/carlos.png';
import julie from '@/assets/images/julie.png';
import nadia from '@/assets/images/nadia-doc.png';
import sofia from '@/assets/images/sofia.png';
import liam from '@/assets/images/liam.png';
import anya from '@/assets/images/anya.png';
import jonas from '@/assets/images/jonas.png';

import giuliadoc from '@/assets/images/giulia-doc.png';
import marcdoc from '@/assets/images/marc-doc.png';
import aikodoc from '@/assets/images/aiko-doc.png';
import clairedoc from '@/assets/images/claire-doc.png';
import youssefdoc from '@/assets/images/youssef-doc.png';
import harukidoc from '@/assets/images/haruki-doc.png';
import linadoc from '@/assets/images/lina-doc.png';
import carlosdoc from '@/assets/images/carlos-doc.png';
import juliedoc from '@/assets/images/julie-doc.png';
import nadiadoc from '@/assets/images/nadia-doc.png';
import sofiadoc from '@/assets/images/sofia-doc.png';
import liamdoc from '@/assets/images/liam-doc.png';
import anyadoc from '@/assets/images/anya-doc.png';
import jonasdoc from '@/assets/images/jonas-doc.png';


export const allUsers = [
  {
    id: 101, // Deja fait
    prenom: 'Giulia', // Rajouter une colonne
    nom: 'Romano', // Deja fait
    photo: giulia, // URL Varchar
    bio: 'Nouvelle expatriée à Rome...', // Text
    location: 'Rome, Italie', // Varchar
    verifie: true, // Boolean
    document: giuliadoc, // URL Varchar
    inscription: '2024-07-15', // Déjà fait created_at
    role: 'organisateur', // Deja fait
  },
  {
    id: 102,
    prenom: 'Marc',
    nom: 'Delacroix',
    photo: marc,
    bio: 'Navigateur passionné...',
    location: 'Cannes, France',
    verifie: true,
    document: marcdoc,
    inscription: '2024-06-28',
    role: 'organisateur',
  },
  {
    id: 103,
    prenom: 'Aiko',
    nom: 'Nakamura',
    photo: aiko,
    bio: 'Habitante de Tokyo...',
    location: 'Tokyo, Japon',
    verifie: true,
    document: aikodoc,
    inscription: '2024-05-30',
    role: 'organisateur',
  },
  {
    id: 104,
    prenom: 'Claire',
    nom: 'Morel',
    photo: claire,
    bio: 'Niçoise de cœur...',
    location: 'Nice, France',
    verifie: true,
    document: clairedoc,
    inscription: '2024-07-01',
    role: 'organisateur',
  },
  {
    id: 105,
    prenom: 'Youssef',
    nom: 'Benali',
    photo: youssef,
    bio: 'Passionné du désert...',
    location: 'Marrakech, Maroc',
    verifie: true,
    document: youssefdoc,
    inscription: '2024-06-10',
    role: 'organisateur',
  },
  {
    id: 106,
    prenom: 'Haruki',
    nom: 'Tanaka',
    photo: haruki,
    bio: 'Amoureux de la nature...',
    location: 'Banff, Japon',
    verifie: true,
    document: harukidoc,
    inscription: '2024-06-15',
    role: 'organisateur',
  },
  {
    id: 107,
    prenom: 'Lina',
    nom: 'Svensson',
    photo: lina,
    bio: 'Guide suédoise...',
    location: 'Västerland, Suède',
    verifie: true,
    document: linadoc,
    inscription: '2024-05-18',
    role: 'organisateur',
  },
  {
    id: 108,
    prenom: 'Carlos',
    nom: 'Méndez',
    photo: carlos,
    bio: 'Chef passionné...',
    location: 'Cancun, Mexique',
    verifie: true,
    document: carlosdoc,
    inscription: '2024-07-10',
    role: 'organisateur',
  },
  {
    id: 109,
    prenom: 'Julie',
    nom: 'Forestier',
    photo: julie,
    bio: 'Fan de sensations...',
    location: 'Valbonne, France',
    verifie: true,
    document: juliedoc,
    inscription: '2024-06-20',
    role: 'organisateur',
  },
  {
    id: 201,
    prenom: 'Nadia',
    nom: 'BOUJNAH',
    photo: nadia,
    bio: 'Passionnée de voyages...',
    location: 'Cannes, France',
    verifie: true,
    document: nadiadoc,
    inscription: '2024-05-01',
    role: 'organisateur',
  },

  // PARTICIPANTS à valider
  {
    id: 301,
    prenom: 'Sofia',
    nom: 'Martinez',
    photo: sofia,
    bio: 'Globe-trotteuse espagnole en tour d’Europe.',
    location: 'Grenade, Espagne',
    verifie: 'en attente',
    document: sofiadoc,
    inscription: '2024-07-20',
    role: 'participant',
  },
  {
    id: 302,
    prenom: 'Liam',
    nom: 'Dupont',
    photo: liam,
    bio: 'Étudiant français en Erasmus en Italie.',
    location: 'Bologne, Italie',
    verifie: 'en attente',
    document: liamdoc,
    inscription: '2024-07-19',
    role: 'participant',
  },
  {
    id: 303,
    prenom: 'Anya',
    nom: 'Petrova',
    photo: anya,
    bio: 'Photographe freelance en vadrouille.',
    location: 'Tbilissi, Géorgie',
    verifie: 'en attente',
    document: anyadoc,
    inscription: '2024-07-18',
    role: 'participant',
  },
  {
    id: 304,
    prenom: 'Jonas',
    nom: 'Berg',
    photo: jonas,
    bio: 'Digital nomad entre les fjords et les startups.',
    location: 'Oslo, Norvège',
    verifie: 'en attente',
    document: jonasdoc,
    inscription: '2024-07-17',
    role: 'participant',
  },
];
