import AppLayout from '@/Layouts/app-Layout';
import { Head } from '@inertiajs/react';
import { allUsers } from '@/data/users';
import { Trash2, CheckCircle, AlertTriangle } from 'lucide-react';
import { useState } from 'react';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";


export default function AdminOrganizers() {
  const [search, setSearch] = useState('');
  const [showAll, setShowAll] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);


  const handleDelete = (id) => {
    console.log('Supprimer le compte ID:', id);
    alert(`Compte ${id} supprimé (simulation).`);
  };

const filteredUsers = allUsers
  .filter((user) => {
    const fullName = `${user.prenom} ${user.nom}`.toLowerCase();
    const matchName = fullName.includes(search.toLowerCase());

    const date = new Date(user.inscription);
    const matchDate = selectedDate ? date.toDateString() === selectedDate.toDateString() : true;

    return matchName && matchDate;
  })
  .sort((a, b) => new Date(b.inscription) - new Date(a.inscription));

const visibleUsers = showAll ? filteredUsers : filteredUsers.slice(0, 3);
const filteredParticipants = allUsers.filter(
  (u) => u.role === 'participant'
).sort((a, b) => new Date(b.inscription) - new Date(a.inscription));

  return (
    <AppLayout title="Profils des membres organisateurs">
      <Head title="Organisateurs" />
      <div className="p-6 bg-white text-[#1B1B18] space-y-10">
        <h1 className="text-3xl font-bold mb-4">Profils des organisateurs</h1>

       {/* Filtres + recherche */}
<div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6">
  <input
    type="text"
    placeholder="Rechercher par prénom ou nom..."
    className="w-full sm:w-1/2 px-4 py-2 border rounded shadow-sm focus:outline-none focus:ring focus:border-blue-300"
    value={search}
    onChange={(e) => setSearch(e.target.value)}
  />

  <div className="flex flex-col">
    <DatePicker
      id="datepicker"
      selected={selectedDate}
      onChange={(date) => setSelectedDate(date)}
      placeholderText="Date d'inscription..."
      className="px-3 py-2 border rounded shadow-sm"
      dateFormat="yyyy-MM-dd"
      isClearable
    />
  </div>
</div>


        {/* Tableau utilisateurs */}
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
              {visibleUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50 transition">
                  <td className="px-4 py-3">
                    <img src={user.photo} alt={user.nom} className="w-10 h-10 rounded-full object-cover" />
                  </td>
                  <td className="px-4 py-3 font-medium text-gray-900">{user.prenom}</td>
                  <td className="px-4 py-3 text-gray-700">{user.nom}</td>
                  <td className="px-4 py-3 text-gray-500">{user.email || '—'}</td>
                  <td className="px-4 py-3">
                    {user.verifie ? (
                      <>
                        <span className="text-green-600 font-semibold">Oui</span>
                        <button
                          onClick={() => {
                            setSelectedUser(user);
                            setShowModal(true);
                          }}
                          className="ml-3 text-sm text-blue-600 underline hover:text-blue-800"
                        >
                          Voir
                        </button>
                      </>
                    ) : (
                      <span className="text-red-500 font-semibold">Non</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-gray-500">{user.inscription}</td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => handleDelete(user.id)}
                      className="text-red-600 hover:text-red-800 text-sm flex items-center gap-1"
                    >
                      <Trash2 className="w-4 h-4" />
                      Supprimer
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Voir plus / moins */}
        {filteredUsers.length > 3 && (
          <div className="text-center mt-6">
            <button
              onClick={() => {
                if (showAll) {
                  setSearch('');
                  setSelectedMonth('');
                  setSelectedYear('');
                }
                setShowAll(!showAll);
              }}
              className="text-blue-600 font-medium hover:underline"
            >
              {showAll ? 'Voir moins' : 'Voir plus'}
            </button>
          </div>
        )}

        {/* Section Participants */}
<div className="mt-16">
  <h2 className="text-2xl font-bold mb-4">Profils des participants</h2>
  {filteredParticipants.length === 0 ? (
    <p className="text-gray-500">Aucun participant à afficher.</p>
  ) : (
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
          {filteredParticipants.map((user) => (
            <tr key={user.id} className="hover:bg-gray-50 transition">
              <td className="px-4 py-3">
                <img src={user.photo} alt={user.nom} className="w-10 h-10 rounded-full object-cover" />
              </td>
              <td className="px-4 py-3 font-medium text-gray-900">{user.prenom}</td>
              <td className="px-4 py-3 text-gray-700">{user.nom}</td>
              <td className="px-4 py-3 text-gray-500">{user.email || '—'}</td>
              <td className="px-4 py-3">
                <span className="text-yellow-600 font-semibold capitalize">{user.verifie}</span>
              </td>
              <td className="px-4 py-3 text-gray-500">{user.inscription}</td>
              <td className="px-4 py-3 text-right">
                <button
                  onClick={() => handleDelete(user.id)}
                  className="text-red-600 hover:text-red-800 text-sm flex items-center gap-1"
                >
                  <Trash2 className="w-4 h-4" />
                  Supprimer
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )}
</div>


        {/* Modale de document */}
        {showModal && selectedUser && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
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
                src={selectedUser.document || '/documents/demo-doc.png'}
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
