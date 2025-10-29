import AppLayout from '@/layouts/app-layout.jsx';
import { Head } from '@inertiajs/react';
import { allActivities } from '@/data/activities';
import { Trash2 } from 'lucide-react';
import { useState } from 'react';

export default function AdminActivities() {
  const [activities, setActivities] = useState(allActivities);
  const [search, setSearch] = useState('');
  const [locationFilter, setLocationFilter] = useState('');

  const uniqueLocations = [...new Set(allActivities.map((a) => a.location))];

  const handleDelete = (id) => {
    if (confirm('Voulez-vous vraiment supprimer cette activité ?')) {
      setActivities((prev) => prev.filter((a) => a.id !== id));
      alert(`Activité ID ${id} supprimée (simulation).`);
    }
  };

  const filteredActivities = activities.filter((a) => {
    const matchSearch =
      a.title.toLowerCase().includes(search.toLowerCase()) ||
      a.host_user.name.toLowerCase().includes(search.toLowerCase());
    const matchLocation = locationFilter ? a.location === locationFilter : true;
    return matchSearch && matchLocation;
  });

  return (
    <AppLayout title="Vue des activités">
      <Head title="Activités" />
      <div className="p-6 bg-white text-[#1B1B18] space-y-10">
        <h1 className="text-3xl font-bold mb-6">Gestion des activités</h1>

        {/* Filtres */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <input
            type="text"
            placeholder="Rechercher par titre ou organisateur..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="px-4 py-2 border rounded shadow-sm flex-1"
          />
          <select
            value={locationFilter}
            onChange={(e) => setLocationFilter(e.target.value)}
            className="px-4 py-2 border rounded shadow-sm"
          >
            <option value="">Tous les lieux</option>
            {uniqueLocations.map((loc, idx) => (
              <option key={idx} value={loc}>{loc}</option>
            ))}
          </select>
        </div>

        {/* Tableau des activités */}
        <div className="overflow-x-auto rounded-lg border border-gray-200">
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead className="bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase">
              <tr>
                <th className="px-4 py-3">Titre</th>
                <th className="px-4 py-3">Lieu</th>
                <th className="px-4 py-3">Organisateur</th>
                <th className="px-4 py-3">Participants</th>
                <th className="px-4 py-3">Dates</th>
                <th className="px-4 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredActivities.map((a) => (
                <tr key={a.id} className="hover:bg-gray-50 transition">
                  <td className="px-4 py-3 font-medium text-gray-900 flex items-center gap-3">
                <img
                src={a.image}
                alt={a.title}
                className="w-10 h-10 rounded-full object-cover border"
                />
                <span>{a.title}</span>
                </td>

                  <td className="px-4 py-3 text-gray-600">{a.location}</td>
                  <td className="px-4 py-3 text-gray-600">{a.host_user.name}</td>
                  <td className="px-4 py-3 text-gray-600">{a.participants}</td>
                  <td className="px-4 py-3 text-gray-500">{a.dates.join(', ')}</td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => handleDelete(a.id)}
                      className="text-red-600 hover:text-red-800 text-sm flex items-center gap-1"
                    >
                      <Trash2 className="w-4 h-4" />
                      Supprimer
                    </button>
                  </td>
                </tr>
              ))}
              {filteredActivities.length === 0 && (
                <tr>
                  <td colSpan="6" className="text-center text-gray-400 py-4">Aucune activité trouvée.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AppLayout>
  );
}
