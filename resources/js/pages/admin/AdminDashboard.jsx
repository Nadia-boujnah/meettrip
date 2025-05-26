import AppLayout from '@/Layouts/app-Layout';
import { Head } from '@inertiajs/react';
import { allUsers } from '@/data/users';
import { allActivities } from '@/data/activities';
import { Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

export default function AdminDashboard() {
  // 🔢 Données dynamiques utilisateurs
  const totalUsers = allUsers.length;
  const comptesValidés = allUsers.filter(u => u.verifie === true).length;
  const comptesEnAttente = allUsers.filter(u => u.verifie === 'en attente').length;
  const comptesRefusés = allUsers.filter(u => u.verifie === false).length;
  const totalOrganisateurs = allUsers.filter(u => u.role === 'organisateur').length;
  const totalParticipants = allUsers.filter(u => u.role === 'participant').length;

  const totalIdentitesAValider = comptesEnAttente;
  const totalActivitesCreees = allActivities.length;

  const derniersUsers = [...allUsers]
    .sort((a, b) => new Date(b.inscription) - new Date(a.inscription))
    .slice(0, 3);

  const pieData = {
    labels: ['Comptes validés', 'En attente', 'Refusés'],
    datasets: [
      {
        label: 'Répartition',
        data: [comptesValidés, comptesEnAttente, comptesRefusés],
        backgroundColor: ['#1D4ED8', '#3B82F6', '#93C5FD'],
        borderColor: '#fff',
        borderWidth: 1,
      },
    ],
  };

  const pieOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          color: '#1B1B18',
          font: { size: 14 },
        },
      },
    },
  };

  return (
    <AppLayout title="Dashboard Administrateur">
      <Head title="Dashboard" />
      <div className="p-6 bg-white text-[#1B1B18] space-y-10">

        {/* Titre */}
        <div className="flex flex-col md:flex-row md:items-center justify-between">
          <h1 className="text-3xl font-bold">Tableau de bord Administrateur</h1>
          <p className="text-gray-500">Vue d’ensemble des indicateurs clés</p>
        </div>

        {/* Statistiques générales */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { title: 'Utilisateurs inscrits', value: totalUsers },
            { title: 'Comptes validés', value: comptesValidés },
            { title: 'Activités créées', value: totalActivitesCreees },
            { title: 'Identités à valider', value: totalIdentitesAValider },
          ].map((stat, i) => (
            <div key={i} className="bg-white rounded-xl shadow p-5 hover:shadow-md transition">
              <div className="text-sm text-gray-500">{stat.title}</div>
              <div className="text-2xl font-semibold mt-1">{stat.value}</div>
            </div>
          ))}
        </div>

        {/* Camembert */}
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-xl font-bold mb-4">Répartition des statuts de comptes</h2>
          <div className="w-[300px] mx-auto">
            <Pie data={pieData} options={pieOptions} />
          </div>
        </div>

        {/* Répartition des rôles */}
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-xl font-bold mb-4">Répartition des rôles</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="text-sm text-gray-500">Organisateurs</div>
              <div className="text-2xl font-bold">{totalOrganisateurs}</div>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="text-sm text-gray-500">Participants</div>
              <div className="text-2xl font-bold">{totalParticipants}</div>
            </div>
          </div>
        </div>

        {/* Dernières activités organisées */}
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-xl font-bold mb-6">Dernières activités organisées</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {allActivities.slice(0, 3).map((activity) => (
              <div key={activity.id} className="border rounded-lg overflow-hidden shadow hover:shadow-md transition">
                <img src={activity.image} alt={activity.title} className="w-full h-40 object-cover" />
                <div className="p-4">
                  <h3 className="text-lg font-semibold">{activity.title}</h3>
                  <p className="text-sm text-gray-500">{activity.location}</p>
                  <p className="text-sm mt-2">{activity.description}</p>
                  <div className="text-sm mt-4 text-gray-600">
                    Organisé par <span className="font-medium">{activity.host_user.name}</span>
                  </div>
                  <div className="text-sm text-gray-400">Participants : {activity.participants}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Derniers inscrits */}
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Derniers utilisateurs inscrits</h2>
          <ul className="divide-y">
            {derniersUsers.map((user) => (
              <li key={user.id} className="py-3 flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <img src={user.photo} className="w-8 h-8 rounded-full object-cover" alt={user.nom} />
                  <span className="font-medium text-sm">{user.prenom} {user.nom}</span>
                </div>
                <span className="text-sm text-gray-500">{user.inscription}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </AppLayout>
  );
}
