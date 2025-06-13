import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';
import { useState } from 'react';

// 🔽 Imports des images
import poterie from '@/assets/images/poterie.png';
import picnique from '@/assets/images/picnique.png';

export default function Annonces() {
  const [annonces, setAnnonces] = useState([
    {
      id: 1,
      title: 'Atelier poterie',
      location: 'Mandelieu-la-Napoule',
      date: '25-07-2025',
      description: 'Un atelier créatif au bord de la mer pour découvrir la poterie.',
      image: poterie,
    },
    {
      id: 2,
      title: 'Pique-nique bord de mer',
      location: 'Théoule-sur-Mer',
      date: '28-07-2025',
      description: 'Partage d’un moment convivial autour d’un pique-nique au soleil.',
      image: picnique,
    },
  ]);

  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    location: '',
    date: '',
    description: '',
    image: null,
  });

  const handleInput = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setFormData({ ...formData, image: url });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newAnnonce = {
      ...formData,
      id: annonces.length + 1,
    };
    setAnnonces([...annonces, newAnnonce]);
    setFormData({
      title: '',
      location: '',
      date: '',
      description: '',
      image: null,
    });
    setShowForm(false);
  };

  return (
    <AppLayout>
      <Head title="Mes annonces" />
      <div className="p-6 max-w-4xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-semibold">Mes annonces</h1>
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 text-sm"
          >
            {showForm ? 'Annuler' : 'Créer une annonce'}
          </button>
        </div>

        {/* Formulaire de création */}
        {showForm && (
          <form onSubmit={handleSubmit} className="bg-gray-50 p-4 rounded space-y-4 border">
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInput}
              placeholder="Titre de l’activité"
              className="w-full border px-4 py-2 rounded text-sm"
              required
            />
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleInput}
              placeholder="Lieu"
              className="w-full border px-4 py-2 rounded text-sm"
              required
            />
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleInput}
              className="w-full border px-4 py-2 rounded text-sm"
              required
            />
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInput}
              placeholder="Description de l'activité"
              rows="3"
              className="w-full border px-4 py-2 rounded text-sm"
              required
            ></textarea>

            {/* Ajout de l’image */}
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="w-full text-sm"
            />

            <button
              type="submit"
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 text-sm"
            >
              Publier l'annonce
            </button>
          </form>
        )}

       {/* Liste des annonces */}
{annonces.length === 0 ? (
  <p className="text-gray-500 text-sm">Aucune annonce pour le moment.</p>
) : (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
    {annonces.map((annonce) => (
      <div
        key={annonce.id}
        className="bg-white rounded shadow overflow-hidden flex flex-col justify-between"
      >
        {annonce.image && (
          <img
            src={annonce.image}
            alt={annonce.title}
            className="w-full h-48 object-cover"
          />
        )}
        <div className="p-4 flex flex-col flex-grow justify-between h-full">
          <div className="space-y-1">
            <h2 className="font-semibold text-lg">{annonce.title}</h2>
            <p className="text-sm text-gray-600">
              {annonce.location} – {annonce.date}
            </p>
            <p className="text-sm">{annonce.description}</p>
          </div>

          {/* ✅ Bouton supprimer aligné à droite */}
          <div className="flex justify-end mt-4">
            <button
              onClick={() =>
                setAnnonces(annonces.filter((a) => a.id !== annonce.id))
              }
              className="text-red-500 text-sm hover:underline"
            >
              Supprimer
            </button>
          </div>
        </div>
      </div>
    ))}
  </div>
)}
      </div>
    </AppLayout>
  );
}
