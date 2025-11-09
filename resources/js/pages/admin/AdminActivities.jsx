import AppLayout from '@/layouts/app-layout.jsx';
import { Head, usePage, router } from '@inertiajs/react';
import { Trash2 } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

export default function AdminActivities() {
  // Je récupère depuis Inertia la liste des activités, les filtres et les lieux distincts.
  const { activities, filters, locations } = usePage().props;

  // Si c’est une pagination (paginator), je prends data, sinon j’utilise directement le tableau.
  const rows = Array.isArray(activities) ? activities : (activities?.data ?? []);

  // États locaux pour les filtres et la pagination.
  const [search, setSearch] = useState(filters?.search ?? '');
  const [location, setLocation] = useState(filters?.location ?? '');
  const [perPage, setPerPage] = useState(filters?.perPage ?? 10);
  const [busyId, setBusyId] = useState(null); // identifie une suppression en cours

  /**
   * go()
   * -> Rafraîchit la page côté serveur (Inertia) en gardant les filtres et l’état du tableau.
   *    preserveScroll garde la position, preserveState évite un rechargement complet.
   */
  const go = (params = {}) => {
    const query = {
      search,
      location,
      perPage,
      ...(params || {}),
    };
    router.get(route('admin.activities'), query, {
      preserveScroll: true,
      preserveState: true,
      replace: true,
    });
  };

  /**
   * Ici, j’ajoute un petit délai (300 ms) avant d’exécuter la recherche.
   * Cela évite de relancer une requête serveur à chaque frappe.
   * (on appelle ça un “délai de frappe” ou anti-rebond)
   */
  useEffect(() => {
    const t = setTimeout(() => go(), 300);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, location, perPage]);

  /**
   * handleDelete
   * -> Supprime une activité après confirmation.
   *    - Affiche une boîte de dialogue.
   *    - Met l’ID en “busy” pour désactiver le bouton.
   *    - Appelle la route Laravel correspondante.
   */
  const handleDelete = (id) => {
    if (!confirm('Voulez-vous vraiment supprimer cette activité ?')) return;
    setBusyId(id);
    router.delete(route('admin.activities.destroy', id), {
      preserveScroll: true,
      onFinish: () => setBusyId(null),
    });
  };

  /**
   * uniqueLocations
   * -> Construit la liste des lieux proposés dans le filtre “lieu”.
   */
  const uniqueLocations = useMemo(() => {
    const server = Array.isArray(locations) ? locations : [];
    return server;
  }, [locations]);

  /**
   * goto()
   * -> Permet de naviguer dans les liens de pagination envoyés par le backend Laravel.
   */
  const goto = (url) => {
    if (!url) return;
    router.get(url, {}, { preserveScroll: true, preserveState: true });
  };

  return (
    <AppLayout title="Vue des activités">
      <Head title="Activités" />

      <div className="p-6 bg-white text-[#1B1B18] space-y-10">
        <h1 className="text-3xl font-bold mb-6">Gestion des activités</h1>

        {/* Barre de filtres : recherche, lieu et nombre d’éléments par page */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <input
            type="text"
            placeholder="Rechercher par titre ou organisateur..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="px-4 py-2 border rounded shadow-sm flex-1"
          />

          <select
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="px-4 py-2 border rounded shadow-sm"
          >
            <option value="">Tous les lieux</option>
            {uniqueLocations.map((loc, idx) => (
              <option key={idx} value={loc}>
                {loc}
              </option>
            ))}
          </select>

          <select
            value={perPage}
            onChange={(e) => setPerPage(Number(e.target.value))}
            className="px-4 py-2 border rounded shadow-sm"
          >
            {[10, 25, 50].map((n) => (
              <option key={n} value={n}>
                {n} / page
              </option>
            ))}
          </select>
        </div>

        {/* Tableau principal des activités */}
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
              {rows.map((a) => (
                <tr key={a.id} className="hover:bg-gray-50 transition">
                  {/* Image + titre de l’activité */}
                  <td className="px-4 py-3 font-medium text-gray-900">
                    <div className="flex items-center gap-3">
                      <img
                        src={a.image}
                        alt={a.title}
                        className="w-10 h-10 rounded-full object-cover border"
                        onError={(e) => {
                          e.currentTarget.src = '/storage/activities/default.png';
                        }}
                      />
                      <span>{a.title}</span>
                    </div>
                  </td>

                  {/* Détails du tableau */}
                  <td className="px-4 py-3 text-gray-600">{a.location ?? '—'}</td>
                  <td className="px-4 py-3 text-gray-600">{a.host_user?.name ?? '—'}</td>
                  <td className="px-4 py-3 text-gray-600">{a.participants ?? 0}</td>
                  <td className="px-4 py-3 text-gray-500">
                    {(a.dates ?? []).join(', ')}
                  </td>

                  {/* Action supprimer */}
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => handleDelete(a.id)}
                      disabled={busyId === a.id}
                      className="text-red-600 hover:text-red-800 text-sm inline-flex items-center gap-1 disabled:opacity-60"
                    >
                      <Trash2 className="w-4 h-4" />
                      Supprimer
                    </button>
                  </td>
                </tr>
              ))}

              {/* Si aucune activité correspond */}
              {rows.length === 0 && (
                <tr>
                  <td colSpan="6" className="text-center text-gray-400 py-4">
                    Aucune activité trouvée.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination : boutons générés depuis Laravel */}
        {activities?.links && (
          <div className="flex items-center gap-2 pt-4">
            {activities.links.map((link, i) => (
              <button
                key={i}
                disabled={!link.url}
                onClick={() => goto(link.url)}
                className={`px-3 py-1 rounded border text-sm ${
                  link.active ? 'bg-gray-900 text-white' : 'bg-white text-gray-700'
                } disabled:opacity-40`}
                dangerouslySetInnerHTML={{ __html: link.label }}
              />
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
