
import AppLayout from '@/layouts/app-layout';
import { Head, useForm } from '@inertiajs/react';
import React, { useEffect, useRef, useState } from 'react';

export default function AnnoncesCreate() {
  // useForm pour piloter les champs + erreurs + POST
  const { data, setData, post, processing, errors, reset } = useForm({
    title: '',
    location: '',
    latitude: '',
    longitude: '',
    participants: 1,
    date: '',
    description: '',
    image: null,
  });

  // Autocomplete de villes (mêmes mécaniques que sur Annonces.jsx)
  const [cityOptions, setCityOptions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchAbortRef = useRef(null);

  const searchCities = (q) => {
    const query = q?.trim();
    if (searchAbortRef.current) searchAbortRef.current.abort();
    const ctrl = new AbortController(); searchAbortRef.current = ctrl;
    if (!query || query.length < 2) { setCityOptions([]); return; }
    fetch(`/cities/search?q=${encodeURIComponent(query)}`, { signal: ctrl.signal })
      .then(r => r.ok ? r.json() : [])
      .then(list => setCityOptions(Array.isArray(list) ? list : []))
      .catch(()=>{});
  };

  // Délai de 200 ms avant de lancer la recherche (évite d’appeler l’API à chaque frappe)
  useEffect(() => {
    const t = setTimeout(() => {
      searchCities(data.location);
      setShowSuggestions(!!data.location && data.location.trim().length >= 2);
    }, 200);
    return () => clearTimeout(t);
  }, [data.location]);

  // Remplissage location + lat/lng depuis une suggestion
  const handleSelectCity = (o) => {
    setData('location', o.label);
    setData('latitude', o.lat);
    setData('longitude', o.lng);
    setShowSuggestions(false);
  };

  // Envoi multipart avec forceFormData
  const submit = (e) => {
    e.preventDefault();
    post(route('activities.store'), {
      forceFormData: true,
      onSuccess: () => {
        // Je remets tous les champs à zéro
        reset('title','location','latitude','longitude','participants','date','description','image');
      },
    });
  };

  return (
    <AppLayout>
      <Head title="Créer une annonce" />
      <div className="max-w-3xl mx-auto p-6 space-y-6">
        <h1 className="text-2xl font-semibold">Créer une annonce</h1>

        <form onSubmit={submit} className="bg-white border rounded p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Titre</label>
            <input className="w-full border px-3 py-2 rounded text-sm"
              value={data.title} onChange={e=>setData('title', e.target.value)} required />
            {errors.title && <p className="text-red-600 text-sm">{errors.title}</p>}
          </div>

          {/* Lieu avec suggestions + lat/lng cachés */}
          <div className="relative">
            <label className="block text-sm font-medium mb-1">Lieu (Ville / Pays)</label>
            <input
              className="w-full border px-3 py-2 rounded text-sm"
              value={data.location}
              onChange={e=>setData('location', e.target.value)}
              onFocus={()=>{ if ((data.location||'').trim().length>=2) setShowSuggestions(true); }}
              required
            />
            {showSuggestions && cityOptions.length>0 && (
              <div className="absolute z-50 mt-1 w-full bg-white border rounded shadow max-h-60 overflow-auto">
                {cityOptions.map(o=>(
                  <button key={o.id} type="button"
                    className="w-full text-left px-3 py-2 hover:bg-gray-100 text-sm"
                    onClick={()=>handleSelectCity(o)}>
                    {o.label}
                  </button>
                ))}
              </div>
            )}
            {/* cachés */}
            <input type="hidden" value={data.latitude} readOnly />
            <input type="hidden" value={data.longitude} readOnly />
            {errors.location && <p className="text-red-600 text-sm">{errors.location}</p>}
          </div>

          {/* Participants */}
          <div>
            <label className="block text-sm font-medium mb-1">Nombre de personnes</label>
            <input
              type="number" min={1} max={100}
              className="w-full border px-3 py-2 rounded text-sm"
              value={data.participants}
              onChange={e=>setData('participants', Number(e.target.value))}
              required
            />
            {errors.participants && <p className="text-red-600 text-sm">{errors.participants}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Date</label>
            <input type="date" className="w-full border px-3 py-2 rounded text-sm"
              value={data.date || ''} onChange={e=>setData('date', e.target.value)} />
            {errors.date && <p className="text-red-600 text-sm">{errors.date}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea className="w-full border px-3 py-2 rounded text-sm"
              value={data.description} onChange={e=>setData('description', e.target.value)}
              rows={3} required />
            {errors.description && <p className="text-red-600 text-sm">{errors.description}</p>}
          </div>

          <div>
            <textarea className="w-full border px-3 py-2 rounded text-sm"/>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Image (optionnel)</label>
            <input type="file" accept="image/*" onChange={e=>setData('image', e.target.files?.[0] || null)}
              className="w-full text-sm" />
            {errors.image && <p className="text-red-600 text-sm">{errors.image}</p>}
          </div>

          <div className="flex justify-end">
            <button type="submit" disabled={processing}
              className="bg-green-600 text-white px-4 py-2 rounded text-sm disabled:opacity-50">
              Publier l'annonce
            </button>
          </div>
        </form>
      </div>
    </AppLayout>
  );
}
