import AppLayout from '@/layouts/app-layout.jsx';
import { Head, usePage } from '@inertiajs/react';
import {
  Chart as ChartJS,
  LineElement, PointElement, CategoryScale, LinearScale,
  Title, Tooltip, Legend, ArcElement,
} from 'chart.js';
import { Line, Pie } from 'react-chartjs-2';

// J’enregistre les modules Chart.js dont j’ai besoin (lignes, axes, légende, etc.)
ChartJS.register(LineElement, PointElement, CategoryScale, LinearScale, Title, Tooltip, Legend, ArcElement);

export default function AdminDashboard() {
// Je récupère les chiffres généraux, les statistiques par catégorie et les données pour le graphique
  const { metrics, breakdown, activitySeries } = usePage().props || {};
  const m = metrics || {};                               // ex: { users, validated, activities, toReview }
  const b = breakdown || {};                             // ex: { validated, pending, organizers, participants }
  const s = activitySeries || { labels: [], data: [], year: new Date().getFullYear() }; // courbe par mois

  // Cartes KPI  (Indicateur Clé de Performance) en haut de page (affichent des totaux simples)
  const cards = [
    { label: 'Utilisateurs inscrits', value: m.users ?? 0 },
    { label: 'Comptes validés',       value: m.validated ?? 0 },
    { label: 'Activités créées',      value: m.activities ?? 0 },
    { label: 'Identités à valider',   value: m.toReview ?? 0 }, // correspond au calcul côté back
  ];

  // Données pour la courbe des activités créées sur l’année s.year
  const lineData = {
    labels: s.labels, // ex: ['Jan', 'Fév', ...]
    datasets: [{
      label: `Activités créées (${s.year})`,
      data: s.data,   // ex: [3, 7, 12, ...]
      borderColor: '#3B82F6',
      backgroundColor: '#3B82F6',
      tension: 0.3,   // légère courbure de la ligne
      fill: false,    // pas d’aire remplie sous la courbe
    }],
  };
  const lineOptions = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      title: { display: true, text: `Évolution des activités créées (${s.year})` },
    },
    scales: { y: { beginAtZero: true } }, // l’axe Y commence à 0 pour une lecture claire
  };

  // Données pour le camembert des statuts de comptes
  const pieStatusData = {
    labels: ['Validés', 'À valider (incl. rejetés / vides)'],
    datasets: [{
      data: [
        b.validated ?? 0,
        b.pending ?? 0, // même logique de calcul que m.toReview côté back
      ],
      backgroundColor: ['#1D4ED8', '#93C5FD'],
      borderColor: '#fff',
      borderWidth: 1,
    }],
  };

  // Blocs “rôles” (organisateurs vs participants)
  const roles = [
    { label: 'Organisateurs', value: b.organizers ?? 0 },
    { label: 'Participants',  value: b.participants ?? 0 },
  ];

  return (
    <AppLayout title="Tableau de bord Administrateur">
      <Head title="Tableau de bord Administrateur" />
      <div className="p-6 bg-white text-[#1B1B18] space-y-10">
        {/* En-tête de la page : titre et sous-titre */}
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Tableau de bord Administrateur</h1>
          <p className="text-gray-500">Vue d’ensemble des indicateurs clés</p>
        </div>

        {/* Cartes KPI : je parcours le tableau "cards" et j’affiche label + valeur */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {cards.map((c, i) => (
            <div key={i} className="bg-white rounded-xl shadow p-5 hover:shadow-md transition">
              <div className="text-sm text-gray-500">{c.label}</div>
              <div className="text-3xl font-semibold mt-1">{c.value}</div>
            </div>
          ))}
        </div>

        {/* Courbe des activités créées par mois pour l’année courante (ou celle fournie) */}
        <div className="bg-white rounded-xl shadow p-6">
          <Line data={lineData} options={lineOptions} />
        </div>

        {/* Diagramme en secteurs pour la répartition des statuts de comptes */}
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-xl font-bold mb-4">Répartition des statuts de comptes</h2>
          <div className="w-[320px] mx-auto">
            <Pie data={pieStatusData} />
          </div>
        </div>

        {/* Blocs chiffrés pour les rôles utilisateurs */}
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
