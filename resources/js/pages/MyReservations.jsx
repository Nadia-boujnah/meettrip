import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';
import { useState } from 'react';
import { BadgeCheck, Clock, XCircle } from 'lucide-react';
import { allActivities } from '@/data/activities';
import { Link } from '@inertiajs/react';


export default function MyReservations() {
  // Liste simulée des réservations de l'utilisateur (par ID et statut)
  const mesReservations = [
    { activityId: 4, statut: 'en attente' },
    { activityId: 2, statut: 'validé' },
  ];

  // Fusionne les infos de réservation avec les données d'activité
  const reservationsAvecDetails = mesReservations.map((res) => {
    const activite = allActivities.find((a) => a.id === res.activityId);
    return {
      ...activite,
      statut: res.statut,
    };
  });

  // Composant visuel du badge
  const getStatusBadge = (statut) => {
    switch (statut) {
      case 'en attente':
        return (
          <span className="inline-flex items-center gap-1 bg-yellow-100 text-yellow-800 text-xs font-semibold px-2 py-1 rounded">
            <Clock className="w-4 h-4" /> En attente
          </span>
        );
      case 'validé':
        return (
          <span className="inline-flex items-center gap-1 bg-green-100 text-green-800 text-xs font-semibold px-2 py-1 rounded">
            <BadgeCheck className="w-4 h-4" /> Validé
          </span>
        );
      case 'refusé':
        return (
          <span className="inline-flex items-center gap-1 bg-red-100 text-red-800 text-xs font-semibold px-2 py-1 rounded">
            <XCircle className="w-4 h-4" /> Refusé
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <AppLayout>
      <Head title="Mes réservations" />
      <div className="p-6 space-y-6 max-w-5xl mx-auto">
        <h1 className="text-2xl font-semibold">Mes réservations</h1>

        {reservationsAvecDetails.length === 0 ? (
          <p className="text-gray-500">Vous n'avez encore réservé aucune activité.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {reservationsAvecDetails.map((res) => (
              <div key={res.id} className="bg-white rounded-xl shadow overflow-hidden">
                <img
                  src={res.image}
                  alt={res.title}
                  className="h-48 w-full object-cover"
                />
                <div className="p-4 space-y-2">
                  <h2 className="font-semibold text-lg">{res.title}</h2>
                  <p className="text-sm text-gray-600">{res.location}</p>
                  <p className="text-sm text-gray-500">Dates : {res.dates.join(', ')}</p>
                  <div className="space-y-2">

 <div className="flex flex-col space-y-2">
  {getStatusBadge(res.statut)}

  <Link
    href={`/profile/${res.host_user?.id}`}
    className="inline-block bg-blue-500 text-white text-sm px-4 py-2 rounded hover:bg-blue-600 transition"
  >
    Contacter l'organisateur
  </Link>
</div>

</div>

                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
