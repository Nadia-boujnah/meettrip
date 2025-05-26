import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { allActivities } from '@/data/activities';
import L from 'leaflet';
import { Link } from '@inertiajs/react';
import markerIconPng from 'leaflet/dist/images/marker-icon.png';
import AppLayout from '@/layouts/app-layout';
import { useState } from 'react';

export default function MapConnected() {
  const center = [48.8566, 2.3522]; 
  const [search, setSearch] = useState('');

  const filteredActivities = allActivities.filter((a) =>
    a.title.toLowerCase().includes(search.toLowerCase()) ||
    a.location.toLowerCase().includes(search.toLowerCase()) ||
    a.host_user.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AppLayout>
      {/* Section titre + recherche */}
      <div className="py-8 px-4 flex flex-col items-center space-y-4">
        <h1 className="text-3xl font-bold text-gray-800 text-center">
          Carte des activités
        </h1>

        {/* Barre de recherche avec icône loupe */}
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

      {/* Carte */}
      <div className="h-[calc(100vh-220px)] w-full px-4 pb-4">
        <MapContainer
          center={center}
          zoom={2.5}
          scrollWheelZoom={true}
          className="h-full w-full z-0 rounded-lg overflow-hidden shadow"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png"
          />

          {filteredActivities.map((activity) => (
            <Marker
              key={activity.id}
              position={activity.coordinates}
              icon={L.icon({
                iconUrl: markerIconPng,
                iconSize: [25, 41],
                iconAnchor: [12, 41],
              })}
            >
              <Popup>
                <div className="text-sm space-y-1">
                  <strong>{activity.title}</strong>
                  <p>{activity.location}</p>
                  <Link
                    href={`/activities/${activity.id}/connected`}
                    className="text-blue-600 underline"
                  >
                    Voir l’activité →
                  </Link>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </AppLayout>
  );
}
