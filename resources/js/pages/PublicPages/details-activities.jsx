import GuestLayout from '@/layouts/GuestLayout';
import { Link, usePage } from '@inertiajs/react';

// Import des images locales avec Vite (glob import)
const images = import.meta.glob('@/assets/images/*', { eager: true });
const resolveImg = (name) => {
  if (!name) return null;
  const key = `/resources/js/assets/images/${name}`;
  return images[key]?.default ?? null;
};

export default function DetailsActivity() {
  const { activity } = usePage().props;

  if (!activity) {
    return (
      <GuestLayout>
        <div className="text-center py-10 text-gray-500">
          Activité introuvable.
        </div>
      </GuestLayout>
    );
  }

  // Résolution de l'image
  const imageSrc = resolveImg(activity.image) || '/images/placeholder.jpg';

  return (
    <GuestLayout>
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Image principale */}
        <img
          src={imageSrc}
          alt={activity.title}
          className="w-full h-64 object-cover rounded-lg mb-8"
        />

        {/* Titre et infos principales */}
        <h1 className="text-3xl font-bold mb-2">{activity.title}</h1>
        <p className="text-gray-600 text-sm mb-2">{activity.location}</p>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
          <p className="text-sm text-gray-500">
            Organisé par{' '}
            {activity.host_user ? (
              <Link
                href={`/organisateur/${activity.host_user.id}`}
                className="font-medium text-[#247BA0] hover:underline"
              >
                {activity.host_user.name}
              </Link>
            ) : (
              <span className="italic">Utilisateur inconnu</span>
            )}
          </p>

          <p className="text-sm text-gray-500 mt-2 sm:mt-0">
            {activity.participants} participant
            {activity.participants > 1 ? 's' : ''}
          </p>
        </div>

        {/* Description */}
        <p className="text-gray-700 leading-relaxed mb-6">
          {activity.description}
        </p>

        {/* Pourquoi */}
        {activity.why && (
          <div className="bg-[#F5F5F5] p-4 rounded-md mb-8">
            <h2 className="text-lg font-semibold mb-2 text-[#1B1B18]">
              Pourquoi faire cette activité ?
            </h2>
            <p className="text-sm text-gray-700">{activity.why}</p>
          </div>
        )}

        {/* Dates disponibles */}
        {activity.dates && activity.dates.length > 0 && (
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-1 text-[#1B1B18]">
              Dates disponibles
            </h2>
            <ul className="list-disc list-inside text-sm text-gray-700">
              {activity.dates.map((date, index) => (
                <li key={index}>{date}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Bouton connexion */}
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
