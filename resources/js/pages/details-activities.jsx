import GuestLayout from '@/Layouts/GuestLayout';
import { usePage } from '@inertiajs/react';
import { Link } from '@inertiajs/react';

import rome from '@/assets/images/rome.png';
import excursionBateau from '@/assets/images/excursionbateau.png';
import visiteJapon from '@/assets/images/visitejapon.png';
import coucherSoleil from '@/assets/images/couchersoleil.png';
import hommeDesert from '@/assets/images/hommedésert.png';
import femmeForet from '@/assets/images/femmeforet.png';
import montagne from '@/assets/images/montagne.png';
import repasMexique from '@/assets/images/repasmexique.png';
import femmeAccrobranche from '@/assets/images/femmeaccrobranche.png';

const fakeData = [
  {
    id: 1,
    image: rome,
    title: 'Visite de Rome',
    location: 'Rome, Italie',
    participants: 3,
    description: "Plongez dans l'histoire antique de Rome avec une visite guidée du Colisée et du Forum.",
    host: 'Giulia Romano',
    why: "Pour découvrir les trésors de l'Empire romain, marcher sur les pas des empereurs et profiter d'une immersion historique dans la ville éternelle."
  },
  {
    id: 2,
    image: excursionBateau,
    title: 'Excursion bateau',
    location: 'Cannes, France',
    participants: 2,
    description: "Naviguez au coucher du soleil le long de la Côte d'Azur.",
    host: 'Marc Delacroix',
    why: "Une parenthèse détente entre voyageurs avec vue sur les plus belles criques du sud."
  },
  {
    id: 3,
    image: visiteJapon,
    title: 'Visite de Tokyo',
    location: 'Tokyo, Japon',
    participants: 1,
    description: "Explorez les rues animées de Shibuya et Asakusa avec un guide local.",
    host: 'Aiko Nakamura',
    why: "Pour vivre l'énergie urbaine du Japon, entre traditions anciennes et culture pop moderne."
  },
  {
    id: 4,
    image: coucherSoleil,
    title: 'Coucher de soleil',
    location: 'Nice, France',
    participants: 4,
    description: "Un moment paisible à partager sur les plages de Nice.",
    host: 'Claire Morel',
    why: "Pour s'offrir un instant de calme et d'émerveillement à la fin de la journée, face à la mer Méditerranée."
  },
  {
    id: 5,
    image: hommeDesert,
    title: "Désert d'Agafay",
    location: 'Marrakech, Maroc',
    participants: 4,
    description: "Vivez une aventure dans le désert avec dîner et feu de camp.",
    host: 'Youssef Benali',
    why: "Pour découvrir les paysages arides et magiques du Maroc dans une ambiance chaleureuse et authentique."
  },
  {
    id: 6,
    image: femmeForet,
    title: 'Exploration forêt',
    location: 'Banff, Japon',
    participants: 3,
    description: "Randonnée découverte dans la forêt japonaise.",
    host: 'Haruki Tanaka',
    why: "Pour se reconnecter à la nature et explorer des sentiers secrets loin des sentiers touristiques."
  },
  {
    id: 7,
    image: montagne,
    title: 'Randonnée',
    location: 'Västerland, Suède',
    participants: 4,
    description: "Marche guidée dans les montagnes suédoises.",
    host: 'Lina Svensson',
    why: "Pour respirer l’air pur nordique et admirer les panoramas sauvages de la Scandinavie."
  },
  {
    id: 8,
    image: repasMexique,
    title: 'Partage Repas locale',
    location: 'Cancun, Mexique',
    participants: 2,
    description: "Découvrez les saveurs locales autour d’une grande tablée conviviale.",
    host: 'Carlos Méndez',
    why: "Pour goûter aux spécialités régionales en bonne compagnie et échanger des anecdotes culturelles autour d’un bon plat."
  },
  {
    id: 9,
    image: femmeAccrobranche,
    title: 'Accrobranche',
    location: 'Valbonne, France',
    participants: 3,
    description: "Accrochez-vous pour une journée d’activités suspendues dans la nature.",
    host: 'Julie Forestier',
    why: "Pour tester ses limites, se dépasser et rigoler entre amis dans un cadre verdoyant et sécurisé."
  }
];

export default function DetailsActivity() {
  const { id } = usePage().props;
  const activity = fakeData.find((a) => a.id === parseInt(id));

  if (!activity) return <div className="text-center py-10 text-gray-500">Activité introuvable.</div>;

  return (
    <GuestLayout>
      <div className="max-w-4xl mx-auto px-4 py-12">
        <img
          src={activity.image}
          alt={activity.title}
          className="w-full h-64 object-cover rounded-lg mb-8"
        />

        <h1 className="text-3xl font-bold mb-2">{activity.title}</h1>
        <p className="text-gray-600 text-sm mb-2">{activity.location}</p>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
          <p className="text-sm text-gray-500">
            Organisé par <span className="font-medium text-[#247BA0]">{activity.host}</span>
          </p>
          <p className="text-sm text-gray-500 mt-2 sm:mt-0">
            {activity.participants} participant{activity.participants > 1 ? 's' : ''}
          </p>
        </div>

        <p className="text-gray-700 leading-relaxed mb-6">{activity.description}</p>

        <div className="bg-[#F5F5F5] p-4 rounded-md mb-8">
          <h2 className="text-lg font-semibold mb-2 text-[#1B1B18]">Pourquoi faire cette activité ?</h2>
          <p className="text-sm text-gray-700">{activity.why}</p>
        </div>
        <Link
        href="/login"
        className="inline-block bg-[#247BA0] hover:bg-[#3498DB] text-white font-semibold py-2 px-6 rounded-md transition">
  Se connecter pour réserver
</Link>
      </div>
      
    </GuestLayout>
  );
}
