import AppLayout from '@/layouts/app-layout';
import { Head, usePage, Link, router } from '@inertiajs/react';
import { useMemo, useState } from 'react';
import { resolveAssetImage } from '@/utils/resolveAssetImage';

export default function MessageDetail() {
  // ✅ Données envoyées par ConversationsController@show
  const { conversation, messages = [], flash = {} } = usePage().props;

  const [text, setText] = useState('');
  const convId = conversation?.id;

  // Libellé organisateur
  const organizerLabel = useMemo(() => {
    const o = conversation?.other;
    if (!o) return '';
    const f = o.prenom || o.name || '';
    const l = o.nom || '';
    return `${f} ${l}`.trim();
  }, [conversation]);

  // Image d'activité depuis /resources/js/assets
  const activityImg = useMemo(() => {
    const file = conversation?.activity?.image;
    return file ? resolveAssetImage(file) : null;
  }, [conversation]);

  const onSend = (e) => {
    e.preventDefault();
    if (!text.trim() || !convId) return;

    router.post(
      (typeof route === 'function' ? route('messages.reply', convId) : `/messages/${convId}/reply`),
      { body: text.trim() },
      { onSuccess: () => setText('') }
    );
  };

  // Sécurité : si la conv n'existe pas
  if (!convId) {
    return (
      <AppLayout>
        <div className="p-6 text-center text-gray-500">
          Conversation introuvable.
          <div className="mt-4">
            <Link href={typeof route === 'function' ? route('messagerie') : '/messagerie'} className="text-blue-600 hover:underline">
              ← Retour à la messagerie
            </Link>
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <Head title={`Conversation avec ${organizerLabel}`} />

      <div className="p-6 max-w-3xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-semibold">Conversation</h1>
          <Link href={typeof route === 'function' ? route('messagerie') : '/messagerie'} className="text-sm text-blue-600 hover:underline">
            ← Retour messagerie
          </Link>
        </div>

        {/* Carte activité liée */}
        {conversation.activity && (
          <div className="flex items-start gap-4 bg-gray-50 p-4 rounded shadow-sm">
            {activityImg && (
              <img src={activityImg} alt={conversation.activity.title} className="w-20 h-20 object-cover rounded" />
            )}
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
        <div className="bg-white p-4 rounded-xl shadow space-y-4 max-h-[420px] overflow-y-auto">
          {messages.length === 0 ? (
            <p className="text-sm text-gray-400 italic">Aucun message pour le moment.</p>
          ) : (
            messages.map((m) => (
              <div key={m.id} className="flex justify-start">
                <div className="px-4 py-2 rounded-lg max-w-[70%] text-sm bg-gray-100 text-gray-800">
                  <p className="font-medium">{m.from_name}</p>
                  <p>{m.body}</p>
                  <p className="text-[11px] mt-1 text-right opacity-80">
                    {new Date(m.date).toLocaleString('fr-FR')}
                  </p>
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
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 text-sm">
            Envoyer
          </button>
        </form>
      </div>
    </AppLayout>
  );
}
