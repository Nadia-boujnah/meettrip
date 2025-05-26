import AppLayout from '@/layouts/app-layout';
import { Head, usePage } from '@inertiajs/react';
import { allActivities } from '@/data/activities';
import nadia from '@/assets/images/nadia-voyage.png';



const breadcrumbs = [{ title: 'Accueil', href: '/dashboard' }];

export default function Dashboard() {
  const page = usePage();
  const {auth} = page.props;
  
  console.log(auth);

  const rawConversations = [
  {
    activityId: 4,
    lastMessage: "Bonjour, j’ai réservé votre activité, avez-vous besoin que j’apporte quelque chose ?",
  },
  {
    activityId: 2,
    lastMessage: "Bonjour Marc, merci pour la validation ! Dois-je prévoir quelque chose pour l’excursion ?",
  },
];

const recentMessages = rawConversations.map((conv) => {
  const activity = allActivities.find((a) => a.id === conv.activityId);
  return {
    organizerName: activity.host_user.name,
    message: conv.lastMessage,
  };
});

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Accueil CO" />
      <div className="p-4 sm:p-6 space-y-6">
        
     {/* Profil utilisateur */}
<div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 p-4 rounded-xl shadow bg-white">
  <img
    src={nadia}
    alt="Photo de profil"
    className="w-20 h-20 rounded-full object-cover"
  />
  <div className="text-center sm:text-left">
    <a
      href="/profil"
      className="font-semibold text-lg text-blue-600 hover:underline transition"
    >
      {auth?.user?.name}
    </a>
    <p className="text-sm text-gray-500">✔️ Compte vérifié</p>
  </div>
</div>


      {/* Grille responsive */}
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
  {/* Mes Réservations */}
<div className="rounded-xl p-4 bg-white shadow flex flex-col justify-between transition transform hover:scale-105">
  <div>
    <h2 className="font-semibold text-lg mb-4">Mes réservations</h2>
    <ul className="space-y-2 text-sm">
      <li>📅 <strong>15-08-2025</strong> – Coucher de soleil</li>
      <li>📅 <strong>10-08-2025</strong> – Excursion bateau</li>
    </ul>
  </div>
  <div className="mt-4 space-y-2">
    <a
      href="/my-reservations"
      className="block w-full text-center rounded border border-blue-400 text-blue-500 py-2 text-sm bg-white hover:bg-blue-50 transition"
    >
      Voir mes réservations
    </a>
    <a
      href="/activitesconnected"
      className="block w-full text-center rounded bg-blue-400 text-white py-2 text-sm hover:bg-blue-500 transition"
    >
      Voir toutes les activités
    </a>
  </div>
</div>


  {/* Messagerie Rapide */}
<div className="p-4 bg-white shadow rounded-xl flex flex-col justify-between transition transform hover:scale-105">
  <div>
    <div className="flex items-center justify-between mb-2">
      <h2 className="font-semibold text-lg">Messagerie Rapide</h2>
      <span className="bg-blue-500 text-white text-xs font-semibold px-2 py-0.5 rounded-full">
        {recentMessages.length}
      </span>
    </div>
    <ul className="text-sm space-y-1">
      {recentMessages.map((msg, idx) => (
        <li key={idx}>
          <strong>{msg.organizerName}</strong><br />
          {msg.message.slice(0, 50)}...
        </li>
      ))}
    </ul>
  </div>
   <a
      href="/messagerie"
      className="block w-full text-center rounded bg-blue-400 text-white py-2 text-sm hover:bg-blue-500 transition"
    >
      Voir tout les messages
    </a>
</div>


  {/* Mes Annonces */}
<div className="p-4 bg-white shadow rounded-xl flex flex-col justify-between transition transform hover:scale-105">
  <div>
    <h2 className="font-semibold text-lg mb-2">Mes annonces</h2>
    <ul className="text-sm space-y-2">
      <li>
        📅 <strong>25 juillet 2025</strong> – Atelier poterie
      </li>
      <li>
        📅 <strong>28 juillet 2025</strong> – Pique-nique bord de mer
      </li>
    </ul>
  </div>
  <div className="mt-4 space-y-2">
    <a
      href="/annonces"
      className="w-full block text-center rounded bg-blue-400 text-white py-2 text-sm hover:bg-blue-500 transition"
    >
      Voir toutes les annonces
    </a>
    <a
      href="/annonces#creer"
      className="w-full block text-center rounded border border-blue-400 text-blue-500 py-2 text-sm bg-white hover:bg-blue-50 transition"
    >
      Créer une annonce
    </a>
  </div>
</div>


        </div>
      </div>
    </AppLayout>
  );
}
