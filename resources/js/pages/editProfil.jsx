import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';
import { useState } from 'react';

export default function editProfil() {
  const [form, setForm] = useState({
    prenom: 'Nadia',
    nom: 'Boujnah',
    location: 'Cannes, France',
    bio: `Passionnée de voyages et de nouvelles rencontres.\nJ’aime découvrir de nouvelles spécialités et endroits.`,
    photo: null,
    pieceIdentite: null,
  });

  const [message, setMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simule l'enregistrement
    setMessage('✔️ Modifications enregistrées (simulées)');
    setTimeout(() => setMessage(''), 3000);
  };

  return (
    <AppLayout>
      <Head title="Modifier mon profil" />

      <div className="max-w-xl mx-auto px-4 py-8 space-y-6">
        <h1 className="text-2xl font-semibold text-center">Modifier mon Profil</h1>

        {message && (
          <div className="text-green-600 text-sm text-center font-medium">
            {message}
          </div>
        )}

        <form className="space-y-4" onSubmit={handleSubmit}>
          {/* Prénom et Nom */}
          <div className="flex gap-4">
            <input
              type="text"
              placeholder="Prénom"
              value={form.prenom}
              onChange={(e) => setForm({ ...form, prenom: e.target.value })}
              className="flex-1 p-2 border rounded"
            />
            <input
              type="text"
              placeholder="Nom"
              value={form.nom}
              onChange={(e) => setForm({ ...form, nom: e.target.value })}
              className="flex-1 p-2 border rounded"
            />
          </div>

          {/* Localisation */}
          <input
            type="text"
            placeholder="Localisation"
            value={form.location}
            onChange={(e) => setForm({ ...form, location: e.target.value })}
            className="w-full p-2 border rounded"
          />

          {/* Bio */}
          <textarea
            placeholder="À propos de moi"
            value={form.bio}
            onChange={(e) => setForm({ ...form, bio: e.target.value })}
            rows={4}
            className="w-full p-2 border rounded"
          />

          {/* Fichiers */}
          <div className="flex items-center gap-4">
            <label className="w-1/2 border rounded p-4 text-center cursor-pointer">
              📷 Joindre une photo
              <input
                type="file"
                className="hidden"
                onChange={(e) => setForm({ ...form, photo: e.target.files[0] })}
              />
            </label>
            <label className="w-1/2 border rounded p-4 text-center cursor-pointer">
              📄 Joindre une pièce d'identité
              <input
                type="file"
                className="hidden"
                onChange={(e) =>
                  setForm({ ...form, pieceIdentite: e.target.files[0] })
                }
              />
            </label>
          </div>

          {/* Bouton Enregistrer */}
          <div className="text-center pt-4">
            <button
              type="submit"
              className="px-6 py-2 rounded bg-blue-500 text-white hover:bg-blue-600 transition"
            >
              Enregistrer
            </button>
          </div>
        </form>
      </div>
    </AppLayout>
  );
}
