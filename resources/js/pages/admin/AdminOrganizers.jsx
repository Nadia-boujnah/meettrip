// resources/js/Pages/admin/AdminOrganizers.jsx
import AppLayout from '@/layouts/app-layout.jsx';
import { Head, usePage, router, Link } from '@inertiajs/react';
import { Trash2 } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export default function AdminOrganizers() {
  const { organizers, participants, filters } = usePage().props;
  const [search, setSearch] = useState(filters?.search ?? '');
  const [selectedDate, setSelectedDate] = useState(filters?.date ? new Date(filters.date) : null);
  const [showModal, setShowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [perPage, setPerPage] = useState(filters?.perPage ?? 10);

  // Debounce des filtres -> rafraîchit côté serveur
  useEffect(() => {
    const t = setTimeout(() => {
      router.get(
        route('admin.organizers.index'),
        {
          search,
          date: selectedDate ? selectedDate.toISOString().slice(0,10) : '',
          perPage
        },
        { preserveState: true, preserveScroll: true, replace: true }
      );
    }, 350);
    return () => clearTimeout(t);
  }, [search, selectedDate, perPage]);

  const handleDelete = (id) => {
    if (!confirm('Supprimer ce compte ?')) return;
    router.delete(route('admin.users.destroy', id), { preserveScroll: true });
  };

  const rows = organizers?.data ?? [];

  return (
    <AppLayout title="Profils des membres organisateurs">
      <Head title="Organisateurs" />
      <div className="p-6 bg-white text-[#1B1B18] space-y-10">
        <h1 className="text-3xl font-bold mb-4">Profils des organisateurs</h1>

        {/* Filtres */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6">
          <input
            type="text"
            placeholder="Rechercher par prénom ou nom..."
            className="w-full sm:w-1/2 px-4 py-2 border rounded shadow-sm focus:outline-none focus:ring focus:border-blue-300"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <DatePicker
            selected={selectedDate}
            onChange={(date) => setSelectedDate(date)}
            placeholderText="Date d'inscription..."
            className="px-3 py-2 border rounded shadow-sm"
            dateFormat="yyyy-MM-dd"
            isClearable
          />
          <select
            className="px-3 py-2 border rounded shadow-sm"
            value={perPage}
            onChange={(e) => setPerPage(Number(e.target.value))}
          >
            <option value={10}>10 / page</option>
            <option value={25}>25 / page</option>
            <option value={50}>50 / page</option>
          </select>
        </div>

        {/* Tableau organisateurs */}
        <div className="overflow-x-auto rounded-lg border border-gray-200">
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead className="bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase">
              <tr>
                <th className="px-4 py-3">Photo</th>
                <th className="px-4 py-3">Prénom</th>
                <th className="px-4 py-3">Nom</th>
                <th className="px-4 py-3">E-mail</th>
                <th className="px-4 py-3">Vérifié</th>
                <th className="px-4 py-3">Inscription</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {rows.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50 transition">
                  <td className="px-4 py-3">
                    <img src={user.photo} alt={user.nom} className="w-10 h-10 rounded-full object-cover" />
                  </td>
                  <td className="px-4 py-3 font-medium text-gray-900">{user.prenom}</td>
                  <td className="px-4 py-3 text-gray-700">{user.nom}</td>
                  <td className="px-4 py-3 text-gray-500">{user.email ?? '—'}</td>
                  <td className="px-4 py-3">
                    {String(user.verifie).toLowerCase() === 'oui' ? (
                      <>
                        <span className="text-green-600 font-semibold">Oui</span>
                        {user.document_url && (
                          <button
                            onClick={() => { setSelectedUser(user); setShowModal(true); }}
                            className="ml-3 text-sm text-blue-600 underline hover:text-blue-800"
                          >
                            Voir
                          </button>
                        )}
                      </>
                    ) : (
                      <span className={String(user.verifie).toLowerCase()==='en attente' ? 'text-yellow-600 font-semibold' : 'text-red-500 font-semibold'}>
                        {user.verifie}
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-gray-500">{user.inscription}</td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => handleDelete(user.id)}
                      className="text-red-600 hover:text-red-800 text-sm inline-flex items-center gap-1"
                    >
                      <Trash2 className="w-4 h-4" />
                      Supprimer
                    </button>
                  </td>
                </tr>
              ))}

              {rows.length === 0 && (
                <tr><td className="px-4 py-6 text-gray-500" colSpan={7}>Aucun résultat.</td></tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {organizers?.links && organizers.links.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-4">
            {organizers.links.map((l, idx) => (
              <Link
                key={idx}
                href={l.url || '#'}
                preserveState
                preserveScroll
                className={`px-3 py-1 border rounded ${l.active ? 'bg-gray-900 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'} ${!l.url ? 'opacity-50 cursor-not-allowed' : ''}`}
                dangerouslySetInnerHTML={{ __html: l.label }}
              />
            ))}
          </div>
        )}

        {/* Participants */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold mb-4">Profils des participants</h2>
          <div className="overflow-x-auto rounded-lg border border-gray-200">
            <table className="min-w-full divide-y divide-gray-200 text-sm">
              <thead className="bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase">
                <tr>
                  <th className="px-4 py-3">Photo</th>
                  <th className="px-4 py-3">Prénom</th>
                  <th className="px-4 py-3">Nom</th>
                  <th className="px-4 py-3">E-mail</th>
                  <th className="px-4 py-3">Vérifié</th>
                  <th className="px-4 py-3">Inscription</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {participants.map((u) => (
                  <tr key={u.id} className="hover:bg-gray-50 transition">
                    <td className="px-4 py-3">
                      <img src={u.photo} alt={u.nom} className="w-10 h-10 rounded-full object-cover" />
                    </td>
                    <td className="px-4 py-3 font-medium text-gray-900">{u.prenom}</td>
                    <td className="px-4 py-3 text-gray-700">{u.nom}</td>
                    <td className="px-4 py-3 text-gray-500">{u.email ?? '—'}</td>
                    <td className="px-4 py-3">
                      <span className={`font-semibold ${String(u.verifie).toLowerCase()==='oui' ? 'text-green-600' : String(u.verifie).toLowerCase()==='en attente' ? 'text-yellow-600' : 'text-red-600'}`}>
                        {u.verifie}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-500">{u.inscription}</td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => handleDelete(u.id)}
                        className="text-red-600 hover:text-red-800 text-sm inline-flex items-center gap-1"
                      >
                        <Trash2 className="w-4 h-4" />
                        Supprimer
                      </button>
                    </td>
                  </tr>
                ))}
                {participants.length === 0 && (
                  <tr><td className="px-4 py-6 text-gray-500" colSpan={7}>Aucun participant à afficher.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modale document */}
        {showModal && selectedUser && (
          <div className="fixed inset-0 bg-black/50 z-50 flex justify-center items-center">
            <div className="bg-white p-6 rounded-lg shadow-lg w-[90%] max-w-xl relative">
              <button
                onClick={() => setShowModal(false)}
                className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 text-xl"
              >
                &times;
              </button>
              <h2 className="text-xl font-bold mb-4">
                Document officiel de {selectedUser.prenom}
              </h2>
              <img
                src={selectedUser.document_url || '/documents/demo-doc.png'}
                alt="Document officiel"
                className="w-full h-auto rounded border"
              />
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
