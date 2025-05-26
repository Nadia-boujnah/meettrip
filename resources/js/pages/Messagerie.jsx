import AppLayout from '@/layouts/app-layout';
import { Head, Link } from '@inertiajs/react';
import { useState } from 'react';
import { allActivities } from '@/data/activities';

export default function Messagerie() {
  const [search, setSearch] = useState('');
  const [showComposer, setShowComposer] = useState(false);
  const [newMessageText, setNewMessageText] = useState('');
  const [selectedOrganizerId, setSelectedOrganizerId] = useState(null);

  const rawConversations = [
    {
      activityId: 4,
      lastMessage: "Bonjour, j’ai réservé votre activité, avez-vous besoin que j’apporte quelque chose ?",
      date: '16-05-2025',
      read: false,
    },
    {
      activityId: 2,
      lastMessage: "Bonjour Marc, merci pour la validation ! Dois-je prévoir quelque chose pour l’excursion ?",
      date: '15-05-2025',
      read: true,
    },
  ];

  const conversations = rawConversations.map((conv, index) => {
    const activity = allActivities.find((a) => a.id === conv.activityId);
    return {
      id: index + 1,
      activityTitle: activity.title,
      activityImage: activity.image,
      organizer: activity.host_user,
      location: activity.location,
      lastMessage: conv.lastMessage,
      date: conv.date,
      read: conv.read,
    };
  });

  const filteredConversations = conversations.filter((c) =>
    c.organizer.name.toLowerCase().includes(search.toLowerCase()) ||
    c.activityTitle.toLowerCase().includes(search.toLowerCase()) ||
    c.location.toLowerCase().includes(search.toLowerCase())
  );

  const allOrganizers = Array.from(
    new Map(allActivities.map((a) => [a.host_user.id, a.host_user])).values()
  );

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!selectedOrganizerId || !newMessageText.trim()) return;
    alert(`Message envoyé à ${allOrganizers.find(o => o.id === parseInt(selectedOrganizerId)).name} :\n"${newMessageText}"`);
    setNewMessageText('');
    setSelectedOrganizerId(null);
    setShowComposer(false);
  };

  return (
    <AppLayout>
      <Head title="Messagerie" />
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold">Messagerie</h1>
          <button
            onClick={() => setShowComposer(!showComposer)}
            className="bg-blue-500 text-white px-4 py-2 text-sm rounded hover:bg-blue-600"
          >
            Nouveau message
          </button>
        </div>

        {/* 🔍 Barre de recherche améliorée */}
        <input
          type="text"
          placeholder="Rechercher par activité, organisateur, ville ou pays..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full max-w-sm border border-gray-300 px-4 py-2 rounded text-sm"
        />

        {/* 💬 Liste des conversations */}
        <ul className="space-y-0 border rounded-md overflow-hidden">
          {filteredConversations.length === 0 ? (
            <p className="text-sm text-gray-500 p-4">Aucune conversation trouvée.</p>
          ) : (
            filteredConversations.map((conv) => (
              <li
                key={conv.id}
                className="flex items-center gap-4 px-4 py-3 hover:bg-gray-50 transition border-b last:border-none"
              >
                <img
                  src={conv.activityImage}
                  alt={conv.activityTitle}
                  className="w-16 h-16 object-cover rounded-md flex-shrink-0"
                />
                <Link
                  href={`/messages/${conv.id}`}
                  className="flex-1 flex flex-col justify-center"
                >
                  <div className="flex justify-between items-center">
                    <p className="font-semibold">{conv.organizer.name}</p>
                    <span className="text-xs text-gray-400">{conv.date}</span>
                  </div>
                  <p className="text-sm text-gray-600 italic">
                    {conv.activityTitle}
                  </p>
                  <p className="text-sm text-gray-800 truncate mt-1">
                    {conv.lastMessage}
                  </p>
                </Link>
                {!conv.read && (
                  <span className="bg-red-500 text-white text-xs font-semibold px-2 py-0.5 rounded-full">
                    Non lu
                  </span>
                )}
              </li>
            ))
          )}
        </ul>

        {/* ✉️ Nouveau message */}
        {showComposer && (
          <form
            onSubmit={handleSendMessage}
            className="p-4 border rounded-xl bg-gray-50 space-y-4"
          >
            <h2 className="text-lg font-semibold">Envoyer un message</h2>

            <select
              value={selectedOrganizerId || ''}
              onChange={(e) => setSelectedOrganizerId(e.target.value)}
              className="w-full border rounded px-3 py-2 text-sm"
            >
              <option value="">Choisir un organisateur</option>
              {allOrganizers.map((org) => (
                <option key={org.id} value={org.id}>
                  {org.name}
                </option>
              ))}
            </select>

            <textarea
              rows={3}
              value={newMessageText}
              onChange={(e) => setNewMessageText(e.target.value)}
              className="w-full border rounded px-3 py-2 text-sm"
              placeholder="Votre message..."
            ></textarea>

            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 text-sm"
            >
              Envoyer
            </button>
          </form>
        )}
      </div>
    </AppLayout>
  );
}
