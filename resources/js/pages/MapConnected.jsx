import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { allActivities } from '@/data/activities';   // ancienne source de données en dur, gardée en secours
import L from 'leaflet';
import { Link, usePage } from '@inertiajs/react';
import markerIconPng from 'leaflet/dist/images/marker-icon.png';
import AppLayout from '@/layouts/app-layout';
import { useMemo, useState } from 'react';

export default function MapConnected() {
  // Coordonnées par défaut centrées sur Paris
  const center = [48.8566, 2.3522]; 

  // Recherche dynamique dans la carte
  const [search, setSearch] = useState('');

  // Je récupère les données réelles envoyées par Laravel via Inertia
  const { mapActivities = [] } = usePage().props;

  /**
   * Je prépare la liste des points à afficher sur la carte :
   * - Si le back a fourni des activités avec latitude/longitude, je les utilise.
   * - Sinon, je retombe sur mes anciennes données en dur (allActivities)
   *   pour éviter que la carte soit vide.
   */
  const points = useMemo(() => {
    if (Array.isArray(mapActivities) && mapActivities.length > 0) {
      return mapActivities.map(a => ({
        id: a.id,
        title: a.title,
        location: a.location,
        lat: typeof a.lat === 'number' ? a.lat : (typeof a.latitude === 'number' ? a.latitude : null),
        lng: typeof a.lng === 'number' ? a.lng : (typeof a.longitude === 'number' ? a.longitude : null),
        image_url: a.image_url ?? null,
      }));
    }

    // Si aucune donnée du back, je convertis les anciennes coordonnées [lat, lng]
    return allActivities.map(a => ({
      id: a.id,
      title: a.title,
      location: a.location,
      lat: Array.isArray(a.coordinates) ? a.coordinates[0] : null,
      lng: Array.isArray(a.coordinates) ? a.coordinates[1] : null,
      image_url: null,
      host_user: a.host_user,
    }));
  }, [mapActivities]);

  /**
   * Je filtre les activités affichées sur la carte
   * selon le mot-clé saisi (titre, lieu ou nom de l’organisateur)
   */
  const filteredActivities = useMemo(() => {
    const q = search.toLowerCase().trim();
    return points.filter((a) => {
      const inTitle = (a.title || '').toLowerCase().includes(q);
      const inLoc   = (a.location || '').toLowerCase().includes(q);
      const inHost  = (a.host_user?.name || '').toLowerCase().includes(q);
      return inTitle || inLoc || inHost;
    });
  }, [points, search]);

  return (
    <AppLayout>
      {/* Titre et barre de recherche */}
      <div className="py-8 px-4 flex flex-col items-center space-y-4">
        <h1 className="text-3xl font-bold text-gray-800 text-center">
          Carte des activités
        </h1>

        {/* Barre de recherche filtrant les marqueurs */}
        <div className="relative w-full max-w-md">
          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg">🔍</span>
          <input
            type="text"
            placeholder="Rechercher une activité, ville ou organisateur..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>
      </div>

      {/* Conteneur de la carte Leaflet */}
      <div className="h-[calc(100vh-220px)] w-full px-4 pb-4">
        <MapContainer
          center={center}
          zoom={2.5}
          scrollWheelZoom={true}
          className="h-full w-full z-0 rounded-lg overflow-hidden shadow"
        >
          {/* J’utilise les tuiles OpenStreetMap (thème “humanitarian”) */}
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png"
          />

          {/* Je parcours toutes les activités filtrées pour afficher un marqueur par activité */}
          {filteredActivities.map((activity) => {
            const lat = activity.lat;
            const lng = activity.lng;
            // Je vérifie que les coordonnées sont bien valides
            if (typeof lat !== 'number' || typeof lng !== 'number') return null;

            return (
              <Marker
                key={activity.id}
                position={[lat, lng]}
                icon={L.icon({
                  iconUrl: markerIconPng,
                  iconSize: [25, 41],
                  iconAnchor: [12, 41],
                })}
              >
                {/* Popup qui s’ouvre quand on clique sur le marqueur */}
                <Popup>
                  <div className="text-sm space-y-1">
                    <strong>{activity.title}</strong>
                    <p>{activity.location}</p>

                    {/* Si une image est disponible, je l’affiche dans la popup */}
                    {activity.image_url && (
                      <img
                        src={activity.image_url}
                        alt={activity.title}
                        className="rounded w-48 h-28 object-cover"
                      />
                    )}

                    {/* Lien pour accéder à la fiche détaillée de l’activité */}
                    <Link
                      href={`/activities/${activity.id}/connected`}
                      className="text-blue-600 underline"
                    >
                      Voir l’activité →
                    </Link>
                  </div>
                </Popup>
              </Marker>
            );
          })}
        </MapContainer>
      </div>
    </AppLayout>
  );
}
