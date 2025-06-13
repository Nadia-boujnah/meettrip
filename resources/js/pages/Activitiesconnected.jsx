import AppLayout from '@/layouts/app-layout';
import { Head, usePage } from '@inertiajs/react';
import { useState } from 'react';
import ActivityCard from '@/components/ActivityCard'; 
import ReservationModal from '@/components/ReservationModal';

export default function Activitiesconnected() {
  const { auth = {}, activities = [] } = usePage().props;
  const user = auth.user;

  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [showCalendar, setShowCalendar] = useState(false);

  const activitiesPerPage = 3;

  const filteredActivities = activities.filter((activity) =>
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

  const handleReservation = (activity) => {
    setSelectedActivity(activity);
    setShowCalendar(true);
  };

  return (
    <AppLayout>
      <Head title="Activités" />

      <div className="p-6 space-y-6 max-w-7xl mx-auto">
        <h1 className="text-2xl font-semibold">Toutes les Activités</h1>

        {/* Barre de recherche */}
        <div className="flex flex-col sm:flex-row gap-4">
          <input
            type="text"
            placeholder="Rechercher une activité..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full sm:w-1/3 border border-gray-300 rounded-md px-4 py-2"
          />
          <select className="w-full sm:w-auto border border-gray-300 rounded-md px-4 py-2">
            <option>Pays</option>
          </select>
          <select className="w-full sm:w-auto border border-gray-300 rounded-md px-4 py-2">
            <option>Type d'activité</option>
          </select>
        </div>

        {/* Grille d'activités */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {paginatedActivities.map((activity) => (
            <div
              key={activity.id}
              className="bg-white rounded shadow overflow-hidden flex flex-col justify-between"
            >
              {activity.image && (
                <img
                  src={`/storage/${activity.image}`}
                  alt={activity.title}
                  className="w-full h-48 object-cover rounded-t"
                />
              )}
              <div className="p-4 flex flex-col justify-between h-full">
                <div>
                  <h2 className="font-semibold text-lg">{activity.title}</h2>
                  <p className="text-sm text-gray-600">
                    {activity.location} – {activity.date}
                  </p>
                  <p className="text-sm mt-1">{activity.description}</p>
                </div>
                {activity.host_user && (
                  <p className="text-sm text-gray-500 mt-4">
                    Organisé par <span className="font-medium">{activity.host_user.prenom} {activity.host_user.nom}</span>
                  </p>
                )}
                <button
                  onClick={() => handleReservation(activity)}
                  className="mt-4 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded text-sm"
                >
                  Réserver
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-8 space-x-2">
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
                className={`px-3 py-1 rounded ${page === currentPage ? 'bg-black text-white' : 'text-black hover:underline'}`}
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

      {/* Modale de réservation */}
      <ReservationModal
        visible={showCalendar}
        onClose={() => setShowCalendar(false)}
        activity={selectedActivity}
      />
    </AppLayout>
  );
}
