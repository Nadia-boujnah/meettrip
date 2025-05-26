import AppLayout from '@/layouts/app-layout';
import { Head, Link, usePage, router } from '@inertiajs/react';
import { allActivities } from '@/data/activities';
import { allUsers } from '@/data/users';
import { useEffect } from 'react';

export default function ProfilOrganisateur() {
  const { id, auth } = usePage().props;
  const organizerId = parseInt(id);
  const currentUserId = auth?.user?.id;

  // Redirection si non co
  useEffect(() => {
    if (!auth || !auth.user) {
      router.visit('/login');
    }
  }, [auth]);

  const organizer = allUsers.find((user) => user.id === organizerId);
  const organizerActivities = allActivities.filter(
    (activity) => activity.host_user?.id === organizerId
  );

  if (!organizer) {
    return (
      <AppLayout>
        <Head title="Profil" />
        <div className="text-center py-20 text-gray-500">Organisateur non trouvé.</div>
      </AppLayout>
    );
  }

  const isOwner = currentUserId === organizerId;

  return (
    <AppLayout>
      <Head title={`Profil de ${organizer.prenom} ${organizer.nom}`} />
      <div className="max-w-5xl mx-auto px-6 py-8 space-y-10">
        <div className="relative bg-white p-6 rounded-xl shadow-md flex flex-col md:flex-row gap-6 items-center justify-between">
          {isOwner && (
            <div className="absolute top-4 right-4">
              <Link
                href="/profil/modifier"
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 text-sm"
              >
                Modifier mon profil
              </Link>
            </div>
          )}

          <img
            src={organizer.photo}
            alt={`${organizer.prenom} ${organizer.nom}`}
            className="w-32 h-32 rounded-full object-cover"
          />
          <div className="flex-1 space-y-2">
            <p className="text-xl font-semibold">
              {organizer.prenom} {organizer.nom}{' '}
              <span className="text-sm bg-gray-100 text-gray-700 px-2 py-1 rounded ml-2">👤 Organisateur</span>
            </p>
            {organizer.verifie && (
              <p className="text-sm text-green-600 font-medium">✔️ Compte vérifié</p>
            )}
            <p className="text-sm text-gray-600 whitespace-pre-line">{organizer.bio}</p>
            <p className="text-sm text-gray-500">{organizer.location}</p>
          </div>
        </div>

        {/* Activités proposées */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Activités proposées</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
  {organizerActivities.map((activity) => (
    <div
      key={activity.id}
      className="bg-white rounded-xl shadow hover:shadow-md transition overflow-hidden block"
    >
      <img
        src={activity.image}
        alt={activity.title}
        className="w-full h-40 object-cover"
      />
      <div className="p-4 space-y-2">
        <h3 className="font-semibold text-lg">{activity.title}</h3>
        <p className="text-sm text-gray-500">
          {activity.location} – {activity.dates[0]}
        </p>
        <p className="text-sm text-gray-700">{activity.description}</p>

        <Link
  href={`/activities/${activity.id}/connected`}
  className="inline-block mt-3 bg-blue-600 text-white text-sm px-4 py-2 rounded hover:bg-blue-700 transition"
>
  En savoir plus
</Link>
      </div>
    </div>
  ))}


          </div>
        </div>
      </div>
    </AppLayout>
  );
}
