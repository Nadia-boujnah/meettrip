import AppLayout from '@/layouts/app-layout';
import { Head, Link, usePage, router } from '@inertiajs/react';
import { useMemo, useState } from 'react';
import { resolveAssetImage } from '@/utils/resolveAssetImage';
import SuccessDialog from '@/components/SuccessDialog';



export default function Messagerie() {
  const { threads = [], contactId = null, activityContext = null } = usePage().props;

  const [showComposer, setShowComposer] = useState(!!contactId || !!activityContext);
  const [newMessageText, setNewMessageText] = useState('');

  const fullName = (u) => {
    if (!u) return '';
    const f = u.prenom || u.name || '';
    const l = u.nom || '';
    return `${f} ${l}`.trim();
  };
  const imgFrom = (file) => (file ? resolveAssetImage(file) : null);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!contactId || !newMessageText.trim()) return;

    router.post(
      (typeof route === 'function' ? route('messages.store') : '/messages'),
      {
        contact_id: contactId,
        activity_id: activityContext?.id ?? null,
        body: newMessageText.trim(),
      },
      {
        onSuccess: () => {
          setNewMessageText('');
          setShowComposer(false);
          // Inertia suit la redirection backend vers /messages/{id}
        },
      }
    );
  };

  return (
    <AppLayout>
      <Head title="Messagerie" />

      <div className="p-6 space-y-6 max-w-5xl mx-auto">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold">Messagerie</h1>
          <Link
            href={typeof route === 'function' ? route('activities.connected') : '/activitesconnected'}
            className="text-sm text-blue-600 hover:underline"
          >
            ← Retour aux activités
          </Link>
        </div>

        {/* ==== Liste des conversations ==== */}
        <section className="space-y-2">
          <h2 className="text-lg font-semibold">Vos conversations</h2>

          {threads.length === 0 ? (
            <p className="text-sm text-gray-500">Aucune conversation pour le moment.</p>
          ) : (
            <ul className="border rounded-md overflow-hidden divide-y">
              {threads.map((t) => {
                const displayName = fullName(t.other) || `Utilisateur #${t.other?.id}`;
                const cover = imgFrom(t.activity?.image);
                const subtitle = t.activity
                  ? `${t.activity.title} — ${t.activity.location}`
                  : `Conversation générale`;

                return (
                  <li
  key={t.id}
  className="flex items-center justify-between gap-4 px-4 py-3 hover:bg-gray-50 transition border-b last:border-none"
>
  {/* Image activité */}
  {cover ? (
    <img
      src={cover}
      alt={t.activity?.title || 'Activité'}
      className="w-14 h-14 rounded object-cover"
    />
  ) : (
    <div className="w-14 h-14 rounded bg-gray-200 flex items-center justify-center text-xs text-gray-500">
      Sans image
    </div>
  )}

  {/* Texte cliquable */}
  <Link
    href={typeof route === 'function' ? route('messages.show', t.id) : `/messages/${t.id}`}
    className="flex-1"
  >
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <p className="font-medium">{displayName}</p>
        {t.unread && (
          <span className="text-[11px] px-2 py-0.5 rounded-full bg-blue-600 text-white">
            Non lu
          </span>
        )}
      </div>
      {t.last_message_at && (
        <span className="text-xs text-gray-400">
          {new Date(t.last_message_at).toLocaleString('fr-FR')}
        </span>
      )}
    </div>
    <p className="text-sm text-gray-600">{subtitle}</p>
  </Link>

 {/* Actions rapides */}
<div className="flex items-center gap-2">
  <button
    onClick={(e) => {
      e.preventDefault();
      if (!confirm('Supprimer cette conversation ?')) return;
      router.delete(
        typeof route === 'function' ? route('messages.destroy', t.id) : `/messages/${t.id}`,
        { preserveScroll: true }
      );
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

        {/* ==== Composer ciblé (si tu viens d’une activité) ==== */}
        {(contactId || activityContext) && (
          <section className="p-4 border rounded-xl bg-gray-50 space-y-3">
            <h2 className="text-lg font-semibold">Nouveau message</h2>

            {activityContext && (
              <div className="flex items-start gap-4 p-3 border rounded bg-white">
                {activityContext.image && (
                  <img
                    src={imgFrom(activityContext.image)}
                    alt={activityContext.title}
                    className="w-16 h-16 rounded object-cover"
                  />
                )}
                <div>
                  <p className="text-sm text-gray-500">À propos de :</p>
                  <p className="font-medium">{activityContext.title}</p>
                  <p className="text-sm text-gray-600">{activityContext.location}</p>
                  {activityContext.host && (
                    <p className="text-sm mt-1">
                      Organisateur : <span className="font-medium">{fullName(activityContext.host)}</span>
                    </p>
                  )}
                </div>
              </div>
            )}

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
              ></textarea>

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
