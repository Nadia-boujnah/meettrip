import GuestLayout from '@/Layouts/GuestLayout';
import { usePage } from '@inertiajs/react';
import { Link } from '@inertiajs/react';
import { allActivities } from '@/data/activities'; 

export default function DetailsActivity() {
  const { id } = usePage().props;
  const activity = allActivities.find((a) => a.id === parseInt(id));

  if (!activity) return <div className="text-center py-10 text-gray-500">Activité introuvable.</div>;

  return (
    <GuestLayout>
      <div className="max-w-4xl mx-auto px-4 py-12">
        <img
          src={activity.image}
          alt={activity.title}
          className="w-full h-64 object-cover rounded-lg mb-8"
        />

        <h1 className="text-3xl font-bold mb-2">{activity.title}</h1>
        <p className="text-gray-600 text-sm mb-2">{activity.location}</p>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
          <p className="text-sm text-gray-500">
  Organisé par{' '}
  <Link
    href={`/organisateur/${activity.host_user?.id}`}
    className="font-medium text-[#247BA0] hover:underline"
  >
    {activity.host_user?.name || activity.host}
  </Link>
</p>

          <p className="text-sm text-gray-500 mt-2 sm:mt-0">
            {activity.participants} participant{activity.participants > 1 ? 's' : ''}
          </p>
        </div>

        <p className="text-gray-700 leading-relaxed mb-6">{activity.description}</p>

        <div className="bg-[#F5F5F5] p-4 rounded-md mb-8">
          <h2 className="text-lg font-semibold mb-2 text-[#1B1B18]">Pourquoi faire cette activité ?</h2>
          <p className="text-sm text-gray-700">{activity.why}</p>
        </div>

{activity.dates && activity.dates.length > 0 && (
  <div className="mb-6">
    <h2 className="text-lg font-semibold mb-1 text-[#1B1B18]">Dates disponibles</h2>
    <ul className="list-disc list-inside text-sm text-gray-700">
      {activity.dates.map((date, index) => (
        <li key={index}>{date}</li>
      ))}
    </ul>
  </div>
)}

        <Link
          href="/login"
          className="inline-block bg-[#247BA0] hover:bg-[#3498DB] text-white font-semibold py-2 px-6 rounded-md transition"
        >
          Se connecter pour réserver
        </Link>
      </div>
    </GuestLayout>
  );
}
