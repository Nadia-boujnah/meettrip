import AppLayout from '@/layouts/app-layout';
import { Head, useForm, usePage } from '@inertiajs/react';
import { useEffect, useRef, useState } from 'react';

// === Helper placé AVANT toute utilisation ===
// Normalise différentes syntaxes de dates en yyyy-MM-dd (compatible <input type="date">)
const toISODate = (val) => {
  if (!val) return '';
  if (/^\d{4}-\d{2}-\d{2}$/.test(val)) return val;            // yyyy-MM-dd
  const dmy = val.match(/^(\d{2})[\/-](\d{2})[\/-](\d{4})$/);  // dd/mm/yyyy ou dd-mm-yyyy
  if (dmy) {
    const [, dd, mm, yyyy] = dmy;
    return `${yyyy}-${mm.padStart(2,'0')}-${dd.padStart(2,'0')}`;
  }
  const mdy = val.match(/^(\d{1,2})[\/-](\d{1,2})[\/-](\d{4})$/); // mm/dd/yyyy
  if (mdy) {
    const mm = mdy[1].padStart(2,'0');
    const dd = mdy[2].padStart(2,'0');
    const yyyy = mdy[3];
    return `${yyyy}-${mm}-${dd}`;
  }
  if (/^\d{4}-\d{2}-\d{2}T/.test(val)) return val.slice(0, 10); // ISO avec temps
  const d = new Date(val);
  if (!isNaN(d)) {
    const local = new Date(d.getTime() - d.getTimezoneOffset() * 60000);
    return local.toISOString().slice(0, 10);
  }
  return '';
};

export default function AnnoncesEdit() {
  // L’activité à éditer vient des props Inertia
  const { activity } = usePage().props;

  // Je prépare useForm avec les valeurs existantes de l’activité
  // et j’utilise transform pour envoyer une méthode PUT (override _method)
  const { data, setData, post, transform, processing, errors } = useForm({
    title: activity.title ?? '',
    location: activity.location ?? '',
    latitude: activity.latitude ?? '',
    longitude: activity.longitude ?? '',
    participants: activity.participants ?? 1,
    date: toISODate(activity.date ?? ''), // ← normalisé pour l’input type="date"
    description: activity.description ?? '',
    image: null,
  });

  // Autocomplete villes
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

  useEffect(() => {
    const t = setTimeout(() => {
      searchCities(data.location);
      setShowSuggestions(!!data.location && data.location.trim().length >= 2);
    }, 200);
    return () => clearTimeout(t);
  }, [data.location]);

  const handleSelectCity = (o) => {
    setData('location', o.label);
    setData('latitude', o.lat);
    setData('longitude', o.lng);
    setShowSuggestions(false);
  };

  // Envoi multipart en POST + override PUT via transform
  const submit = (e) => {
    e.preventDefault();
    //  multipart + PUT => on envoie en POST avec _method: 'put'
    transform((d) => ({ ...d, _method: 'put' }));
    post(route('activities.update', activity.id), {
      forceFormData: true,
      preserveScroll: true,
      onFinish: () => transform((d) => d), // je réinitialise transform après l’envoi
    });
  };

  return (
    <AppLayout>
      <Head title="Modifier l'annonce" />
      <div className="max-w-3xl mx-auto p-6 space-y-6">
        <h1 className="text-2xl font-semibold">Modifier l’annonce</h1>

        {/* Aperçu de l’image actuelle si disponible */}
        {activity.image_url && (
          <img src={activity.image_url} alt={activity.title} className="w-full h-48 object-cover rounded" />
        )}

        <form onSubmit={submit} className="bg-white shadow rounded p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Titre</label>
            <input className="w-full border px-3 py-2 rounded"
              value={data.title} onChange={e=>setData('title', e.target.value)} />
            {errors.title && <p className="text-red-600 text-sm">{errors.title}</p>}
          </div>

          {/* Lieu + suggestions */}
          <div className="relative">
            <label className="block text-sm font-medium mb-1">Lieu</label>
            <input
              className="w-full border px-3 py-2 rounded"
              value={data.location}
              onChange={e=>setData('location', e.target.value)}
              onFocus={()=>{ if ((data.location||'').trim().length>=2) setShowSuggestions(true); }}
              required
            />
            {showSuggestions && cityOptions.length>0 && (
              <div className="absolute z-50 mt-1 w-full bg-white border rounded shadow max-h-60 overflow-auto">
                {cityOptions.map(o=>(
                  <button key={o.id} type="button" className="w-full text-left px-3 py-2 hover:bg-gray-100 text-sm"
                    onClick={()=>handleSelectCity(o)}>
                    {o.label}
                  </button>
                ))}
              </div>
            )}
            <input type="hidden" value={data.latitude} readOnly />
            <input type="hidden" value={data.longitude} readOnly />
            {errors.location && <p className="text-red-600 text-sm">{errors.location}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Nombre de personnes</label>
            <input
              type="number" min={1} max={100}
              className="w-full border px-3 py-2 rounded"
              value={data.participants}
              onChange={e=>setData('participants', Number(e.target.value))}
              required
            />
            {errors.participants && <p className="text-red-600 text-sm">{errors.participants}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Date</label>
            <input
              type="date"
              className="w-full border px-3 py-2 rounded"
              value={toISODate(data.date) || ''}               // je force l’ISO court dans l’input
              onChange={(e) => setData('date', toISODate(e.target.value))} // et je normalise à la saisie
            />
            {errors.date && <p className="text-red-600 text-sm">{errors.date}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea className="w-full border px-3 py-2 rounded"
              value={data.description} onChange={e=>setData('description', e.target.value)} />
            {errors.description && <p className="text-red-600 text-sm">{errors.description}</p>}
          </div>

          <div>
            <textarea className="w-full border px-3 py-2 rounded"/>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Nouvelle image (optionnel)</label>
            <input type="file" name="image" accept="image/*"
              onChange={(e)=>setData('image', e.target.files?.[0] || null)} />
            {errors.image && <p className="text-red-600 text-sm">{errors.image}</p>}
          </div>

          <button type="submit" disabled={processing}
            className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50">
            Enregistrer
          </button>
        </form>
      </div>
    </AppLayout>
  );
}
