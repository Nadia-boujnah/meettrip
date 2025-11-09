// resources/js/pages/admin/Statistics.jsx
import AppLayout from '@/layouts/app-layout.jsx';
import { Head, usePage } from '@inertiajs/react';

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

ChartJS.register(LineElement, PointElement, CategoryScale, LinearScale, Title, Tooltip, Legend, ArcElement);

export default function Statistics() {
  const { stats } = usePage().props;

  const cards = [
    { label: 'Utilisateurs inscrits', value: stats.users },
    { label: 'Comptes validés',      value: stats.validated },
    { label: 'Activités créées',     value: stats.activities },
    { label: 'Identités à valider',  value: stats.identitiesToValidate },
  ];

  // Line chart (12 mois, année courante passée par le back)
  const lineData = {
    labels: ['Janv', 'Fév', 'Mars', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sept', 'Oct', 'Nov', 'Déc'],
    datasets: [
      {
        label: `Activités créées (${stats.year})`,
        data: stats.series,
        borderColor: '#3B82F6',
        backgroundColor: '#3B82F6',
        tension: 0.3,
        fill: false,
      },
    ],
  };

  const lineOptions = {
    responsive: true,
    plugins: {
      legend: { position: 'top', labels: { color: '#1B1B18' } },
      title:  { display: true, text: `Évolution des activités créées (${stats.year})`, color: '#1B1B18' },
    },
    scales: {
      y: { beginAtZero: true, ticks: { color: '#1B1B18' } },
      x: { ticks: { color: '#1B1B18' } },
    },
  };

  // Pie chart répartition des statuts (validés vs en attente/rejetés)
  const pendingLike = Math.max(0, stats.users - stats.validated); // approximation simple
  const pieData = {
    labels: ['Comptes validés', 'En attente / refusés'],
    datasets: [
      {
        data: [stats.validated, pendingLike],
        backgroundColor: ['#1D4ED8', '#93C5FD'],
        borderColor: '#fff',
        borderWidth: 1,
      },
    ],
  };

  const pieOptions = {
    responsive: true,
    plugins: {
      legend: { position: 'bottom', labels: { color: '#1B1B18', font: { size: 14 } } },
    },
  };

  return (
    <AppLayout title="Statistiques">
      <Head title="Statistiques" />
      <div className="p-6 bg-white text-[#1B1B18] space-y-10">
        <h1 className="text-3xl font-bold mb-6">Statistiques générales</h1>

        {/* Cartes */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {cards.map((item, i) => (
            <div key={i} className="bg-white rounded-xl shadow p-5 hover:shadow-md transition">
              <div className="text-sm text-gray-500">{item.label}</div>
              <div className="text-2xl font-semibold mt-1">{item.value}</div>
            </div>
          ))}
        </div>

        {/* Courbe */}
        <div className="bg-white rounded-xl shadow p-6">
          <Line data={lineData} options={lineOptions} />
        </div>

        {/* Camembert */}
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-xl font-bold mb-4">Répartition des statuts de comptes</h2>
          <div className="w-[340px] mx-auto">
            <Pie data={pieData} options={pieOptions} />
          </div>
        </div>

        {/* Rôles */}
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-xl font-bold mb-4">Répartition des rôles</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="text-sm text-gray-500">Organisateurs</div>
              <div className="text-2xl font-bold">{stats.roles.organisateurs}</div>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="text-sm text-gray-500">Participants</div>
              <div className="text-2xl font-bold">{stats.roles.participants}</div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
