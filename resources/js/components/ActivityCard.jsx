import { Link } from '@inertiajs/react';

// Import automatique des images locales (fallback visuel si besoin)
const images = import.meta.glob('@/assets/images/*', { eager: true });
const resolveLocalImage = (name) => {
  if (!name) return null;
  const key = `/resources/js/assets/images/${name}`;
  return images[key]?.default ?? null;
};

export default function ActivityCard({ activity }) {
  // 🖼️ Détermination intelligente de la source de l’image
  const imageSrc =
    // 1️⃣ URL calculée par Laravel (accessor image_url)
    activity?.image_url
      ? activity.image_url
      // 2️⃣ Ancien chemin stocké directement (public/activities)
      : activity?.image?.startsWith('activities/')
      ? `/${activity.image}`
      // 3️⃣ Image importée localement (assets/images)
      : resolveLocalImage(activity.image)
      // 4️⃣ Fallback final
      ?? '/images/placeholder.jpg';

  return (
    <div className="bg-white rounded-xl shadow overflow-hidden">
      <img
        src={imageSrc}
        alt={activity.title}
        className="h-48 w-full object-cover"
        onError={(e) => (e.target.src = '/images/placeholder.jpg')} // sécurité
      />
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
              href={route('organisateur.profil', { id: activity.host_user.id })}
              className="text-blue-600 hover:underline"
            >
              {activity.host_user.name}
            </Link>
          </p>
        )}

        {/* 👇 Bouton redirection vers la page détail */}
        <Link
          href={route('activity.details', { id: activity.id })}
          className="block mt-2 text-center bg-[#247BA0] hover:bg-[#3498DB] text-white py-2 rounded text-sm transition"
        >
          En savoir plus
        </Link>
      </div>
    </div>
  );
}
