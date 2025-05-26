import { Link } from '@inertiajs/react';

export default function ActivityCard({ activity, connected = false, user = null, onReserve }) {
  const isLoggedIn = !!user;

  return (
    <div className="bg-white rounded-xl shadow overflow-hidden">
      <img src={activity.image} alt={activity.title} className="h-48 w-full object-cover" />
      <div className="p-4 space-y-2">
        <p className="text-sm text-gray-500">
          {activity.participants} participant{activity.participants > 1 ? 's' : ''}
        </p>
        <h2 className="font-semibold text-lg">{activity.title}</h2>
        <p className="text-sm text-gray-600">{activity.location}</p>

        {activity.dates?.length > 0 && (
          <p className="text-sm text-gray-500">
            Prochaines dates : {activity.dates.join(', ')}
          </p>
        )}

        {activity.host_user && (
          <p className="text-sm text-gray-700">
            Organisé par{' '}
            <Link
              href={
                isLoggedIn
                  ? route('organisateur.profil', { id: activity.host_user.id })
                  : '/login'
              }
              className="text-blue-600 hover:underline"
            >
              {activity.host_user.name}
            </Link>
          </p>
        )}

        {/* 👇 Bouton voir plus vers DetailsActivityConnected */}
        <Link
          href={route('activity.details.connected', { id: activity.id })}
          className="block mt-2 text-center bg-blue-500 hover:bg-blue-600 text-white py-2 rounded text-sm transition"
        >
          Voir plus
        </Link>
      </div>
    </div>
  );
}
