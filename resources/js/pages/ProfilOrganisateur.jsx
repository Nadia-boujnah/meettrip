import AppLayout from '@/layouts/app-layout';
import { Head, Link, usePage, router } from '@inertiajs/react';
import { allActivities } from '@/data/activities';
import { allUsers } from '@/data/users';
import { useEffect } from 'react';

export default function ProfilOrganisateur() {
  // Je récupère les props envoyées par Inertia : id de l’organisateur et info de l’utilisateur connecté
  const { id, auth } = usePage().props;

  // Conversion en nombre (car parfois reçu en string)
  const organizerId = parseInt(id);

  // ID de l’utilisateur actuellement connecté
  const currentUserId = auth?.user?.id;

  // Si l’utilisateur n’est pas connecté, je le redirige automatiquement vers la page de login
  useEffect(() => {
    if (!auth || !auth.user) {
      router.visit('/login');
    }
  }, [auth]);

  // Je cherche les infos de l’organisateur dans la liste des utilisateurs (data en dur ici)
  const organizer = allUsers.find((user) => user.id === organizerId);

  // Je filtre les activités dont il est l’hôte
  const organizerActivities = allActivities.filter(
    (activity) => activity.host_user?.id === organizerId
  );

  // Si aucun organisateur trouvé, j’affiche un message neutre
  if (!organizer) {
    return (
      <AppLayout>
        <Head title="Profil" />
        <div className="text-center py-20 text-gray-500">Organisateur non trouvé.</div>
      </AppLayout>
    );
  }

  // Je vérifie si la personne qui consulte le profil est la même que celle du profil affiché
  const isOwner = currentUserId === organizerId;

  return (
    <AppLayout>
      {/* Titre dynamique de l’onglet */}
      <Head title={`Profil de ${organizer.prenom} ${organizer.nom}`} />

      <div className="max-w-5xl mx-auto px-6 py-8 space-y-10">

        {/* En-tête du profil */}
        <div className="relative bg-white p-6 rounded-xl shadow-md flex flex-col md:flex-row gap-6 items-center justify-between">
          
          {/* Si c’est mon profil, j’affiche le bouton de modification */}
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

          {/* Photo de profil de l’organisateur */}
          <img
            src={organizer.photo}
            alt={`${organizer.prenom} ${organizer.nom}`}
            className="w-32 h-32 rounded-full object-cover"
          />

          {/* Informations principales de l’organisateur */}
          <div className="flex-1 space-y-2">
            <p className="text-xl font-semibold">
              {organizer.prenom} {organizer.nom}{' '}
              <span className="text-sm bg-gray-100 text-gray-700 px-2 py-1 rounded ml-2">
                👤 Organisateur
              </span>
            </p>

            {/* Badge de vérification du compte */}
            {organizer.verifie && (
              <p className="text-sm text-green-600 font-medium">✔️ Compte vérifié</p>
            )}

            {/* Bio et localisation */}
            <p className="text-sm text-gray-600 whitespace-pre-line">{organizer.bio}</p>
            <p className="text-sm text-gray-500">{organizer.location}</p>
          </div>
        </div>

        {/* Section listant toutes les activités proposées par cet organisateur */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Activités proposées</h2>
          </div>

          {/* Grille d’activités : chaque carte contient les infos principales */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {organizerActivities.map((activity) => (
              <div
                key={activity.id}
                className="bg-white rounded-xl shadow hover:shadow-md transition overflow-hidden block"
              >
                {/* Image principale de l’activité */}
                <img
                  src={activity.image}
                  alt={activity.title}
                  className="w-full h-40 object-cover"
                />

                {/* Contenu de la carte (titre, lieu, date, description courte) */}
                <div className="p-4 space-y-2">
                  <h3 className="font-semibold text-lg">{activity.title}</h3>
                  <p className="text-sm text-gray-500">
                    {activity.location} – {activity.dates[0]}
                  </p>
                  <p className="text-sm text-gray-700">{activity.description}</p>

                  {/* Lien vers la page détaillée de l’activité */}
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
