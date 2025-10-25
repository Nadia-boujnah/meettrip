import AppLayout from '@/layouts/app-layout';
import { Head, useForm, usePage, router } from '@inertiajs/react';
import { useState, useEffect } from 'react';

export default function Annonces() {
  const { activities } = usePage().props;

  const [showForm, setShowForm] = useState(false);
  const [annonces, setAnnonces] = useState([]);

  useEffect(() => {
    setAnnonces(activities);
  }, [activities]);

  const { data, setData, post, processing, errors, reset } = useForm({
    title: '',
    location: '',
    date: '',
    description: '',
    why: '',
    image: null,
  });

  const submit = (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('title', data.title);
    formData.append('location', data.location);
    formData.append('date', data.date);
    formData.append('description', data.description);
    formData.append('why', data.why);
    if (data.image) {
      formData.append('image', data.image);
    }

    post(route('activities.store'), {
      data: formData,
      forceFormData: true,
      onSuccess: () => {
        reset();
        setShowForm(false);
      },
    });
  };

  const handleDelete = (id) => {
    if (confirm('Voulez-vous vraiment supprimer cette annonce ?')) {
      router.delete(route('activities.destroy', id), {
        onSuccess: () => {
          setAnnonces((prev) => prev.filter((a) => a.id !== id));
        },
      });
    }
  };

  const handleEdit = (id) => {
    router.visit(route('activities.edit', id));
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

        {showForm && (
          <form onSubmit={submit} className="bg-gray-50 p-4 rounded space-y-4 border">
            <input
              type="text"
              name="title"
              value={data.title}
              onChange={(e) => setData('title', e.target.value)}
              placeholder="Titre de l’activité"
              className="w-full border px-4 py-2 rounded text-sm"
              required
            />
            <input
              type="text"
              name="location"
              value={data.location}
              onChange={(e) => setData('location', e.target.value)}
              placeholder="Lieu"
              className="w-full border px-4 py-2 rounded text-sm"
              required
            />
            <input
              type="date"
              name="date"
              value={data.date}
              onChange={(e) => setData('date', e.target.value)}
              className="w-full border px-4 py-2 rounded text-sm"
              required
            />
            <textarea
              name="description"
              value={data.description}
              onChange={(e) => setData('description', e.target.value)}
              placeholder="Description de l'activité"
              rows="3"
              className="w-full border px-4 py-2 rounded text-sm"
              required
            ></textarea>
            <textarea
              name="why"
              value={data.why}
              onChange={(e) => setData('why', e.target.value)}
              placeholder="Pourquoi"
              rows="3"
              className="w-full border px-4 py-2 rounded text-sm"
              required
            ></textarea>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setData('image', e.target.files[0])}
              className="w-full text-sm"
            />

            <button
              type="submit"
              disabled={processing}
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 text-sm"
            >
              Publier l'annonce
            </button>
          </form>
        )}

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
                    src={annonce.image.startsWith('http') ? annonce.image : `/storage/${annonce.image}`}
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

                  {/* Boutons Modifier / Supprimer */}
                  <div className="flex justify-end mt-4 space-x-2">
                    <button
                      onClick={() => handleEdit(annonce.id)}
                      className="text-blue-600 hover:underline text-sm"
                    >
                      Modifier
                    </button>
                    <button
                      onClick={() => handleDelete(annonce.id)}
                      className="text-red-600 hover:underline text-sm"
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
