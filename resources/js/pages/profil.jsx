import AppLayout from '@/layouts/app-layout';
import { Head, Link, usePage } from '@inertiajs/react';

const pickActivityImage = (a) => {
  if (a?.image_url && /^https?:\/\//i.test(a.image_url)) return a.image_url;
  if (a?.image) return `/storage/${a.image}`;
  return '/images/placeholder-activity.jpg';
};

const pickAvatar = (u) => u?.photo || '/images/default-avatar.png';

export default function ProfilPublic() {
  const { props } = usePage();
  const {
    user = null,
    activities = [],
    isOwner = false,
    activities_count = activities.length ?? 0,
  } = props;

  if (!user) {
    return (
      <AppLayout>
        <Head title="Profil" />
        <div className="max-w-5xl mx-auto px-6 py-12 text-center text-gray-500">
          Chargement du profil…
        </div>
      </AppLayout>
    );
  }

  const avatar = pickAvatar(user);

  return (
    <AppLayout>
      <Head title={`Profil de ${user?.prenom ?? ''} ${user?.nom ?? ''}`} />
      <div className="max-w-5xl mx-auto px-6 py-8 space-y-10">

        {/* Header profil */}
        <div className="relative bg-white p-6 rounded-xl shadow-md flex flex-col md:flex-row gap-6 items-center md:items-start">
          {/* Bouton à droite : seulement pour la propriétaire */}
          {isOwner && (
            <div className="absolute top-4 right-4">
              <Link
                href={route('profile.edit')}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 text-sm"
              >
                Modifier mon profil
              </Link>
            </div>
          )}

          <img
            src={avatar}
            alt={`${user?.prenom ?? ''} ${user?.nom ?? ''}`}
            className="w-28 h-28 rounded-full object-cover ring-2 ring-gray-100"
          />

          <div className="flex-1 space-y-2 md:pt-1">
            <div className="flex flex-wrap items-center gap-2">
              <p className="text-xl font-semibold">
                {user?.prenom} {user?.nom}
              </p>
              <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                👤 {user?.role === 'organisateur' ? 'Organisateur' : 'Utilisateur'}
              </span>
              {user?.verifie && (
                <span className="text-xs text-green-700 bg-green-50 border border-green-200 px-2 py-1 rounded">
                  ✔️ Compte vérifié
                </span>
              )}
            </div>

            {user?.location && <p className="text-sm text-gray-500">📍 {user.location}</p>}
            {user?.bio && <p className="text-sm text-gray-700 whitespace-pre-line">{user.bio}</p>}

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <span className="text-xs text-gray-600 bg-gray-50 px-2 py-1 rounded">
                {activities_count} activité{activities_count > 1 ? 's' : ''}
              </span>

              {isOwner && user?.document && (
                <a
                  href={user.document}
                  target="_blank"
                  className="text-xs text-blue-600 underline"
                >
                  Voir ma pièce d’identité
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Activités proposées */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Mes activités proposées</h2>
            <Link href="/annonces" className="text-sm text-blue-600 hover:underline">
              Voir toutes les annonces →
            </Link>
          </div>

          {activities.length === 0 ? (
            <div className="text-gray-500 text-sm">Aucune activité publiée pour le moment.</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {activities.map((a) => (
                <Link
                  key={a.id}
                  href={`/activities/${a.id}`}
                  className="bg-white rounded-xl shadow hover:shadow-md transition overflow-hidden block"
                >
                  <img
                    src={pickActivityImage(a)}
                    alt={a.title}
                    className="w-full h-40 object-cover"
                  />
                  <div className="p-4 space-y-1">
                    <h3 className="font-semibold text-lg">{a.title}</h3>
                    <p className="text-sm text-gray-500">
                      {a.location}{a.dates?.length ? ` – ${a.dates[0]}` : ''}
                    </p>
                    {a.description && (
                      <p className="text-sm text-gray-700 line-clamp-2">{a.description}</p>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
