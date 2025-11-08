import { useState } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import markerIconPng from 'leaflet/dist/images/marker-icon.png';

const icon = L.icon({ iconUrl: markerIconPng, iconSize: [25,41], iconAnchor: [12,41] });

function ClickHandler({ onPick }) {
  useMapEvents({
    click(e) { onPick([e.latlng.lat, e.latlng.lng]); },
  });
  return null;
}

/**
 * props:
 *  - value: [lat, lng] initiale ou null
 *  - onChange: ({lat,lng}) => void
 */
export default function LocationPicker({ value, onChange }) {
  const [pos, setPos] = useState(value ?? [48.8566, 2.3522]); // Paris par défaut
  const [hasMarker, setHasMarker] = useState(!!value);

  const handlePick = (coords) => {
    setPos(coords);
    setHasMarker(true);
    onChange({ lat: coords[0], lng: coords[1] });
  };

  return (
    <div className="h-72 rounded overflow-hidden border">
      <MapContainer center={pos} zoom={value ? 10 : 3} className="h-full w-full" scrollWheelZoom>
        <TileLayer
          attribution='&copy; OpenStreetMap contributors'
          url="https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png"
        />
        <ClickHandler onPick={handlePick} />
        {hasMarker && <Marker position={pos} icon={icon} />}
      </MapContainer>
      <div className="p-2 text-sm text-gray-600">
        Clique sur la carte pour placer le marqueur (lat/lng remplis automatiquement).
      </div>
    </div>
  );
}
