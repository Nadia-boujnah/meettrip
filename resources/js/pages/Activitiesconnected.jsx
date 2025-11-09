import AppLayout from '@/layouts/app-layout';
import { Head, usePage, Link } from '@inertiajs/react';
import { useState } from 'react';
import ReservationModal from '@/components/ReservationModal';
import { resolveAssetImage } from '@/utils/resolveAssetImage';

/**
 * getActivityImage
 *  Mon helper d'affichage d'image d'activité.
 *  1) Je privilégie une URL absolue fournie par le back (image_url).
 *  2) Sinon, si j'ai un chemin "storage" (ex: activities/xxx.jpg), je reconstruis l'URL publique.
 *  3) Sinon, j'essaie de résoudre une image packagée côté front (Vite) via resolveAssetImage.
 *  4) En dernier recours, j'affiche un placeholder propre.
 *    Objectif : éviter les images cassées et gérer toutes les sources (CDN, storage Laravel, assets du front).
 */
function getActivityImage(a) {

  // Cas 1 : le back m'envoie une URL complète (CDN / http)
  if (a?.image_url) return a.image_url;

  // Cas 2 : le back m'envoie juste un chemin dans /storage (ex: activities/...)
  if (a?.image && a.image.startsWith('activities/')) {
    return `/storage/${a.image}`;
  }

  // Cas 3 : j'essaie de résoudre un asset packagé (si la fonction est dispo)
  const try1 = typeof resolveAssetImage === 'function' ? resolveAssetImage(a?.image) : null;
  if (try1) return try1;
  const try2 = typeof resolveAssetImage === 'function' ? resolveAssetImage(`images/${a?.image}`) : null;
  if (try2) return try2;

  // Cas 4 : fallback si je n'ai rien de valide
  return '/images/placeholder.png';
}

export default function Activitiesconnected() {
  // Je récupère les props envoyées par Inertia (auth + liste des activités)
  const { auth = {}, activities = [] } = usePage().props;
  const user = auth.user; // Potentiellement utile si je veux adapter l'UI à l'utilisateur connecté

  // --- États locaux de ma page ---
  const [search, setSearch] = useState('');                 // ma recherche par titre/lieu
  const [currentPage, setCurrentPage] = useState(1);        // la page courante pour la pagination
  const [selectedActivity, setSelectedActivity] = useState(null); // l'activité sélectionnée pour réserver
  const [showCalendar, setShowCalendar] = useState(false);  // je contrôle l'ouverture du modal calendrier

  // J'affiche 3 activités par page (choix volontaire pour l'oral : lisible en démo)
  const activitiesPerPage = 3;

  /**
   * filteredActivities
   *  Je filtre côté front par "titre" et "location".
   *  Remarque : côté prod, je pourrais déporter ce filtre au back pour les grosses listes.
   */
  const filteredActivities = activities.filter((activity) =>
    (activity.title || '').toLowerCase().includes(search.toLowerCase()) ||
    (activity.location || '').toLowerCase().includes(search.toLowerCase())
  );

  // Calcul pagination (nb total de pages, début de tranche, tranche affichée)
  const totalPages = Math.ceil(filteredActivities.length / activitiesPerPage) || 1;
  const startIndex = (currentPage - 1) * activitiesPerPage;
  const paginatedActivities = filteredActivities.slice(startIndex, startIndex + activitiesPerPage);

  // Navigation simple entre pages (je borne entre 1 et totalPages)
  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  // Au clic sur "Réserver", j'ouvre le modal avec l'activité sélectionnée
  const handleReservation = (activity) => {
    setSelectedActivity(activity);
    setShowCalendar(true);
  };

  return (
    <AppLayout>
      {/* Je définis le <title> de la page pour l'accessibilité/SEO */}
      <Head title="Activités" />

      <div className="p-6 space-y-6 max-w-7xl mx-auto">
        <h1 className="text-2xl font-semibold">Toutes les Activités</h1>

        {/* Barre de recherche et futurs filtres (placeholder pour itérations à venir) */}
        <div className="flex flex-col sm:flex-row gap-4">
          <input
            type="text"
            placeholder="Rechercher une activité..."
            value={search}
            onChange={(e) => {
              // Je mets à jour le terme de recherche et je reviens en page 1
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full sm:w-1/3 border border-gray-300 rounded-md px-4 py-2"
          />
          {/* Sélecteurs de filtres (hookés plus tard sur des vraies valeurs) */}
          <select className="w-full sm:w-auto border border-gray-300 rounded-md px-4 py-2">
            <option>Pays</option>
          </select>
          <select className="w-full sm:w-auto border border-gray-300 rounded-md px-4 py-2">
            <option>Type d'activité</option>
          </select>
        </div>

        {/* Grille responsive d'activités (cards) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {paginatedActivities.map((activity) => {
            // Je centralise la logique d'image pour éviter les erreurs d'affichage
            const img = getActivityImage(activity);

            // Je prépare l'affichage "Organisé par ..."
            const hostFirst = activity?.host_user?.prenom || activity?.host_user?.name || '';
            const hostLast = activity?.host_user?.nom || '';
            const hostId = activity?.host_user?.id;

            return (
              <div
                key={activity.id}
                className="bg-white rounded shadow overflow-hidden flex flex-col justify-between"
              >
                {/* Visuel de l'activité (lazy pour les perfs) */}
                {img && (
                  <img
                    src={img}
                    alt={activity.title}
                    className="w-full h-48 object-cover rounded-t"
                    loading="lazy"
                  />
                )}

                <div className="p-4 flex flex-col justify-between h-full">
                  <div>
                    {/* Titre + lieu + date si dispo */}
                    <h2 className="font-semibold text-lg">{activity.title}</h2>
                    <p className="text-sm text-gray-600">
                      {activity.location} {activity.date ? `– ${activity.date}` : ''}
                    </p>

                    {/* Petite description courte */}
                    <p className="text-sm mt-1">{activity.description}</p>

                    {/* Nombre de participants si dispo (j'ajoute le "s" en français si > 1) */}
                    {typeof activity.participants !== 'undefined' && (
                      <p className="text-sm text-gray-600 mt-2">
                        <span className="font-medium">{activity.participants}</span>{' '}
                        participant{activity.participants > 1 ? 's' : ''}
                      </p>
                    )}
                  </div>

                  {/* Lien direct vers la messagerie avec l'organisateur pour poser des questions */}
                  {(hostFirst || hostLast) && hostId && (
                    <p className="text-sm text-gray-500 mt-4">
                      Organisé par{' '}
                      <Link
                        href={typeof route === 'function'
                          ? route('messagerie.user.activity', [hostId, activity.id])
                          : `/messagerie/${hostId}/${activity.id}`
                        }
                        className="font-medium text-blue-600 hover:underline"
                      >
                        {hostFirst} {hostLast}
                      </Link>
                    </p>
                  )}

                  {/* CTA : j'ouvre le calendrier de réservation avec l'activité courante */}
                  <button
                    onClick={() => handleReservation(activity)}
                    className="mt-4 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded text-sm"
                  >
                    Réserver
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Pagination simple, accessible, et bornée */}
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

      {/* Montage du modal : je ne l'insère dans le DOM que si j'ai une activité sélectionnée */}
      {showCalendar && selectedActivity && (
        <ReservationModal
          visible={true}              // je force l'affichage quand l'état local le dit
          activity={selectedActivity} // je passe toutes les infos de l'activité choisie
          onClose={() => {
            // Au close, je nettoie l'état pour éviter des résidus de sélection
            setShowCalendar(false);
            setSelectedActivity(null);
          }}
        />
      )}
    </AppLayout>
  );
}
