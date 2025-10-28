import GuestLayout from '@/layouts/GuestLayout';
import { useState } from 'react';
import { allActivities } from '@/data/activities';
import ActivityCard from '@/components/ActivityCard'; // ✅ On importe notre composant

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
            <ActivityCard key={activity.id} activity={activity} />
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
