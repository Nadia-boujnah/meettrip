import { Link } from '@inertiajs/react';
import GuestLayout from '@/Layouts/GuestLayout';

export default function Home() {
  return (
    <GuestLayout>
      <div className="bg-[#FFFCF9] text-[#1B1B18]">
        {/* Hero section */}
        <section className="relative h-[70vh] bg-cover bg-center" style={{ backgroundImage: `url('https://source.unsplash.com/featured/?travel,adventure')` }}>
          <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
            <div className="text-center text-white">
              <h1 className="text-4xl font-bold mb-2">Bienvenue sur <span className="text-[#247BA0]">MeetTrip</span></h1>
              <p className="text-lg">Rencontrez, Partagez, Voyagez</p>
            </div>
          </div>
        </section>

        {/* Description MeetTrip */}
        <section className="py-16 px-6 max-w-6xl mx-auto flex flex-col lg:flex-row items-center gap-8">
          <div className="flex-1">
            <h2 className="text-2xl font-semibold mb-4">En quoi consiste MeetTrip ?</h2>
            <p className="mb-6">MeetTrip est l'application qui connecte les voyageurs solo, backpackers et étudiants du monde entier. Partagez vos activités, repas ou trajets et brisez la solitude en voyage.</p>
            <Link href="#" className="bg-black text-white px-5 py-3 rounded-md">En savoir plus</Link>
          </div>
          <div className="flex-1">
            <img src="https://source.unsplash.com/featured/?friends,travel" alt="Voyageurs MeetTrip" className="rounded-lg shadow-md" />
          </div>
        </section>

        {/* Activités à partager */}
        <section className="py-16 px-6 max-w-6xl mx-auto">
          <h2 className="text-2xl font-semibold text-center mb-10">Activités disponibles à partager</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Exemple de cartes */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <img src="https://source.unsplash.com/featured/?city,trip" alt="Visite" className="h-48 w-full object-cover" />
              <div className="p-4">
                <h3 className="font-bold mb-2">Visite de centre-ville</h3>
                <Link href="#" className="mt-4 inline-block bg-black text-white px-4 py-2 rounded-md">Réserver l'activité</Link>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <img src="https://source.unsplash.com/featured/?car,trip" alt="Roadtrip" className="h-48 w-full object-cover" />
              <div className="p-4">
                <h3 className="font-bold mb-2">Covoiturage vers Sydney</h3>
                <Link href="#" className="mt-4 inline-block bg-black text-white px-4 py-2 rounded-md">Réserver l'activité</Link>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <img src="https://source.unsplash.com/featured/?mountain,hiking" alt="Randonnée" className="h-48 w-full object-cover" />
              <div className="p-4">
                <h3 className="font-bold mb-2">Randonnée en montagne</h3>
                <Link href="#" className="mt-4 inline-block bg-black text-white px-4 py-2 rounded-md">Réserver l'activité</Link>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <img src="https://source.unsplash.com/featured/?beach,trip" alt="Détente" className="h-48 w-full object-cover" />
              <div className="p-4">
                <h3 className="font-bold mb-2">Détente entre voyageurs</h3>
                <Link href="#" className="mt-4 inline-block bg-black text-white px-4 py-2 rounded-md">Réserver l'activité</Link>
              </div>
            </div>
          </div>
        </section>

        {/* Footer sera ajouté ensuite */}
      </div>
    </GuestLayout>
  );
}
