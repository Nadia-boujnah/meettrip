import AppLayout from '@/layouts/app-layout';
import { Head, usePage, Link, router } from '@inertiajs/react';
import { useMemo, useState } from 'react';

/**
 * Détail d'une conversation
 * - Marquage "lu" est fait côté back (ConversationsController@show)
 * - Affiche l'image d'activité via conversation.activity.image_url
 * - Envoi d'un message -> POST messages.reply
 */
export default function MessageDetail() {
  const { conversation, messages = [] } = usePage().props;

  const [text, setText] = useState('');
  const convId = conversation?.id;

  const organizerLabel = useMemo(() => {
    const o = conversation?.other;
    if (!o) return '';
    const f = o?.prenom || o?.name || '';
    const l = o?.nom || '';
    return `${f} ${l}`.trim();
  }, [conversation]);

  const activityCover = conversation?.activity?.image_url || null;

  const humanDate = (iso) => {
    try {
      return new Date(iso).toLocaleString('fr-FR');
    } catch {
      return iso ?? '';
    }
  };

  const onSend = (e) => {
    e.preventDefault();
    if (!text.trim() || !convId) return;

    router.post(route('messages.reply', convId), { body: text.trim() }, { onSuccess: () => setText('') });
  };

  if (!convId) {
    return (
      <AppLayout>
        <div className="p-6 text-center text-gray-500">
          Conversation introuvable.
          <div className="mt-4">
            <Link href={route('messagerie')} className="text-blue-600 hover:underline">
              ← Retour à la messagerie
            </Link>
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <Head title={`Conversation avec ${organizerLabel || 'contact'}`} />

      <div className="p-6 max-w-3xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-semibold">Conversation</h1>
          <Link href={route('messagerie')} className="text-sm text-blue-600 hover:underline">
            ← Retour messagerie
          </Link>
        </div>

        {/* Carte activité liée */}
        {conversation.activity && (
          <div className="flex items-start gap-4 bg-gray-50 p-4 rounded shadow-sm">
            {activityCover ? (
              <img src={activityCover} alt={conversation.activity.title} className="w-20 h-20 object-cover rounded" />
            ) : null}
            <div>
              <h2 className="font-semibold">{conversation.activity.title}</h2>
              <p className="text-sm text-gray-500">{conversation.activity.location}</p>
              {organizerLabel && (
                <p className="text-sm mt-1">
                  Organisateur : <span className="font-medium">{organizerLabel}</span>
                </p>
              )}
            </div>
          </div>
        )}

        {/* Liste des messages */}
        <div className="bg-white p-4 rounded-xl shadow space-y-3 max-h-[420px] overflow-y-auto">
          {messages.length === 0 ? (
            <p className="text-sm text-gray-400 italic">Aucun message pour le moment.</p>
          ) : (
            messages.map((m) => (
              <div key={m.id} className="flex">
                <div className="px-4 py-2 rounded-lg max-w-[80%] text-sm bg-gray-100 text-gray-800">
                  <div className="text-[12px] font-medium text-gray-600">{m.from_name}</div>
                  <div className="whitespace-pre-wrap">{m.body}</div>
                  <div className="text-[11px] mt-1 text-right opacity-70">{humanDate(m.date)}</div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Composer */}
        <form onSubmit={onSend} className="flex gap-2">
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Votre message…"
            className="flex-1 border rounded px-4 py-2 text-sm"
          />
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 text-sm"
            disabled={!text.trim()}
          >
            Envoyer
          </button>
        </form>
      </div>
    </AppLayout>
  );
}
