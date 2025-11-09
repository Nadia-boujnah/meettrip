// resources/js/Pages/Host/Reservations.jsx
import AppLayout from '@/layouts/app-layout';
import { Head, usePage, router } from '@inertiajs/react';

/**
 * activityImage
 * -> Fonction utilitaire qui gère toutes les sources possibles d’images d’activités :
 *    1) Si le back renvoie un lien complet (image_url), je l’affiche directement.
 *    2) Si c’est juste un chemin depuis /storage/activities, je le complète.
 *    3) Sinon, je mets une image par défaut pour éviter une image cassée.
 */
function activityImage(activity) {
  if (activity?.image_url) return activity.image_url;
  if (activity?.image?.startsWith('activities/')) return `/storage/${activity.image}`;
  return '/images/placeholder.png';
}

/**
 * extractDate
 * -> Récupère la date principale de l’activité :
 *    - Si "date" existe directement, je la prends.
 *    - Sinon, je regarde le premier élément du tableau "dates".
 *    - Si rien n’est défini, je renvoie null.
 */
function extractDate(activity) {
  if (!activity) return null;
  if (activity.date) return activity.date;
  if (Array.isArray(activity.dates) && activity.dates.length > 0) return activity.dates[0];
  return null;
}

/**
 * Section
 * -> Composant réutilisable pour afficher un bloc (titre + liste de cartes).
 *    Si la section est vide, je ne l’affiche pas.
 */
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
  // Je récupère la liste des réservations envoyée par le back (pour un organisateur)
  const { items = [] } = usePage().props;

  // Je trie les réservations selon leur statut
  const pending  = items.filter((it) => it.status === 'pending');
  const accepted = items.filter((it) => it.status === 'accepted');
  const declined = items.filter((it) => it.status === 'declined');

  /**
   * setStatus
   * -> Fonction générique pour mettre à jour le statut d’une réservation :
   *    - Appelle la route Laravel 'host.reservations.status'
   *    - Envoie le statut choisi (pending / accepted / declined)
   *    - preserveScroll garde la position de la page au même endroit
   */
  const setStatus = (activityId, guestId, status) =>
    router.patch(
      route('host.reservations.status', [activityId, guestId]),
      { status },
      { preserveScroll: true }
    );

  /**
   * StatusBadge
   * -> Composant visuel pour afficher un petit badge coloré selon le statut :
   *    - En attente (jaune)
   *    - Activité à venir (vert)
   *    - Refusée (rose)
   */
  const StatusBadge = ({ status }) => {
    const map = {
      pending:  'bg-amber-100 text-amber-800',
      accepted: 'bg-emerald-100 text-emerald-800',
      declined: 'bg-rose-100 text-rose-800'
    };
    const label = {
      pending:  'En attente',
      accepted: 'Activité à venir',
      declined: 'Refusée'
    }[status] || status;

    return <span className={`text-xs px-2 py-0.5 rounded ${map[status]}`}>{label}</span>;
  };

  /**
   * Card
   * -> Structure d’affichage d’une réservation :
   *    - Image de l’activité
   *    - Informations de base : titre, lieu, participant, date, statut
   *    - 3 boutons d’action : remettre en attente, valider ou refuser
   */
  const Card = (it) => {
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
            <StatusBadge status={it.status} />
          </div>

          <p className="text-xs text-neutral-500">
            {date ? `Date : ${date}` : 'Date : —'}
          </p>
        </div>

        {/* Boutons d’action pour modifier le statut */}
        <div className="flex flex-wrap gap-2 pt-2">
          <button
            onClick={() => setStatus(it.activity_id, it.guest_id, 'pending')}
            className="px-3 py-2 rounded border text-sm hover:bg-neutral-50"
          >
            Remettre en attente
          </button>

          <button
            onClick={() => setStatus(it.activity_id, it.guest_id, 'accepted')}
            className="px-3 py-2 rounded bg-green-600 text-white hover:bg-green-700 text-sm"
          >
            Valider
          </button>

          <button
            onClick={() => setStatus(it.activity_id, it.guest_id, 'declined')}
            className="px-3 py-2 rounded bg-red-600 text-white hover:bg-red-700 text-sm"
          >
            Refuser
          </button>
        </div>
      </div>
    );
  };

  return (
    <AppLayout>
      <Head title="Demandes de réservation" />
      <div className="max-w-5xl mx-auto p-6 space-y-10">
        <h1 className="text-2xl font-semibold">Demandes de réservation</h1>

        {/* Si aucune demande n’existe */}
        {pending.length === 0 && accepted.length === 0 && declined.length === 0 ? (
          <p className="text-neutral-500">Vous n’avez aucune demande pour le moment.</p>
        ) : (
          <>
            {/* Chaque bloc est une section : en attente, à venir ou refusée */}
            <Section title="En attente" items={pending}  renderItem={Card} />
            <Section title="À venir"    items={accepted} renderItem={Card} />
            <Section title="Refusées"   items={declined} renderItem={Card} />
          </>
        )}
      </div>
    </AppLayout>
  );
}
