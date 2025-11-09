// resources/js/Pages/MyReservations.jsx
import AppLayout from '@/layouts/app-layout';
import { Head, usePage } from '@inertiajs/react';

/**
 * activityImage
 * Mon petit helper pour afficher la bonne image d’une réservation.
 *    - Si le back m’envoie une URL complète (image_url), je l’utilise directement.
 *    - Sinon, si j’ai un chemin storage de Laravel (activities/xxx.jpg), je reconstruis l’URL publique.
 *    - Sinon, je tombe sur un placeholder propre pour éviter une image cassée.
 *    Objectif : couvrir les différentes sources d’images (CDN, storage, fallback).
 */
function activityImage(activity) {
  if (activity?.image_url) return activity.image_url;
  if (activity?.image?.startsWith('activities/')) return `/storage/${activity.image}`;
  return '/images/placeholder.png';
}

/**
 * StatusBadge
 * Un composant visuel très simple qui traduit un statut technique en badge lisible.
 *    - Je mappe les 3 statuts possibles vers un libellé FR + des couleurs Tailwind.
 *    - accepted  => “Validé” (vert)
 *    - pending   => “En attente” (ambre)
 *    - declined  => “Refusé” (rose)
 *    - Si je reçois autre chose ou rien, je n’affiche pas de badge.
 */
function StatusBadge({ status }) {
  if (!status) return null;

  const map = {
    accepted: { text: 'Validé',    className: 'bg-emerald-100 text-emerald-800' },
    pending:  { text: 'En attente', className: 'bg-amber-100 text-amber-800' },
    declined: { text: 'Refusé',    className: 'bg-rose-100 text-rose-800' },
  };

  const data = map[status] || null;
  if (!data) return null;

  return (
    <div className={`mt-2 text-sm px-3 py-1 rounded ${data.className}`}>
      {data.text}
    </div>
  );
}

export default function MyReservations() {
  // Je récupère la liste de MES réservations que le back m’envoie via Inertia.
  // Par défaut, je garde un tableau vide pour éviter les crash si rien n’est passé.
  const { reservations = [] } = usePage().props;

  return (
    <AppLayout>
      {/* Je règle le <title> de la page (accessibilité + SEO) */}
      <Head title="Mes réservations" />

      <div className="max-w-6xl mx-auto p-6 space-y-8">
        <h1 className="text-2xl font-semibold">Mes réservations</h1>

        {/* État vide : je l’affiche clairement si je n’ai aucune réservation */}
        {reservations.length === 0 ? (
          <p className="text-neutral-500">Vous n’avez encore aucune réservation.</p>
        ) : (
          // Sinon j’affiche une grille responsive de cartes (1 / 2 / 3 colonnes selon la taille)
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {reservations.map((a) => (
              <div key={a.id} className="rounded border overflow-hidden bg-white">
                {/* Image de l’activité (lazy loading pour de meilleures perfs) */}
                <img
                  src={activityImage(a)}
                  alt={a.title}
                  className="w-full h-48 object-cover"
                  loading="lazy"
                />

                <div className="p-4 space-y-2">
                  {/* Titre + infos lieu/date (je prends a.date sinon la 1ère date de a.dates si dispo) */}
                  <h2 className="text-lg font-medium">{a.title}</h2>
                  <p className="text-sm text-neutral-600">
                    {a.location} {a.date ? `– ${a.date}` : (a.dates?.length ? `– ${a.dates[0]}` : '')}
                  </p>

                  {/* Badge lisible du statut (accepted / pending / declined) */}
                  <StatusBadge status={a.status} />

                  {/* CTA : j’offre un raccourci pour écrire à l’organisateur depuis la messagerie */}
                  <div className="pt-3">
                    <a
                      href={route('messagerie.user', a.host_user?.id ?? 0)}
                      className="inline-flex items-center justify-center w-full px-4 py-2 rounded bg-blue-600 hover:bg-blue-700 text-white text-sm"
                    >
                      Contacter l’organisateur
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
