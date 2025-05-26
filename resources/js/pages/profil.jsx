import AppLayout from '@/layouts/app-layout';
import { Head, Link } from '@inertiajs/react';
import nadia from '@/assets/images/nadia-voyage.png';
import { allActivities } from '@/data/activities';

export default function ProfilPublic() {
  const isOwner = true; // false si c’est un autre utilisateur
  const user = {
    nom: 'BOUJNAH',
    prenom: 'Nadia',
    photo: nadia,
    bio: `Passionnée de voyages et de nouvelles rencontres.
    J'aime découvrir de nouvelles spécialités et endroits.`,
    location: 'Cannes, France.',
    verifie: true,
  };

  const userActivities = allActivities.filter((a) => a.id === 10 || a.id === 11);

  return (
    <AppLayout>
      <Head title={`Profil de ${user.prenom} ${user.nom}`} />
      <div className="max-w-5xl mx-auto px-6 py-8 space-y-10">
        {/* Profil + bouton en haut à droite */}
        <div className="relative bg-white p-6 rounded-xl shadow-md flex flex-col md:flex-row gap-6 items-center justify-between">
          <div className="absolute top-4 right-4">
            {isOwner ? (
              <Link
                href="/profil/modifier"
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 text-sm"
              >
                Modifier mon profil
              </Link>
            ) : (
              <Link
                href="/messagerie"
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 text-sm"
              >
                Me contacter
              </Link>
            )}
          </div>

          <img
            src={user.photo}
            alt={`${user.prenom} ${user.nom}`}
            className="w-32 h-32 rounded-full object-cover"
          />
          <div className="flex-1 space-y-2">
            <p className="text-xl font-semibold">
              {user.prenom} {user.nom}{' '}
              <span className="text-sm bg-gray-100 text-gray-700 px-2 py-1 rounded ml-2">👤 Organisateur</span>
            </p>
            {user.verifie && (
              <p className="text-sm text-green-600 font-medium">✔️ Compte vérifié</p>
            )}
            <p className="text-sm text-gray-600 whitespace-pre-line">{user.bio}</p>
            <p className="text-sm text-gray-500">{user.location}</p>
          </div>
        </div>

        {/* Activités proposées redirigées vers /annonces */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Mes activités proposées</h2>
            <Link
              href="/annonces"
              className="text-sm text-blue-600 hover:underline"
            >
              Voir toutes les annonces →
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {userActivities.map((activity) => (
              <Link
                key={activity.id}
                href="/annonces"
                className="bg-white rounded-xl shadow hover:shadow-md transition overflow-hidden block"
              >
                <img
                  src={activity.image}
                  alt={activity.title}
                  className="w-full h-40 object-cover"
                />
                <div className="p-4 space-y-1">
                  <h3 className="font-semibold text-lg">{activity.title}</h3>
                  <p className="text-sm text-gray-500">
                    {activity.location} – {activity.dates[0]}
                  </p>
                  <p className="text-sm text-gray-700">{activity.description}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
