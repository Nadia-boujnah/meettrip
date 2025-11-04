import AppLayout from '@/layouts/app-layout';
import { Head, useForm, usePage, router } from '@inertiajs/react';
import { useEffect, useMemo, useState } from 'react';

export default function Annonces() {
  // Récupère les annonces passées par Inertia (ActivitiesConnectedController::myAnnonces)
  const { props } = usePage();
  const activitiesProp = Array.isArray(props?.activities) ? props.activities : [];

  const [showForm, setShowForm] = useState(false);
  const [annonces, setAnnonces] = useState([]);

  useEffect(() => {
    setAnnonces(activitiesProp);
  }, [activitiesProp]);

  // Formulaire de création
  const { data, setData, post, processing, errors, reset, clearErrors } = useForm({
    title: '',
    location: '',
    date: '',
    description: '',
    why: '',
    image: null,
  });

  const canSubmit = useMemo(() => {
    return data.title.trim() && data.location.trim() && data.date && data.description.trim() && data.why.trim();
  }, [data]);

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
        clearErrors();
        setShowForm(false);
        // recharge uniquement la prop "activities" pour mettre à jour la liste
        router.reload({ only: ['activities'] });
      },
    });
  };

  const handleDelete = (id) => {
    if (confirm('Voulez-vous vraiment supprimer cette annonce ?')) {
      router.delete(route('activities.destroy', id), {
        onSuccess: () => {
          // Optimiste + reload pour rester synchro avec le back
          setAnnonces((prev) => prev.filter((a) => a.id !== id));
          router.reload({ only: ['activities'] });
        },
      });
    }
  };

  const handleEdit = (id) => {
    router.visit(route('activities.edit', id));
  };

  // Helper d'affichage date (YYYY-MM-DD ou string). On reste simple.
  const formatDate = (d) => {
    if (!d) return '';
    // si c'est déjà au bon format
    if (/^\d{4}-\d{2}-\d{2}/.test(d)) return d;
    try {
      const dt = new Date(d);
      const y = dt.getFullYear();
      const m = String(dt.getMonth() + 1).padStart(2, '0');
      const day = String(dt.getDate()).padStart(2, '0');
      return `${y}-${m}-${day}`;
    } catch {
      return d;
    }
  };

  return (
    <AppLayout>
      <Head title="Mes annonces" />
      <div className="p-6 max-w-5xl mx-auto space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h1 className="text-2xl font-semibold">Mes annonces</h1>
          <button
            onClick={() => {
              setShowForm((v) => !v);
              if (showForm) {
                reset();
                clearErrors();
              }
            }}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 text-sm"
          >
            {showForm ? 'Annuler' : 'Créer une annonce'}
          </button>
        </div>

        {showForm && (
          <form onSubmit={submit} className="bg-white border rounded p-4 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Titre</label>
                <input
                  type="text"
                  name="title"
                  value={data.title}
                  onChange={(e) => setData('title', e.target.value)}
                  placeholder="Titre de l’activité"
                  className="w-full border px-3 py-2 rounded text-sm"
                  required
                />
                {errors.title && <p className="text-red-600 text-xs mt-1">{errors.title}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Lieu</label>
                <input
                  type="text"
                  name="location"
                  value={data.location}
                  onChange={(e) => setData('location', e.target.value)}
                  placeholder="Ville / Pays"
                  className="w-full border px-3 py-2 rounded text-sm"
                  required
                />
                {errors.location && <p className="text-red-600 text-xs mt-1">{errors.location}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Date</label>
                <input
                  type="date"
                  name="date"
                  value={data.date}
                  onChange={(e) => setData('date', e.target.value)}
                  className="w-full border px-3 py-2 rounded text-sm"
                  required
                />
                {errors.date && <p className="text-red-600 text-xs mt-1">{errors.date}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Image (optionnel)</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setData('image', e.target.files?.[0] ?? null)}
                  className="w-full text-sm"
                />
                {errors.image && <p className="text-red-600 text-xs mt-1">{errors.image}</p>}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Description</label>
              <textarea
                name="description"
                value={data.description}
                onChange={(e) => setData('description', e.target.value)}
                placeholder="Décris ton activité…"
                rows="3"
                className="w-full border px-3 py-2 rounded text-sm"
                required
              />
              {errors.description && <p className="text-red-600 text-xs mt-1">{errors.description}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Pourquoi</label>
              <textarea
                name="why"
                value={data.why}
                onChange={(e) => setData('why', e.target.value)}
                placeholder="Pourquoi tu proposes cette activité ?"
                rows="3"
                className="w-full border px-3 py-2 rounded text-sm"
                required
              />
              {errors.why && <p className="text-red-600 text-xs mt-1">{errors.why}</p>}
            </div>

            <div className="flex items-center gap-3">
              <button
                type="submit"
                disabled={processing || !canSubmit}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 text-sm disabled:opacity-60"
              >
                {processing ? 'Publication…' : 'Publier l’annonce'}
              </button>
              <button
                type="button"
                onClick={() => {
                  reset();
                  clearErrors();
                  setShowForm(false);
                }}
                className="text-sm px-3 py-2 rounded border hover:bg-gray-50"
              >
                Annuler
              </button>
            </div>
          </form>
        )}

        {annonces.length === 0 ? (
          <p className="text-gray-500 text-sm">Aucune annonce pour le moment.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {annonces.map((annonce) => (
              <div
                key={annonce.id}
                className="bg-white rounded shadow-sm border overflow-hidden flex flex-col"
              >
                {annonce.image && (
                  <img
                    src={
                      String(annonce.image).startsWith('http')
                        ? annonce.image
                        : `/storage/${annonce.image}`
                    }
                    alt={annonce.title}
                    className="w-full h-44 object-cover"
                  />
                )}

                <div className="p-4 flex flex-col gap-2 flex-1">
                  <div className="space-y-1">
                    <h2 className="font-semibold text-lg">{annonce.title}</h2>
                    <p className="text-sm text-gray-600">
                      {annonce.location} — {formatDate(annonce.date)}
                    </p>
                    {annonce.description && (
                      <p className="text-sm">{annonce.description}</p>
                    )}
                  </div>

                  <div className="mt-auto flex justify-end gap-3 pt-2">
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
