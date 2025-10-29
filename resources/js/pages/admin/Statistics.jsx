import AppLayout from '@/layouts/app-layout.jsx';
import { Head } from '@inertiajs/react';
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Line, Pie } from 'react-chartjs-2';
import { allUsers } from '@/data/users';

ChartJS.register(LineElement, PointElement, CategoryScale, LinearScale, Title, Tooltip, Legend, ArcElement);

export default function Statistics() {
  // 📊 Données dynamiques depuis allUsers
  const totalUsers = allUsers.length;
  const comptesValidés = allUsers.filter(u => u.verifie === true).length;
  const comptesEnAttente = allUsers.filter(u => u.verifie === 'en attente').length;
  const comptesRefusés = allUsers.filter(u => u.verifie === false).length;
  const totalOrganisateurs = allUsers.filter(u => u.role === 'organisateur').length;
  const totalParticipants = allUsers.filter(u => u.role === 'participant').length;


  const totalIdentitesAValider = comptesEnAttente;
  const totalActivitesCreees = 430; // Remplacer par une vraie source si besoin

  const stats = [
    { label: 'Utilisateurs inscrits', value: totalUsers },
    { label: 'Comptes validés', value: comptesValidés },
    { label: 'Activités créées', value: totalActivitesCreees },
    { label: 'Identités à valider', value: totalIdentitesAValider },
  ];

  const chartData = {
    labels: ['Janv', 'Fév', 'Mars', 'Avr', 'Mai', 'Juin', 'Juil'],
    datasets: [
      {
        label: 'Activités créées',
        data: [35, 52, 68, 90, 112, 140, 180],
        fill: false,
        borderColor: '#3B82F6',
        backgroundColor: '#3B82F6',
        tension: 0.3,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: '#1B1B18',
        },
      },
      title: {
        display: true,
        text: 'Évolution des activités créées (2024)',
        color: '#1B1B18',
      },
    },
    scales: {
      y: {
        ticks: { color: '#1B1B18' },
        beginAtZero: true,
      },
      x: {
        ticks: { color: '#1B1B18' },
      },
    },
  };

  const pieData = {
    labels: ['Comptes validés', 'En attente', 'Refusés'],
    datasets: [
      {
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
    <AppLayout title="Statistiques">
      <Head title="Statistiques" />
      <div className="p-6 bg-white text-[#1B1B18] space-y-10">
        <h1 className="text-3xl font-bold mb-6">Statistiques générales</h1>

        {/* Cartes de statistiques */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((item, index) => (
            <div key={index} className="bg-white rounded-xl shadow p-5 hover:shadow-md transition">
              <div className="text-sm text-gray-500">{item.label}</div>
              <div className="text-2xl font-semibold mt-1">{item.value}</div>
            </div>
          ))}
        </div>

        {/* Line Chart */}
        <div className="bg-white rounded-xl shadow p-6">
          <Line data={chartData} options={chartOptions} />
        </div>

        {/* Camembert */}
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-xl font-bold mb-4">Répartition des statuts de comptes</h2>
          <div className="w-[300px] mx-auto">
            <Pie data={pieData} options={pieOptions} />
          </div>
        </div>
        {/* Rôles : Participants vs Organisateurs */}
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

      </div>
    </AppLayout>
  );
}
