import GuestLayout from '@/Layouts/GuestLayout';
import { Link } from '@inertiajs/react';

export default function Activities() {
  return (
    <GuestLayout>
      <div className="bg-[#FFFCF9] text-[#1B1B18] py-16 px-6 max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-12">Toutes les Activités</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Exemple d'activité */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <img src="https://source.unsplash.com/featured/?adventure,travel" alt="Activité" className="h-48 w-full object-cover" />
            <div className="p-6">
              <h2 className="font-semibold text-xl mb-2">Aventure en Montagne</h2>
              <p className="text-gray-600 mb-4">Participez à une randonnée exceptionnelle entre voyageurs.</p>
              <Link href="#" className="bg-black text-white px-4 py-2 rounded-md">Voir Détail</Link>
            </div>
          </div>

          {/* D'autres cartes d'activités ici */}
        </div>
      </div>
    </GuestLayout>
  );
}
