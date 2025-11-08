import AppLayout from '@/layouts/app-layout';
import { Head, usePage, Link } from '@inertiajs/react';
import { BadgeCheck, Clock, XCircle } from 'lucide-react';
import { resolveAssetImage } from '@/utils/resolveAssetImage';

export default function MyReservations() {
  const { reservations = [] } = usePage().props;

  const getStatusBadge = (status) => {
    switch (status) {
      case 'pending':
        return (
          <span className="inline-flex items-center gap-1 bg-yellow-100 text-yellow-800 text-xs font-semibold px-2 py-1 rounded">
            <Clock className="w-4 h-4" /> En attente
          </span>
        );
      case 'accepted':
        return (
          <span className="inline-flex items-center gap-1 bg-green-100 text-green-800 text-xs font-semibold px-2 py-1 rounded">
            <BadgeCheck className="w-4 h-4" /> Validé
          </span>
        );
      case 'rejected':
        return (
          <span className="inline-flex items-center gap-1 bg-red-100 text-red-800 text-xs font-semibold px-2 py-1 rounded">
            <XCircle className="w-4 h-4" /> Refusé
          </span>
        );
      default:
        return null;
    }
  };

 // 👇 NE PLUS TOMBER SUR /storage/** quand l'image est un asset
const pickImage = (res) => {
  // 1) D'abord : essayer les assets du front (resources/js/assets/**)
  const asset = resolveAssetImage(res.image);
  if (asset) return asset;

  // 2) Ensuite : une URL publique (CDN/externe)
  if (res.image && /^https?:\/\//i.test(res.image)) return res.image;

  // 3) Enfin : image stockée côté Laravel (si tu en utilises un jour)
  if (res.image_url) return res.image_url;

  // Pas d'image trouvée
  return null;
};


  return (
    <AppLayout>
      <Head title="Mes réservations" />
      <div className="p-6 space-y-6 max-w-5xl mx-auto">
        <h1 className="text-2xl font-semibold">Mes réservations</h1>

        {reservations.length === 0 ? (
          <p className="text-gray-500">Vous n'avez encore réservé aucune activité.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {reservations.map((res) => {
              const img = pickImage(res);
              const host = res.host_user || {};

              return (
                <div key={res.id} className="bg-white rounded-xl shadow overflow-hidden">
                  {img && (
                    <img
                      src={img}
                      alt={res.title}
                      className="h-48 w-full object-cover"
                    />
                  )}

                  <div className="p-4 space-y-2">
                    <h2 className="font-semibold text-lg">{res.title}</h2>

                    <p className="text-sm text-gray-600">
                      {res.location} {res.date ? `– ${res.date}` : ''}
                    </p>

                    {Array.isArray(res.dates) && res.dates.length > 0 && (
                      <p className="text-sm text-gray-500">
                        Dates : {res.dates.join(', ')}
                      </p>
                    )}

                    {res.requested_date && (
                      <p className="text-sm text-gray-500">
                        Date choisie : {res.requested_date}
                      </p>
                    )}

                    <div className="flex flex-col space-y-2 mt-2">
                      {getStatusBadge(res.status)}

                      {host?.id && (
                        <Link
                          href={typeof route === 'function'
                            ? route('messagerie.user.activity', [host.id, res.id])
                            : `/messagerie/${host.id}/${res.id}`
                          }
                          className="inline-block bg-blue-500 text-white text-sm px-4 py-2 rounded hover:bg-blue-600 transition"
                        >
                          Contacter l'organisateur
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
