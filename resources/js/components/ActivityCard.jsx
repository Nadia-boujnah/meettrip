import { Link } from '@inertiajs/react';

export default function ActivityCard({ activity }) {
  // Si l’item est vide ou pas un objet, je ne rends rien
  if (!activity || typeof activity !== 'object') return null;
  const a = activity;

  // Champs sûrs
  const title     = typeof a.title === 'string' ? a.title : 'Sans titre';
  const location  = typeof a.location === 'string' ? a.location : '—';
  const id        = (typeof a.id === 'number' || typeof a.id === 'string') ? a.id : null;
  const hostId    = (a?.host_user && (typeof a.host_user.id === 'number' || typeof a.host_user.id === 'string')) ? a.host_user.id : null;
  const hostFirst = typeof a?.host_user?.prenom === 'string' ? a.host_user.prenom : (typeof a?.host_user?.name === 'string' ? a.host_user.name : '');
  const hostLast  = typeof a?.host_user?.nom === 'string' ? a.host_user.nom : '';
  const hostLabel = (hostFirst + ' ' + hostLast).trim() || 'Organisateur';

  // Participants
  const nbRaw = Number(a?.participants);
  const participants = Number.isFinite(nbRaw) ? nbRaw : 0;

  // Dates (affiche seulement si tableau non vide)
  const dates = Array.isArray(a?.dates) ? a.dates : [];
  const hasDates = dates.length > 0;

  // Image (je garde ça simple et zéro risque)
  let imageSrc = null;
  if (typeof a?.image_url === 'string' && a.image_url.trim() !== '') {
    imageSrc = a.image_url; // URL complète calculée côté back
  } else if (typeof a?.image === 'string' && a.image.trim() !== '') {
    // Chemins classiques
    if (a.image.startsWith('/')) {
      imageSrc = a.image; // déjà absolu
    } else if (a.image.startsWith('activities/')) {
      imageSrc = `/storage/${a.image}`; // stockage Laravel
    }
  }
  const onImgError = (e) => { e.currentTarget.remove(); }; // si ça casse, on retire l’image

  // Liens (aucun usage de Ziggy/route ici)
  const detailsHref    = id     ? `/activities/${id}`         : null;
  const organizerHref  = hostId ? `/organisateur/${hostId}`   : null;

  return (
    <div className="bg-white rounded-xl shadow overflow-hidden">
      {imageSrc && (
        <img
          src={imageSrc}
          alt={title}
          className="h-48 w-full object-cover"
          onError={onImgError}
        />
      )}

      <div className="p-4 space-y-2">
        <p className="text-sm text-gray-500">
          {participants} participant{participants > 1 ? 's' : ''}
        </p>

        <h2 className="font-semibold text-lg">{title}</h2>
        <p className="text-sm text-gray-600">{location}</p>

        {hasDates && (
          <p className="text-sm text-gray-500">
            Prochaines dates : {dates.join(', ')}
          </p>
        )}

        {a?.host_user && (
          <p className="text-sm text-gray-700">
            Organisé par{' '}
            {organizerHref ? (
              <Link href={organizerHref} className="text-blue-600 hover:underline">
                {hostLabel}
              </Link>
            ) : (
              <span className="opacity-70">{hostLabel}</span>
            )}
          </p>
        )}

        {detailsHref ? (
          <Link
            href={detailsHref}
            className="block mt-2 text-center bg-[#247BA0] hover:bg-[#3498DB] text-white py-2 rounded text-sm transition"
          >
            En savoir plus
          </Link>
        ) : (
          <span className="block mt-2 text-center bg-gray-300 text-white py-2 rounded text-sm opacity-60 cursor-not-allowed">
            En savoir plus
          </span>
        )}
      </div>
    </div>
  );
}
