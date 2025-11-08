import AppLayout from '@/layouts/app-layout';
import { Head, useForm, usePage, router } from '@inertiajs/react';
import { useEffect, useMemo, useRef, useState } from 'react';

export default function Annonces() {
  const { props } = usePage();
  const activitiesProp = Array.isArray(props?.activities) ? props.activities : [];

  const [showForm, setShowForm] = useState(false);
  const [annonces, setAnnonces] = useState([]);
  const [cityOptions, setCityOptions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchAbortRef = useRef(null);

  useEffect(() => setAnnonces(activitiesProp), [activitiesProp]);

  const { data, setData, post, processing, errors, reset, clearErrors } = useForm({
    title: '',
    location: '',
    latitude: '',     
    longitude: '',
    participants: 1,
    date: '',
    description: '',
    why: '',
    image: null,
  });

  const canSubmit = useMemo(
    () =>
      data.title.trim() &&
      data.location.trim() &&
      data.description.trim() &&
      data.why.trim() &&
      String(data.latitude).length > 0 &&
      String(data.longitude).length > 0,
    [data]
  );

  // --- Recherche de villes (depuis /cities/search)
  const searchCities = (q) => {
    const query = q?.trim();
    if (searchAbortRef.current) searchAbortRef.current.abort();
    const ctrl = new AbortController();
    searchAbortRef.current = ctrl;
    if (!query || query.length < 2) {
      setCityOptions([]);
      return;
    }

    fetch(`/cities/search?q=${encodeURIComponent(query)}`, { signal: ctrl.signal })
      .then((r) => (r.ok ? r.json() : []))
      .then((list) => setCityOptions(Array.isArray(list) ? list : []))
      .catch(() => {});
  };

  const handleSelectCity = (o) => {
    setData('location', o.label);
    setData('latitude', o.lat);
    setData('longitude', o.lng);
    setShowSuggestions(false);
  };

  useEffect(() => {
    const t = setTimeout(() => {
      searchCities(data.location);
      setShowSuggestions(!!data.location && data.location.trim().length >= 2);
    }, 200);
    return () => clearTimeout(t);
  }, [data.location]);

  // ✅ Envoi en FormData géré par Inertia grâce à forceFormData:true
  const submit = (e) => {
    e.preventDefault();
    post(route('activities.store'), {
      forceFormData: true,
      onSuccess: () => {
        reset();
        clearErrors();
        setShowForm(false);
        router.reload({ only: ['activities'] });
      },
    });
  };

  const handleDelete = (id) => {
    if (!confirm('Voulez-vous vraiment supprimer cette annonce ?')) return;
    router.delete(route('activities.destroy', id), {
      onSuccess: () => {
        setAnnonces((prev) => prev.filter((a) => a.id !== id));
        router.reload({ only: ['activities'] });
      },
    });
  };

  const handleEdit = (id) => router.visit(route('activities.edit', id));

  // ✅ Format date robuste
  const formatDate = (d) => {
    if (!d) return '';
    if (/^\d{4}-\d{2}-\d{2}$/.test(d)) return d; // déjà ISO
    const t = Date.parse(d);
    if (Number.isNaN(t)) return '';
    const dt = new Date(t);
    return `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, '0')}-${String(
      dt.getDate()
    ).padStart(2, '0')}`;
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
                setCityOptions([]);
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
                  className="w-full border px-3 py-2 rounded text-sm"
                  value={data.title}
                  onChange={(e) => setData('title', e.target.value)}
                  required
                />
                {errors.title && <p className="text-red-600 text-xs mt-1">{errors.title}</p>}
              </div>

              {/* LIEU = auto-complétion + remplissage lat/lng (cachés) */}
              <div className="relative">
                <label className="block text-sm font-medium mb-1">Lieu</label>
                <input
                  type="text"
                  autoComplete="off"
                  className="w-full border px-3 py-2 rounded text-sm"
                  value={data.location}
                  onChange={(e) => setData('location', e.target.value)}
                  onFocus={() => {
                    if ((data.location || '').trim().length >= 2) setShowSuggestions(true);
                  }}
                  required
                />
                {showSuggestions && cityOptions.length > 0 && (
                  <div className="absolute z-50 mt-1 w-full bg-white border rounded shadow max-h-60 overflow-auto">
                    {cityOptions.map((o) => (
                      <button
                        key={o.id}
                        type="button"
                        onClick={() => handleSelectCity(o)}
                        className="w-full text-left px-3 py-2 hover:bg-gray-100 text-sm"
                      >
                        {o.label}
                      </button>
                    ))}
                  </div>
                )}
                {/* champs cachés envoyés au back */}
                <input type="hidden" value={data.latitude} readOnly />
                <input type="hidden" value={data.longitude} readOnly />
                {errors.location && <p className="text-red-600 text-xs mt-1">{errors.location}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Date</label>
                <input
                  type="date"
                  className="w-full border px-3 py-2 rounded text-sm"
                  value={data.date}
                  onChange={(e) => setData('date', e.target.value)}
                />
                {errors.date && <p className="text-red-600 text-xs mt-1">{errors.date}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Image (optionnel)</label>
                <input
                  type="file"
                  name="image"
                  accept="image/*"
                  className="w-full text-sm"
                  onChange={(e) => setData('image', e.target.files?.[0] ?? null)}
                />
                {errors.image && <p className="text-red-600 text-xs mt-1">{errors.image}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Nombre de personnes</label>
                <input
                  type="number"
                  min={1}
                  max={100}
                  className="w-full border px-3 py-2 rounded text-sm"
                  value={data.participants}
                  onChange={(e) => setData('participants', Number(e.target.value))}
                  required
                />
                {errors.participants && (
                  <p className="text-red-600 text-xs mt-1">{errors.participants}</p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Description</label>
              <textarea
                rows="3"
                className="w-full border px-3 py-2 rounded text-sm"
                value={data.description}
                onChange={(e) => setData('description', e.target.value)}
                required
              />
              {errors.description && (
                <p className="text-red-600 text-xs mt-1">{errors.description}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Pourquoi</label>
              <textarea
                rows="3"
                className="w-full border px-3 py-2 rounded text-sm"
                value={data.why}
                onChange={(e) => setData('why', e.target.value)}
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
                  setCityOptions([]);
                }}
                className="text-sm px-3 py-2 rounded border hover:bg-gray-50"
              >
                Annuler
              </button>
            </div>
          </form>
        )}

        {/* Liste */}
        {annonces.length === 0 ? (
          <p className="text-gray-500 text-sm">Aucune annonce pour le moment.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {annonces.map((a) => {
              const img = a.image_url || (a.image ? `/storage/${a.image}` : null);
              return (
                <div key={a.id} className="bg-white rounded shadow-sm border overflow-hidden flex flex-col">
                  {img && <img src={img} alt={a.title} className="w-full h-44 object-cover" />}
                  <div className="p-4 flex flex-col gap-2 flex-1">
                    <div className="space-y-1">
                      <h2 className="font-semibold text-lg">{a.title}</h2>
                      <p className="text-sm text-gray-600">
                        {a.location} — {formatDate(a.date)}
                      </p>
                      {a.description && <p className="text-sm">{a.description}</p>}
                    </div>
                    <div className="mt-auto flex justify-end gap-3 pt-2">
                      <button onClick={() => handleEdit(a.id)} className="text-blue-600 hover:underline text-sm">
                        Modifier
                      </button>
                      <button onClick={() => handleDelete(a.id)} className="text-red-600 hover:underline text-sm">
                        Supprimer
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
