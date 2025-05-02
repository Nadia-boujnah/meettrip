import GuestLayout from '@/Layouts/GuestLayout';
import { Link } from '@inertiajs/react';
import { useState } from 'react';

import rome from '@/assets/images/rome.png';
import excursionBateau from '@/assets/images/excursionbateau.png';
import visiteJapon from '@/assets/images/visitejapon.png';
import coucherSoleil from '@/assets/images/couchersoleil.png';
import hommeDesert from '@/assets/images/hommedésert.png';
import femmeForet from '@/assets/images/femmeforet.png';
import montagne from '@/assets/images/montagne.png';
import repasMexique from '@/assets/images/repasmexique.png';
import femmeAccrobranche from '@/assets/images/femmeaccrobranche.png';

const allActivities = [
  { id: 1, image: rome, title: 'Visite de Rome', location: 'Rome, Italie', participants: 3 },
  { id: 2, image: excursionBateau, title: 'Excursion bateau', location: 'Cannes, France', participants: 2 },
  { id: 3, image: visiteJapon, title: 'Visite de Tokyo', location: 'Tokyo, Japon', participants: 1 },
  { id: 4, image: coucherSoleil, title: 'Coucher de soleil', location: 'Nice, France', participants: 4 },
  { id: 5, image: hommeDesert, title: "Désert d'Agafay", location: 'Marrakech, Maroc', participants: 4 },
  { id: 6, image: femmeForet, title: 'Exploration forêt', location: 'Banff, Japon', participants: 3 },
  { id: 7, image: montagne, title: 'Randonnée', location: 'Västerland, Suède', participants: 4 },
  { id: 8, image: repasMexique, title: 'Partage Repas locale', location: 'Cancun, Mexique', participants: 2 },
  { id: 9, image: femmeAccrobranche, title: 'Accrobranche', location: 'Valbonne, France', participants: 3 },
];

export default function Activities() {
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const activitiesPerPage = 3;

  const filteredActivities = allActivities.filter((activity) =>
    activity.title.toLowerCase().includes(search.toLowerCase()) ||
    activity.location.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filteredActivities.length / activitiesPerPage);
  const startIndex = (currentPage - 1) * activitiesPerPage;
  const paginatedActivities = filteredActivities.slice(startIndex, startIndex + activitiesPerPage);

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <GuestLayout>
      <div className="bg-white text-[#1B1B18] pt-8 pb-12 px-4 sm:px-6 max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-center tracking-tight mb-8">Activités</h1>

        {/* Barre de recherche */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-center mb-10">
          <input
            type="text"
            placeholder="Rechercher une activité..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full md:w-1/3 border border-gray-300 rounded-md px-4 py-2"
          />
          <select className="w-full md:w-auto border border-gray-300 rounded-md px-4 py-2">
            <option>Pays</option>
          </select>
          <select className="w-full md:w-auto border border-gray-300 rounded-md px-4 py-2">
            <option>Type d'activité...</option>
          </select>
        </div>

        {/* Grille d'activités */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {paginatedActivities.map((activity) => (
            <div key={activity.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <img src={activity.image} alt={activity.title} className="h-48 w-full object-cover" />
              <div className="p-4">
                <div className="text-sm text-gray-500 mb-1">
                  {activity.participants} participant{activity.participants > 1 ? 's' : ''}
                </div>
                <h2 className="font-semibold text-lg">{activity.title}</h2>
                <p className="text-sm text-gray-600 mb-4">{activity.location}</p>
                <Link
                  href={route('activity.details', { id: activity.id })}
                  className="block text-center bg-[#247BA0] hover:bg-[#3498DB] text-white py-2 rounded-md transition"
                >
                  Voir plus
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-10 space-x-2 text-sm font-medium">
            <button
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
              className={`px-3 py-1 rounded ${currentPage === 1 ? 'text-gray-400 cursor-not-allowed' : 'hover:underline'}`}
            >
              ← Précédent
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => goToPage(page)}
                className={`px-3 py-1 rounded ${
                  page === currentPage ? 'bg-black text-white' : 'text-black hover:underline'
                }`}
              >
                {page}
              </button>
            ))}

            <button
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`px-3 py-1 rounded ${currentPage === totalPages ? 'text-gray-400 cursor-not-allowed' : 'hover:underline'}`}
            >
              Suivant →
            </button>
          </div>
        )}
      </div>
    </GuestLayout>
  );
}
