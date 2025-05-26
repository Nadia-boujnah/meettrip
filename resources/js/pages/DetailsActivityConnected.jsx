import AppLayout from '@/layouts/app-layout';
import { usePage, Link } from '@inertiajs/react';
import { useState } from 'react';
import { allActivities } from '@/data/activities';
import { allUsers } from '@/data/users'; 
import { Calendar } from "@/components/ui/calendar";
import { format, isSameDay, startOfDay } from "date-fns";

export default function DetailsActivityConnected() {
  const { id } = usePage().props;
  const activity = allActivities.find((a) => a.id === parseInt(id));

  const [reserved, setReserved] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [showModal, setShowModal] = useState(false);

  if (!activity) {
    return <div className="p-8 text-center text-gray-500">Activité introuvable.</div>;
  }

  const allowedDates = (activity.dates || []).map((d) => {
    const [day, month, year] = d.split("-");
    return startOfDay(new Date(`${year}-${month}-${day}`));
  });

  const organizer = allUsers.find((u) => u.id === activity.host_user?.id);

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto px-4 py-10 space-y-6">
        <img
          src={activity.image}
          alt={activity.title}
          className="w-full h-64 object-cover rounded-lg"
        />

        <h1 className="text-3xl font-bold">{activity.title}</h1>
        <p className="text-gray-600">{activity.location}</p>
        <p className="text-gray-700 mt-4">{activity.description}</p>

        <div className="bg-gray-100 p-4 rounded-md mt-6">
          <h2 className="text-lg font-semibold">Pourquoi faire cette activité ?</h2>
          <p className="text-gray-700">{activity.why}</p>
        </div>

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

        {/* ✅ Modale calendrier */}
        {showModal && (
          <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
              <h3 className="text-lg font-bold mb-4">Choisissez une date</h3>
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

              <button
                onClick={() => setShowModal(false)}
                className="mt-3 w-full text-sm text-gray-500 hover:underline"
              >
                Annuler
              </button>
            </div>
          </div>
        )}

        {reserved && (
          <div className="mt-4 bg-green-100 text-black-800 px-4 py-3 rounded">
            Réservation confirmée 🎉
          </div>
        )}

        {/* ✅ Info organisateur */}
        <div className="border rounded-lg p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between bg-gray-50 shadow-sm mt-10">
          <p className="text-sm text-gray-700">
            <span className="font-medium text-gray-900">Organisé par :</span>{' '}
            {organizer ? (
              <Link
                href={route('organisateur.profil', { id: organizer.id })}
                className="text-blue-600 hover:underline"
              >
                {organizer.prenom} {organizer.nom}
              </Link>
            ) : (
              <span className="text-gray-500">Organisateur inconnu</span>
            )}
          </p>

        <Link
  href={`/messages/new?activite=${encodeURIComponent(activity.title)}&organisateur=${activity.host_user.id}`}
>
  Envoyer un message
</Link>



        </div>

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
