import AppLayout from '@/layouts/app-layout.jsx';
import { Head, usePage } from '@inertiajs/react';
import {
  Chart as ChartJS,
  LineElement, PointElement, CategoryScale, LinearScale,
  Title, Tooltip, Legend, ArcElement,
} from 'chart.js';
import { Line, Pie } from 'react-chartjs-2';

ChartJS.register(LineElement, PointElement, CategoryScale, LinearScale, Title, Tooltip, Legend, ArcElement);

export default function AdminDashboard() {
  const { metrics, breakdown, activitySeries } = usePage().props || {};
  const m = metrics || {};
  const b = breakdown || {};
  const s = activitySeries || { labels: [], data: [], year: new Date().getFullYear() };

  const cards = [
    { label: 'Utilisateurs inscrits', value: m.users ?? 0 },
    { label: 'Comptes validés',       value: m.validated ?? 0 },
    { label: 'Activités créées',      value: m.activities ?? 0 },
    { label: 'Identités à valider',   value: m.toReview ?? 0 }, // ✅ lit la prop alignée
  ];

  const lineData = {
    labels: s.labels,
    datasets: [{
      label: `Activités créées (${s.year})`,
      data: s.data,
      borderColor: '#3B82F6',
      backgroundColor: '#3B82F6',
      tension: 0.3,
      fill: false,
    }],
  };
  const lineOptions = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      title: { display: true, text: `Évolution des activités créées (${s.year})` },
    },
    scales: { y: { beginAtZero: true } },
  };

  const pieStatusData = {
    labels: ['Validés', 'À valider (incl. rejetés / vides)'],
    datasets: [{
      data: [
        b.validated ?? 0,
        b.pending ?? 0, // ici “pending” = même calcul que m.toReview
      ],
      backgroundColor: ['#1D4ED8', '#93C5FD'],
      borderColor: '#fff',
      borderWidth: 1,
    }],
  };

  const roles = [
    { label: 'Organisateurs', value: b.organizers ?? 0 },
    { label: 'Participants',  value: b.participants ?? 0 },
  ];

  return (
    <AppLayout title="Tableau de bord Administrateur">
      <Head title="Tableau de bord Administrateur" />
      <div className="p-6 bg-white text-[#1B1B18] space-y-10">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Tableau de bord Administrateur</h1>
          <p className="text-gray-500">Vue d’ensemble des indicateurs clés</p>
        </div>

        {/* Cartes KPI */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {cards.map((c, i) => (
            <div key={i} className="bg-white rounded-xl shadow p-5 hover:shadow-md transition">
              <div className="text-sm text-gray-500">{c.label}</div>
              <div className="text-3xl font-semibold mt-1">{c.value}</div>
            </div>
          ))}
        </div>

        {/* Courbe activités */}
        <div className="bg-white rounded-xl shadow p-6">
          <Line data={lineData} options={lineOptions} />
        </div>

        {/* Répartition des statuts */}
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-xl font-bold mb-4">Répartition des statuts de comptes</h2>
          <div className="w-[320px] mx-auto">
            <Pie data={pieStatusData} />
          </div>
        </div>

        {/* Rôles */}
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-xl font-bold mb-4">Répartition des rôles</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {roles.map((r, i) => (
              <div key={i} className="bg-gray-50 rounded-lg p-4">
                <div className="text-sm text-gray-500">{r.label}</div>
                <div className="text-2xl font-bold">{r.value}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
