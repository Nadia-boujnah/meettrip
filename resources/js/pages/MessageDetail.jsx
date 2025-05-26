
import AppLayout from '@/layouts/app-layout';
import { Head, usePage } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import { allActivities } from '@/data/activities';
import { allUsers } from '@/data/users';

export default function MessageDetail() {
  const { url } = usePage();
  const searchParams = new URLSearchParams(url.split('?')[1]);

  const activityTitle = decodeURIComponent(searchParams.get('activite'));
  const organizerId = parseInt(searchParams.get('organisateur'));

  const activity = allActivities.find(
    (a) => a.title === activityTitle && a.host_user.id === organizerId
  );
  const organizer = allUsers.find((u) => u.id === organizerId);

  const [messages, setMessages] = useState([]);

  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
    // ⚠️ Optionnel : charger depuis localStorage si tu veux persister
    setMessages([]); // initialise vide
  }, [organizerId, activityTitle]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const newMsg = {
      id: messages.length + 1,
      from: 'me',
      text: newMessage,
      date: new Date().toLocaleDateString('fr-FR'),
    };

    setMessages((prev) => [...prev, newMsg]);
    setNewMessage('');
  };

  if (!activity || !organizer) {
    return (
      <AppLayout>
        <div className="p-6 text-center text-gray-500">Aucune activité ou organisateur trouvé.</div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <Head title={`Discussion avec ${organizer.prenom} ${organizer.nom}`} />
      <div className="p-6 max-w-3xl mx-auto space-y-6">
        <h1 className="text-2xl font-semibold mb-4">
          Discussion avec {organizer.prenom} {organizer.nom}
        </h1>

        <div className="flex items-center gap-4 bg-gray-50 p-4 rounded shadow-sm">
          <img
            src={activity.image}
            alt={activity.title}
            className="w-20 h-20 object-cover rounded"
          />
          <div>
            <h2 className="font-semibold">{activity.title}</h2>
            <p className="text-sm text-gray-500">{activity.location}</p>
          </div>
        </div>

        {/* Liste des messages */}
        <div className="bg-white p-4 rounded-xl shadow space-y-4 max-h-[400px] overflow-y-auto">
          {messages.length === 0 ? (
            <p className="text-sm text-gray-400 italic">Aucun message pour le moment.</p>
          ) : (
            messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.from === 'me' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`px-4 py-2 rounded-lg max-w-[70%] text-sm ${
                    msg.from === 'me'
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  <p>{msg.text}</p>
                  <p className="text-xs mt-1 text-right">{msg.date}</p>
                </div>
              </div>
            ))
          )}
        </div>

        <form onSubmit={handleSend} className="flex gap-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Votre message..."
            className="flex-1 border rounded px-4 py-2 text-sm"
          />
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 text-sm"
          >
            Envoyer
          </button>
        </form>
      </div>
    </AppLayout>
  );
}
