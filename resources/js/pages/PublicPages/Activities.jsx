import GuestLayout from '@/layouts/GuestLayout';
import { usePage, Link } from '@inertiajs/react';
import { useMemo, useState } from 'react';
import ActivityCard from '@/components/ActivityCard';

export default function Activities() {
  const { activities } = usePage().props;      // ← vient de la route
  const items = activities?.data ?? [];        // tableau paginé (Laravel)
  const [search, setSearch] = useState('');

  // Filtre côté client (simple et instantané)
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return items;
    return items.filter((a) =>
      (a.title || '').toLowerCase().includes(q) ||
      (a.location || '').toLowerCase().includes(q)
    );
  }, [items, search]);

  return (
    <GuestLayout>
      <div className="bg-white text-[#1B1B18] pt-8 pb-12 px-4 sm:px-6 max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-center tracking-tight mb-8">Activités</h1>

        {/* Barre de recherche */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-center mb-10">
          <input
            type="text"
            placeholder="Rechercher une activité..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full md:w-1/3 border border-gray-300 rounded-md px-4 py-2"
          />
          <select className="w-full md:w-auto border border-gray-300 rounded-md px-4 py-2">
            <option>Pays</option>
          </select>
          <select className="w-full md:w-auto border border-gray-300 rounded-md px-4 py-2">
            <option>Type d'activité...</option>
          </select>
        </div>

        {/* Grille d'activités (depuis la BDD) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((activity) => (
            <ActivityCard key={activity.id} activity={activity} />
          ))}
        </div>

        {/* Pagination serveur (liens Laravel) */}
        {activities?.links?.length > 0 && (
          <div className="flex justify-center mt-10 space-x-2 text-sm font-medium">
           {activities.links.map((link, i) => {
  // 📝 Traduction du texte des boutons Laravel
  const label =
    link.label.includes('Previous') ? 'Précédent' :
    link.label.includes('Next') ? 'Suivant' :
    link.label;

  return (
    <Link
      key={i}
      href={link.url || '#'}
      preserveScroll
      className={`px-3 py-1 rounded ${
        link.active ? 'bg-black text-white' : 'hover:underline text-black'
      } ${!link.url ? 'pointer-events-none text-gray-400' : ''}`}
      dangerouslySetInnerHTML={{ __html: label }}
    />
  );
})}

          </div>
        )}
      </div>
    </GuestLayout>
  );
}
