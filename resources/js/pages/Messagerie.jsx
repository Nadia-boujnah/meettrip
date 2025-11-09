import AppLayout from '@/layouts/app-layout';
import { Head, Link, usePage, router } from '@inertiajs/react';
import { useMemo, useState } from 'react';

/**
 * Page Messagerie
 * - Liste tous mes fils de discussion (threads) envoyés par le back.
 * - Affiche un badge avec le nombre de non-lus (unread_count).
 * - Montre la couverture liée à l’activité si dispo (threads[].activity.image_url).
 * - Action rapide : suppression d’une conversation.
 * - Si j’arrive depuis un profil/activité (contactId / activityContext), j’ouvre un composer ciblé.
 */
export default function Messagerie() {
  // Je récupère la data Inertia : la liste des threads + contexte cible éventuel
  const { threads = [], contactId = null, activityContext = null } = usePage().props;

  // J’affiche le composer par défaut si j’ai un contact cible ou une activité ciblée
  const [showComposer, setShowComposer] = useState(!!contactId || !!activityContext);
  const [newMessageText, setNewMessageText] = useState('');

  // Concatène proprement prénom/nom, avec fallback sur name si besoin
  const fullName = (u) => {
    if (!u) return '';
    const f = u?.prenom || u?.name || '';
    const l = u?.nom || '';
    return `${f} ${l}`.trim();
  };

  // Petit formatage lisible de la date/heure du dernier message
  const humanDate = (iso) => {
    try {
      return new Date(iso).toLocaleString('fr-FR');
    } catch {
      return iso ?? '';
    }
  };

  // Envoi d’un nouveau message depuis le composer ciblé
  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!contactId || !newMessageText.trim()) return;

    router.post(
      route('messages.store'),
      {
        contact_id: contactId,
        activity_id: activityContext?.id ?? null, // je relie au contexte activité si présent
        body: newMessageText.trim(),
      },
      {
        onSuccess: () => {
          // Après envoi, je nettoie et je laisse le back me rediriger vers la bonne page
          setNewMessageText('');
          setShowComposer(false);
          // Le back redirige vers /messages/{id} et Inertia suit automatiquement
        },
      }
    );
  };

  return (
    <AppLayout>
      {/* Titre HTML de la page */}
      <Head title="Messagerie" />

      <div className="p-6 space-y-6 max-w-5xl mx-auto">
        {/* En-tête : titre + retour aux activités */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold">Messagerie</h1>
          <Link href={route('activities.connected')} className="text-sm text-blue-600 hover:underline">
            ← Retour aux activités
          </Link>
        </div>

        {/* ==== Liste des conversations ==== */}
        <section className="space-y-2">
          <h2 className="text-lg font-semibold">Vos conversations</h2>

          {/* État vide : rien à afficher pour l’instant */}
          {threads.length === 0 ? (
            <p className="text-sm text-gray-500">Aucune conversation pour le moment.</p>
          ) : (
            <ul className="border rounded-md overflow-hidden divide-y">
              {threads.map((t) => {
                // Nom de l’interlocuteur (fallback sur id si pas de nom)
                const displayName = fullName(t.other) || `Utilisateur #${t.other?.id ?? ''}`;

                // Sous-titre : rappelle l’activité liée si elle existe
                const subtitle = t.activity
                  ? `${t.activity.title ?? '—'} — ${t.activity.location ?? '—'}`
                  : 'Conversation générale';

                // Image d’illustration de l’activité (si fournie par le back)
                const cover = t.activity?.image_url || null;

                return (
                  <li
                    key={t.id}
                    className="flex items-center justify-between gap-4 px-4 py-3 hover:bg-gray-50 transition border-b last:border-none"
                  >
                    {/* Vignette : image de l’activité si dispo, sinon un bloc neutre */}
                    {cover ? (
                      <img
                        src={cover}
                        alt={t.activity?.title || 'Activité'}
                        className="w-14 h-14 rounded object-cover"
                      />
                    ) : (
                      <div className="w-14 h-14 rounded bg-gray-200 flex items-center justify-center text-[10px] text-gray-500">
                        Sans image
                      </div>
                    )}

                    {/* Zone cliquable qui ouvre la conversation */}
                    <Link href={route('messages.show', t.id)} className="flex-1">
                      <div className="flex items-center justify-between">
                        {/* Nom + badge non-lus si > 0 */}
                        <div className="flex items-center gap-2">
                          <p className="font-medium">{displayName}</p>
                          {t.unread_count > 0 && (
                            <span className="text-[11px] px-2 py-0.5 rounded-full bg-red-100 text-red-700 font-semibold">
                              {t.unread_count}
                            </span>
                          )}
                        </div>

                        {/* Date du dernier message (à droite) */}
                        {t.last_message_at && (
                          <span className="text-xs text-gray-400">
                            {humanDate(t.last_message_at)}
                          </span>
                        )}
                      </div>

                      {/* Rappel du contexte sous le nom */}
                      <p className="text-sm text-gray-600">{subtitle}</p>
                    </Link>

                    {/* Action rapide : suppression du fil courant (avec confirmation) */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          if (!confirm('Supprimer cette conversation ?')) return;
                          router.delete(route('messages.destroy', t.id), { preserveScroll: true });
                        }}
                        className="text-xs px-2 py-1 rounded border border-red-300 text-red-600 hover:bg-red-50"
                        title="Supprimer"
                      >
                        Supprimer
                      </button>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </section>

        {/* ==== Composer ciblé (quand j’arrive depuis un profil/activité) ==== */}
        {(contactId || activityContext) && showComposer && (
          <section className="p-4 border rounded-xl bg-gray-50 space-y-3">
            <h2 className="text-lg font-semibold">Nouveau message</h2>

            {/* Si je suis dans le contexte d’une activité, je rappelle l’info en haut du composer */}
            {activityContext && (
              <div className="flex items-start gap-4 p-3 border rounded bg-white">
                {activityContext.image_url ? (
                  <img
                    src={activityContext.image_url}
                    alt={activityContext.title}
                    className="w-16 h-16 rounded object-cover"
                  />
                ) : null}
                <div>
                  <p className="text-sm text-gray-500">À propos de :</p>
                  <p className="font-medium">{activityContext.title}</p>
                  <p className="text-sm text-gray-600">{activityContext.location}</p>
                  {activityContext.host && (
                    <p className="text-sm mt-1">
                      Organisateur :{' '}
                      <span className="font-medium">
                        {fullName(activityContext.host)}
                      </span>
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Formulaire d’envoi : je bloque le submit si pas de texte ou pas de contact */}
            <form onSubmit={handleSendMessage} className="space-y-2">
              <div className="text-sm text-gray-600">
                À :{' '}
                <span className="font-medium">
                  {activityContext?.host
                    ? fullName(activityContext.host)
                    : contactId
                    ? `Utilisateur #${contactId}`
                    : '—'}
                </span>
              </div>

              <textarea
                rows={4}
                value={newMessageText}
                onChange={(e) => setNewMessageText(e.target.value)}
                className="w-full border rounded px-3 py-2 text-sm"
                placeholder="Votre message..."
              />

              <div className="flex items-center gap-2">
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 text-sm"
                  disabled={!newMessageText.trim() || !contactId}
                >
                  Envoyer
                </button>
                <button
                  type="button"
                  onClick={() => setShowComposer(false)}
                  className="text-sm text-gray-500 hover:underline"
                >
                  Fermer
                </button>
              </div>
            </form>
          </section>
        )}
      </div>
    </AppLayout>
  );
}
