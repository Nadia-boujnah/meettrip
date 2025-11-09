import AppLayout from '@/layouts/app-layout';
import { usePage, Link } from '@inertiajs/react';
import { useState } from 'react';
import { Calendar } from "@/components/ui/calendar";
import { format, isSameDay, startOfDay } from "date-fns";

export default function DetailsActivityConnected() {
  // Je récupère l’activité envoyée par le back via Inertia
  const { activity } = usePage().props;

  // États locaux :
  // - reserved : petit flag pour afficher un message de confirmation après clic
  // - selectedDate : la date choisie dans le calendrier
  // - showModal : contrôle l’ouverture/fermeture de la modale calendrier
  const [reserved, setReserved] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // Sécurité : si aucune activité, j’affiche un message simple
  if (!activity) {
    return <div className="p-8 text-center text-gray-500">Activité introuvable.</div>;
  }

  // Je transforme les dates "dd-MM-yyyy" en objets Date normalisés au début de journée
  // pour pouvoir comparer proprement avec isSameDay dans le calendrier.
  const allowedDates = (activity.dates || []).map((d) => {
    const [day, month, year] = d.split("-");
    return startOfDay(new Date(`${year}-${month}-${day}`));
  });

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto px-4 py-10 space-y-6">
        {/* Visuel principal de l’activité */}
        <img
          src={`/storage/${activity.image}`}
          alt={activity.title}
          className="w-full h-64 object-cover rounded-lg"
        />

        {/* Titre, lieu, description courte */}
        <h1 className="text-3xl font-bold">{activity.title}</h1>
        <p className="text-gray-600">{activity.location}</p>
        <p className="text-gray-700 mt-4">{activity.description}</p>

        {/* Bloc “Pourquoi” pour donner du contexte à l’utilisateur */}
        <div className="bg-gray-100 p-4 rounded-md mt-6">
          <h2 className="text-lg font-semibold">Pourquoi faire cette activité ?</h2>
          <p className="text-gray-700">{activity.why}</p>
        </div>

        {/* Liste des dates disponibles en clair (complément d’information) */}
        {activity.dates?.length > 0 && (
          <div className="bg-gray-100 p-4 rounded-md">
            <h2 className="text-lg font-semibold mb-2">Dates disponibles</h2>
            <ul className="list-disc pl-5 text-gray-700">
              {activity.dates.map((date, i) => (
                <li key={i}>{date}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Modale avec calendrier : je la monte uniquement quand showModal = true */}
        {showModal && (
          <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
              <h3 className="text-lg font-bold mb-4">Choisissez une date</h3>

              {/* Calendrier en sélection simple :
                  - defaultMonth : j’ouvre sur la première date disponible
                  - disabled : toutes les dates sont désactivées sauf celles présentes dans allowedDates
              */}
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                className="rounded-md border"
                defaultMonth={allowedDates[0]}
                disabled={(date) =>
                  !allowedDates.some((allowedDate) => isSameDay(allowedDate, date))
                }
              />

              {/* Bouton de réservation : je confirme et je ferme la modale.
                 Je déclenche aussi un petit indicateur “reserved” pendant 4s. */}
              <button
                onClick={() => {
                  setReserved(true);
                  setShowModal(false);
                  setTimeout(() => setReserved(false), 4000);
                }}
                disabled={!selectedDate}
                className="w-full bg-green-600 hover:bg-green-700 text-white py-2 mt-4 rounded disabled:opacity-50"
              >
                {selectedDate
                  ? `Réserver pour le ${format(selectedDate, "dd-MM-yyyy")}`
                  : "Réserver"}
              </button>

              {/* Fermeture manuelle de la modale */}
              <button
                onClick={() => setShowModal(false)}
                className="mt-3 w-full text-sm text-gray-500 hover:underline"
              >
                Annuler
              </button>
            </div>
          </div>
        )}

        {/* Message de confirmation éphémère après action */}
        {reserved && (
          <div className="mt-4 bg-green-100 text-black-800 px-4 py-3 rounded">
            Réservation confirmée 🎉
          </div>
        )}

        {/* Informations sur l’organisateur + lien vers messagerie */}
        <div className="border rounded-lg p-4 bg-gray-50 shadow-sm mt-10">
          <p className="text-sm text-gray-700">
            <span className="font-medium text-gray-900">Organisé par :</span>{' '}
            {activity.host_user ? (
              <Link
                href={route('organisateur.profil', { id: activity.host_user.id })}
                className="text-blue-600 hover:underline"
              >
                {activity.host_user.prenom} {activity.host_user.nom}
              </Link>
            ) : (
              <span className="text-gray-500">Organisateur inconnu</span>
            )}
          </p>

          <Link
            href={`/messages/new?activite=${encodeURIComponent(activity.title)}&organisateur=${activity.host_user?.id}`}
            className="block mt-2 text-sm text-blue-500 hover:underline"
          >
            Envoyer un message
          </Link>
        </div>

        {/* CTA principal pour ouvrir le calendrier et choisir un créneau */}
        <button
          onClick={() => setShowModal(true)}
          className="bg-black hover:bg-gray-800 text-white py-2 px-4 rounded mt-4"
        >
          Réserver un créneau
        </button>
      </div>
    </AppLayout>
  );
}
