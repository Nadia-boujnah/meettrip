import AppLayout from '@/layouts/app-layout.jsx';
import { Head, usePage, router } from '@inertiajs/react';
import { useMemo, useState } from 'react';
import { CheckCircle, XCircle, Eye } from 'lucide-react';

export default function IdentityValidation() {
  // Je récupère les utilisateurs à vérifier (participants) depuis Inertia
  // + les éventuels filtres côté back (pagination, tri, etc.)
  const { participants, filters } = usePage().props;

  /**
   * items
   * -> Si "participants" est un paginator, je prends participants.data
   * -> Sinon, je garde le tableau brut
   */
  const items = useMemo(
    () => (Array.isArray(participants) ? participants : (participants?.data ?? [])),
    [participants]
  );

  // États locaux :
  // - hiddenIds : liste temporaire d’utilisateurs masqués après action (optimistic UI)
  // - modalUser : utilisateur dont on affiche le document
  // - submittingId : empêche plusieurs actions simultanées sur le même utilisateur
  const [hiddenIds, setHiddenIds] = useState(new Set());
  const [modalUser, setModalUser] = useState(null);
  const [submittingId, setSubmittingId] = useState(null);

  // Masque un utilisateur localement (sans attendre la réponse serveur)
  const hideId = (id) =>
    setHiddenIds((prev) => {
      const next = new Set(prev);
      next.add(id);
      return next;
    });

  /**
   * handleValidate
   * -> Envoie une requête PATCH vers le back pour valider l’identité.
   *    Dès que c’est validé, je masque la ligne correspondante.
   */
  const handleValidate = (id) => {
    setSubmittingId(id);
    router.patch(route('admin.identity.approve', id), {}, {
      preserveScroll: true,
      onSuccess: () => hideId(id),
      onFinish:  () => setSubmittingId(null),
    });
  };

  /**
   * handleReject
   * -> Même logique que handleValidate, mais pour refuser une identité.
   */
  const handleReject = (id) => {
    setSubmittingId(id);
    router.patch(route('admin.identity.reject', id), {}, {
      preserveScroll: true,
      onSuccess: () => hideId(id),
      onFinish:  () => setSubmittingId(null),
    });
  };

  // Fonction de navigation entre les pages du paginator
  const goto = (url) => {
    if (!url) return;
    router.get(url, {}, { preserveScroll: true, preserveState: true });
  };

  return (
    <AppLayout title="Validation des identités">
      <Head title="Validation des identités" />

      <div className="p-6 bg-white text-[#1B1B18]">
        <h1 className="text-3xl font-bold mb-6">Identités à valider</h1>

        {/* Si la liste est vide ou que tous les utilisateurs ont été masqués */}
        {(!items || items.filter(u => !hiddenIds.has(u.id)).length === 0) ? (
          <p className="text-gray-500">Aucun utilisateur à afficher.</p>
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
                {/* J’affiche uniquement les utilisateurs non masqués */}
                {items.filter(u => !hiddenIds.has(u.id)).map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50 transition">
                    <td className="px-4 py-3">
                      <img
                        src={user.photo || '/storage/avatars/default.png'}
                        alt={`${user.prenom ?? ''} ${user.nom ?? ''}`}
                        className="w-10 h-10 rounded-full object-cover"
                        onError={(e) => { e.currentTarget.src = '/storage/avatars/default.png'; }}
                      />
                    </td>

                    <td className="px-4 py-3 font-medium text-gray-900">{user.prenom ?? '—'}</td>
                    <td className="px-4 py-3 text-gray-700">{user.nom ?? '—'}</td>
                    <td className="px-4 py-3 text-gray-500">{user.location ?? '—'}</td>
                    <td className="px-4 py-3 text-gray-500">{user.inscription ?? '—'}</td>

                    {/* Si un document est présent, j’affiche un bouton "Voir" qui ouvre la modale */}
                    <td className="px-4 py-3">
                      {user.document_url ? (
                        <button
                          onClick={() => setModalUser(user)}
                          className="text-blue-600 hover:underline text-sm inline-flex items-center gap-1"
                        >
                          <Eye className="w-4 h-4" /> Voir
                        </button>
                      ) : (
                        <span className="text-gray-400">—</span>
                      )}
                    </td>

                    {/* Boutons d’action : Valider ou Refuser */}
                    <td className="px-4 py-3">
                      <div className="flex gap-2 justify-end">
                        <button
                          onClick={() => handleValidate(user.id)}
                          disabled={submittingId === user.id}
                          className="bg-green-600 text-white text-sm px-3 py-1 rounded hover:bg-green-700 inline-flex items-center gap-1 disabled:opacity-60"
                        >
                          <CheckCircle className="w-4 h-4" /> Valider
                        </button>

                        <button
                          onClick={() => handleReject(user.id)}
                          disabled={submittingId === user.id}
                          className="bg-red-600 text-white text-sm px-3 py-1 rounded hover:bg-red-700 inline-flex items-center gap-1 disabled:opacity-60"
                        >
                          <XCircle className="w-4 h-4" /> Refuser
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Pagination des résultats si le backend renvoie des liens de pagination */}
            {participants?.links && (
              <div className="flex items-center gap-2 p-3">
                {participants.links.map((link, i) => (
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
        )}

        {/* Modale d’aperçu du document d’identité */}
        {modalUser && (
          <div
            className="fixed inset-0 bg-black/50 z-50 flex justify-center items-center"
            onClick={() => setModalUser(null)}
          >
            <div
              className="bg-white p-6 rounded-lg shadow-lg w-[90%] max-w-xl relative"
              onClick={(e)=>e.stopPropagation()}
            >
              <button
                onClick={() => setModalUser(null)}
                className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 text-xl"
              >
                &times;
              </button>
              <h2 className="text-xl font-bold mb-4">
                Document de {modalUser.prenom ?? ''} {modalUser.nom ?? ''}
              </h2>
              <img
                src={modalUser.document_url || '/documents/demo-doc.png'}
                alt="Document officiel"
                className="w-full h-auto rounded border"
                onError={(e) => { e.currentTarget.src = '/documents/demo-doc.png'; }}
              />
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
