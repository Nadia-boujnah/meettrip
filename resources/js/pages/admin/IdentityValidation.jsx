import AppLayout from '@/Layouts/app-Layout';
import { Head } from '@inertiajs/react';
import { allUsers } from '@/data/users';
import { useState } from 'react';
import { CheckCircle, XCircle, Eye } from 'lucide-react';

export default function IdentityValidation() {
  const [selectedUser, setSelectedUser] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const participants = allUsers.filter(
    (u) => u.role === 'participant' && u.verifie === 'en attente'
  );

  const handleValidate = (id) => {
    alert(`Identité validée pour l'utilisateur ID : ${id}`);
    // TODO : envoyer requête Inertia/Laravel
  };

  const handleReject = (id) => {
    alert(`Identité refusée pour l'utilisateur ID : ${id}`);
    // TODO : envoyer requête Inertia/Laravel
  };

  return (
    <AppLayout title="Validation des identités">
      <Head title="Validation des identités" />
      <div className="p-6 bg-white text-[#1B1B18]">
        <h1 className="text-3xl font-bold mb-6">Identités à valider</h1>

        {participants.length === 0 ? (
          <p className="text-gray-500">Aucune identité à valider pour le moment.</p>
        ) : (
          <div className="overflow-x-auto rounded-lg border border-gray-200">
            <table className="min-w-full divide-y divide-gray-200 text-sm">
              <thead className="bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase">
                <tr>
                  <th className="px-4 py-3">Photo</th>
                  <th className="px-4 py-3">Prénom</th>
                  <th className="px-4 py-3">Nom</th>
                  <th className="px-4 py-3">Lieu</th>
                  <th className="px-4 py-3">Inscription</th>
                  <th className="px-4 py-3">Document</th>
                  <th className="px-4 py-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {participants.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50 transition">
                    <td className="px-4 py-3">
                      <img
                        src={user.photo}
                        alt={user.nom}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                    </td>
                    <td className="px-4 py-3 font-medium text-gray-900">{user.prenom}</td>
                    <td className="px-4 py-3 text-gray-700">{user.nom}</td>
                    <td className="px-4 py-3 text-gray-500">{user.location}</td>
                    <td className="px-4 py-3 text-gray-500">{user.inscription}</td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => {
                          setSelectedUser(user);
                          setShowModal(true);
                        }}
                        className="text-blue-600 hover:underline text-sm flex items-center gap-1"
                      >
                        <Eye className="w-4 h-4" />
                        Voir
                      </button>
                    </td>
                    <td className="px-4 py-3 text-right flex gap-2 justify-end">
                      <button
                        onClick={() => handleValidate(user.id)}
                        className="bg-green-600 text-white text-sm px-3 py-1 rounded hover:bg-green-700 flex items-center gap-1"
                      >
                        <CheckCircle className="w-4 h-4" />
                        Valider
                      </button>
                      <button
                        onClick={() => handleReject(user.id)}
                        className="bg-red-600 text-white text-sm px-3 py-1 rounded hover:bg-red-700 flex items-center gap-1"
                      >
                        <XCircle className="w-4 h-4" />
                        Refuser
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

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
                Document de {selectedUser.prenom} {selectedUser.nom}
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
