import rome from "@/assets/images/rome.png";
import excursionBateau from "@/assets/images/excursionbateau.png";
import visiteJapon from "@/assets/images/visitejapon.png";
import coucherSoleil from "@/assets/images/couchersoleil.png";
import hommeDesert from "@/assets/images/hommedésert.png";
import femmeForet from "@/assets/images/femmeforet.png";
import montagne from "@/assets/images/montagne.png";
import repasMexique from "@/assets/images/repasmexique.png";
import femmeAccrobranche from "@/assets/images/femmeaccrobranche.png";
import poterie from "@/assets/images/poterie.png";
import picnique from "@/assets/images/picnique.png";


export const allActivities = [
  {
    id: 1,
    image: rome,
    title: 'Visite de Rome',
    location: 'Rome, Italie',
    coordinates: [41.9028, 12.4964],
    participants: 3,
    description: "Plongez dans l'histoire antique de Rome avec une visite guidée du Colisée et du Forum.",
    why: "Pour découvrir les trésors de l'Empire romain et marcher sur les pas des empereurs.",
    host_user: { id: 101, name: 'Giulia Romano' },
    guest_users: [ // List de Users Clé étrangère (après CRUD) Table de relation
      {id: 1, name: 'Participant 1'},
      {id: 2, name: 'Participant 2'},
      {id: 3, name: 'Participant 1'},
    ],
    dates: ['05-08-2025', '20-08-2025'],
  },
  {
    id: 2,
    image: excursionBateau,
    title: 'Excursion bateau',
    location: 'Cannes, France',
    coordinates: [43.5528, 7.0174],
    participants: 2,
    description: "Naviguez au coucher du soleil le long de la Côte d'Azur.",
    why: "Une parenthèse détente avec vue sur les plus belles criques.",
    host_user: { id: 102, name: 'Marc Delacroix' },
    guest_users: [ // List de Users Clé étrangère (après CRUD) Table de relation
      {id: 1, name: 'Participant 1'},
      {id: 2, name: 'Participant 2'},
    ],
    dates: ['10-08-2025', '25-08-2025'],
  },
  {
    id: 3,
    image: visiteJapon,
    title: 'Visite de Tokyo',
    location: 'Tokyo, Japon',
    coordinates: [35.6895, 139.6917],
    participants: 1,
    description: "Explorez les rues animées de Shibuya et Asakusa avec un guide local.",
    why: "Pour vivre l'énergie urbaine du Japon, entre tradition et modernité.",
    host_user: { id: 103, name: 'Aiko Nakamura' },
    guest_users: [ // List de Users Clé étrangère (après CRUD) Table de relation
      {id: 1, name: 'Participant 1'},
    ],
    dates: ['12-08-2025', '30-08-2025'],
  },
  {
    id: 4,
    image: coucherSoleil,
    title: 'Coucher de soleil',
    location: 'Nice, France',
    coordinates: [43.7102, 7.2620],
    participants: 4,
    description: "Un moment paisible à partager sur les plages de Nice.",
    why: "Pour s'offrir un instant de calme face à la mer Méditerranée.",
    host_user: { id: 104, name: 'Claire Morel' },
    guest_users: [ // List de Users Clé étrangère (après CRUD) Table de relation
      {id: 1, name: 'Participant 1'},
      {id: 2, name: 'Participant 2'},
      {id: 4, name: 'Participant 1'},
      {id: 4, name: 'Participant 2'},
    ],
    dates: ['15-08-2025', '28-08-2025'],
  },
  {
    id: 5,
    image: hommeDesert,
    title: "Désert d'Agafay",
    location: 'Marrakech, Maroc',
    coordinates: [31.3965, -8.1116],
    participants: 4,
    description: "Aventure dans le désert avec dîner et feu de camp.",
    why: "Pour découvrir les paysages arides du Maroc dans une ambiance chaleureuse.",
    host_user: { id: 105, name: 'Youssef Benali' },
    guest_users: [ // List de Users Clé étrangère (après CRUD) Table de relation
      {id: 1, name: 'Participant 1'},
      {id: 2, name: 'Participant 2'},
      {id: 4, name: 'Participant 1'},
      {id: 4, name: 'Participant 2'},
    ],
    dates: ['18-08-2025', '28-08-2025'],
  },
  {
    id: 6,
    image: femmeForet,
    title: 'Exploration forêt',
    location: 'Banff, Japon',
    coordinates: [36.2048, 138.2529], // Japon générique (Banff est au Canada, mais je garde Japon ici)
    participants: 3,
    description: "Randonnée découverte dans la forêt japonaise.",
    why: "Pour se reconnecter à la nature loin des sentiers touristiques.",
    host_user: { id: 106, name: 'Haruki Tanaka' },
    guest_users: [ // List de Users Clé étrangère (après CRUD) Table de relation
      {id: 1, name: 'Participant 1'},
      {id: 2, name: 'Participant 2'},
      {id: 3, name: 'Participant 2'},
    ],
    dates: ['07-08-2025', '22-08-2025'],
  },
  {
    id: 7,
    image: montagne,
    title: 'Randonnée',
    location: 'Västerland, Suède',
    coordinates: [58.9690, 11.2340],
    participants: 4,
    description: "Marche guidée dans les montagnes suédoises.",
    why: "Pour respirer l’air pur et admirer les panoramas scandinaves.",
    host_user: { id: 107, name: 'Lina Svensson' },
    guest_users: [ // List de Users Clé étrangère (après CRUD) Table de relation
      {id: 1, name: 'Participant 1'},
      {id: 2, name: 'Participant 2'},
      {id: 3, name: 'Participant 1'},
      {id: 4, name: 'Participant 2'},
    ],
    dates: ['13-08-2025', '27-08-2025'],
  },
  {
    id: 8, // Auto
    image: repasMexique, // URL (varchar)
    title: 'Partage Repas locale', // Varchar
    location: 'Cancun, Mexique', // Varchar
    longitude: 21.1619, // Float
    latitude : -86.8515, // Float signé
    participants: 2, // Int
    description: "Découvrez les saveurs locales autour d’une grande tablée.", // Varchar
    why: "Pour goûter aux spécialités et échanger des anecdotes culturelles.", // Varchar
    host_user: { id: 108, name: 'Carlos Méndez' }, // User Clé étrangère (on le fait dès que t'as un CRUD)
    guest_users: [ // List de Users Clé étrangère (après CRUD) Table de relation
      {id: 1, name: 'Participant 1'},
      {id: 2, name: 'Participant 2'},
    ],
    dates: ['09-10-2025', '02-09-2025'], // Clé étrangère (on le fait après CRUD) Table de relation
  },
  {
    id: 9,
    image: femmeAccrobranche,
    title: 'Accrobranche',
    location: 'Valbonne, France',
    coordinates: [43.6411, 7.0086],
    participants: 3,
    description: "Une journée d’activités suspendues dans la nature.",
    why: "Pour se dépasser et rigoler entre amis dans un cadre verdoyant.",
    host_user: { id: 109, name: 'Julie Forestier' },
    guest_users: [ // List de Users Clé étrangère (après CRUD) Table de relation
      {id: 1, name: 'Participant 1'},
      {id: 2, name: 'Participant 2'},
      {id: 3, name: 'Participant 2'},
    ],
    
    dates: ['15-09-2025', '20-09-2025'],
  },
  {
    id: 10,
    image: poterie,
    title: 'Atelier poterie',
    location: 'Mandelieu-la-Napoule',
    coordinates: [43.5436, 6.9370],
    participants: 1,
    description: 'Un atelier créatif au bord de la mer pour découvrir la poterie.',
    why: 'Pour apprendre une activité artisanale les pieds dans le sable.',
    host_user: { id: 201, name: 'Nadia BOUJNAH' },
    guest_users: [ // List de Users Clé étrangère (après CRUD) Table de relation
      {id: 1, name: 'Participant 1'},
    ],
    dates: ['25-07-2025'],
  },
  {
    id: 11,
    image: picnique,
    title: 'Pique-nique bord de mer',
    location: 'Théoule-sur-Mer',
    coordinates: [43.5039, 6.9387],
    participants: 1,
    description: 'Partage d’un moment convivial autour d’un pique-nique au soleil.',
    why: 'Pour rencontrer des gens dans un cadre naturel et détendu.',
    host_user: { id: 201, name: 'Nadia BOUJNAH' },
    guest_users: [ // List de Users Clé étrangère (après CRUD) Table de relation
      {id: 1, name: 'Participant 1'},
    ],
    dates: ['28-07-2025'],
  }
];
