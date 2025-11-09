// resources/js/Pages/Host/Reservations.jsx
import AppLayout from '@/layouts/app-layout';
import { Head, usePage, router } from '@inertiajs/react';

function activityImage(activity) {
  if (activity?.image_url) return activity.image_url;
  if (activity?.image?.startsWith('activities/')) return `/storage/${activity.image}`;
  return '/images/placeholder.png';
}

// Essaie d’extraire une date (si elle existe)
function extractDate(activity) {
  if (!activity) return null;
  if (activity.date) return activity.date;
  if (Array.isArray(activity.dates) && activity.dates.length > 0) return activity.dates[0];
  return null;
}

// Composant générique pour afficher une section
function Section({ title, items, renderItem }) {
  if (!items || items.length === 0) return null;
  return (
    <section className="space-y-4">
      <h2 className="text-lg font-semibold">{title}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {items.map(renderItem)}
      </div>
    </section>
  );
}

export default function Reservations() {
  const { items = [] } = usePage().props;

  // On sépare les activités selon leur statut
  const pending = items.filter((it) => it.status === 'pending');
  const accepted = items.filter((it) => it.status === 'accepted');
  const declined = items.filter((it) => it.status === 'declined');

  // Fonctions pour accepter ou refuser une demande
  const accept = (activityId, guestId) =>
    router.patch(route('host.reservations.accept', [activityId, guestId]), {}, { preserveScroll: true });

  const decline = (activityId, guestId) =>
    router.patch(route('host.reservations.decline', [activityId, guestId]), {}, { preserveScroll: true });

  // Carte activité
  const Card = (it, variant) => {
    const date = extractDate(it.activity);
    return (
      <div key={`${it.activity_id}-${it.guest_id}`} className="rounded border p-4 space-y-3">
        <img
          src={activityImage(it.activity)}
          alt={it.activity?.title ?? 'Activité'}
          className="w-full h-40 object-cover rounded"
          loading="lazy"
        />

        <div className="space-y-1">
          <p className="font-medium">{it.activity?.title}</p>
          <p className="text-sm text-neutral-600">{it.activity?.location}</p>

          <div className="flex items-center gap-2 text-sm">
            <span>Demande de :</span>
            <span className="font-medium">{it.guest?.name}</span>
            {variant === 'accepted' && (
              <span className="text-xs px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                Activité à venir
              </span>
            )}
            {variant === 'declined' && (
              <span className="text-xs px-2 py-0.5 rounded bg-rose-100 text-rose-800">
                Refusée
              </span>
            )}
          </div>

          {variant !== 'pending' && (
            <p className="text-xs text-neutral-500">
              {date ? `Date : ${date}` : 'Date : —'}
            </p>
          )}
        </div>

        {variant === 'pending' && (
          <div className="flex gap-2">
            <button
              onClick={() => accept(it.activity_id, it.guest_id)}
              className="px-3 py-2 rounded bg-green-600 text-white hover:bg-green-700 text-sm"
            >
              Accepter
            </button>
            <button
              onClick={() => decline(it.activity_id, it.guest_id)}
              className="px-3 py-2 rounded bg-red-600 text-white hover:bg-red-700 text-sm"
            >
              Refuser
            </button>
          </div>
        )}
      </div>
    );
  };

  return (
    <AppLayout>
      <Head title="Demandes de réservation" />

      <div className="max-w-5xl mx-auto p-6 space-y-10">
        <h1 className="text-2xl font-semibold">Demandes de réservation</h1>

        {/* Si aucune demande */}
        {pending.length === 0 && accepted.length === 0 && declined.length === 0 ? (
          <p className="text-neutral-500">Vous n’avez aucune demande pour le moment.</p>
        ) : (
          <>
            <Section
              title="En attente"
              items={pending}
              renderItem={(it) => Card(it, 'pending')}
            />
            <Section
              title="À venir"
              items={accepted}
              renderItem={(it) => Card(it, 'accepted')}
            />
            <Section
              title="Refusées"
              items={declined}
              renderItem={(it) => Card(it, 'declined')}
            />
          </>
        )}
      </div>
    </AppLayout>
  );
}
