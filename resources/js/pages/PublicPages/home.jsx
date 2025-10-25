import { motion } from 'framer-motion';
import { Link } from '@inertiajs/react';
import GuestLayout from '@/Layouts/GuestLayout';
import fondbkp from '@/assets/videos/fondbkp.mp4';
import rencontrEtLogo from "@/assets/images/rencontreetlogo.png";
import repasParis from "@/assets/images/repasparis.png";
import visiteEspagne from "@/assets/images/visiteespagne.png";
import trajetAustralie from "@/assets/images/trajetaustralie.png";
import randoneeMontagne from "@/assets/images/randoneemontagne.png";

// Carte Leaflet
import { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import markerIconPng from 'leaflet/dist/images/marker-icon.png';
import { allActivities } from '@/data/activities';

export default function Home() {
  // --- État & centre de la carte (JS, sans types) ---
  const center = [48.8566, 2.3522]; // Paris
  const [search, setSearch] = useState('');

  const filteredActivities = allActivities.filter((a) =>
    a.title.toLowerCase().includes(search.toLowerCase()) ||
    a.location.toLowerCase().includes(search.toLowerCase()) ||
    a.host_user.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <GuestLayout>
      <div className="bg-[#FFFCF9] text-[#1B1B18]">

        {/* Hero section avec vidéo */}
        <section className="relative h-[85vh] sm:h-[90vh] overflow-hidden">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="absolute inset-0 w-full h-full object-cover"
          >
            <source src={fondbkp} type="video/mp4" />
            Votre navigateur ne supporte pas la vidéo.
          </video>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
            className="absolute inset-0 bg-black/30 flex flex-col items-center justify-center text-center text-white z-10 px-4"
          >
            <motion.h1
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 1 }}
              className="text-5xl md:text-6xl font-bold mb-4"
            >
              Bienvenue sur <span className="text-[#247BA0]">MeetTrip</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 1 }}
              className="text-lg md:text-xl mb-6"
            >
              Rencontrez, Partagez, Voyagez
            </motion.p>

            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1, duration: 0.8 }}
            >
              <Link
                href="/register"
                className="bg-[#247BA0] hover:bg-[#3498DB] text-white font-semibold py-3 px-6 rounded-lg transition duration-300"
              >
                Rejoignez-nous
              </Link>
            </motion.div>
          </motion.div>
        </section>

        {/* Description MeetTrip */}
        <section className="py-16 px-6 max-w-6xl mx-auto flex flex-col lg:flex-row items-center gap-8">
          <motion.div
            className="flex-1"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-semibold mb-6">En quoi consiste MeetTrip ?</h2>
            <p className="mb-6 leading-relaxed">
              MeetTrip est l'application qui connecte les voyageurs solo, backpackers et étudiants du monde entier.
              Partagez vos activités, repas ou trajets et brisez la solitude en voyage.
            </p>
            <Link
              href="#"
              className="inline-block bg-[#247BA0] hover:bg-[#3498DB] text-white font-semibold px-5 py-3 rounded-md transition duration-300"
            >
              En savoir plus
            </Link>
          </motion.div>

          <motion.div
            className="flex-1"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <img
              src={rencontrEtLogo}
              alt="Rencontre et logo"
              className="rounded-lg shadow-md object-cover transform hover:scale-105 transition duration-500 ease-in-out"
            />
          </motion.div>
        </section>

        {/* -------- Section Chiffres Clés -------- */}
        <section className="py-20 px-6 bg-[#FFFCF9]">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="max-w-6xl mx-auto text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-extrabold text-[#1B1B18] mb-4">
              Nos chiffres clés
            </h2>
            <p className="text-gray-600 text-lg">
              MeetTrip c'est une communauté en pleine expansion grâce à vous !
            </p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.2 } } }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto"
          >
            {/* 4 cards */}
            {[['+10K','Voyageurs inscrits','Une communauté active autour du monde.'],
              ['+2K','Activités partagées','Des repas, trajets, randonnées et plus encore.'],
              ['+500','Destinations','Partout en Europe, Asie, Amérique, Océanie et Afrique.'],
              ['+1K','Rencontres créées','Des amitiés, des souvenirs, des aventures uniques !']
            ].map(([big, title, text], i)=>(
              <motion.div key={i}
                variants={{ hidden:{opacity:0,y:30}, visible:{opacity:1,y:0} }}
                className="flex flex-col items-center bg-[#F9FAFB] rounded-xl p-8 shadow hover:shadow-md transition"
              >
                <div className="text-5xl font-extrabold text-[#247BA0] mb-4">{big}</div>
                <h3 className="text-lg font-semibold text-center mb-2">{title}</h3>
                <p className="text-gray-600 text-center">{text}</p>
              </motion.div>
            ))}
          </motion.div>
        </section>

        {/* Activités vitrines */}
        <section id="activites" className="py-16 px-6 max-w-7xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: -30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-3xl font-semibold text-center mb-10"
          >
            Activités disponibles à partager
          </motion.h2>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.2 } } }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {/* 4 cartes exemples */}
            {[
              {img:repasParis, title:'Dîner entre voyageurs', place:'Paris, FRANCE', desc:'Rejoignez-nous pour un dîner convivial !'},
              {img:visiteEspagne, title:'Visite du centre-ville', place:'Barcelone, ESPAGNE', desc:'Explorez Barcelone avec nous !'},
              {img:trajetAustralie, title:'Covoiturage vers Sydney', place:'Melbourne, AUSTRALIE', desc:'Proposez une place pour un trip'},
              {img:randoneeMontagne, title:'Randonnée en montagne', place:'Chamonix, FRANCE', desc:'Découvrons ensemble les Alpes'},
            ].map((c,i)=>(
              <motion.div key={i}
                variants={{ hidden:{opacity:0,scale:0.9}, visible:{opacity:1,scale:1} }}
                className="bg-white rounded-lg shadow-md overflow-hidden"
              >
                <img src={c.img} alt={c.title} className="h-48 w-full object-cover" />
                <div className="p-4">
                  <h3 className="font-bold mb-1">{c.title}</h3>
                  <p className="text-sm text-blue-600 mb-2">{c.place}</p>
                  <p className="text-sm mb-4">{c.desc}</p>
                  <Link
                    href="/activities#activites"
                    className="block w-full bg-[#247BA0] text-white text-center py-2 rounded-md hover:bg-[#3498DB] transition"
                  >
                    Voir plus
                  </Link>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </section>

        {/* Section Carte Interactive */}
        <section className="py-20 bg-[#E5F6FD] px-6">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="max-w-5xl mx-auto text-center mb-12"
          >
            <h2 className="text-4xl md:text-5xl font-extrabold text-[#1B1B18] mb-8">
              Où les trouver ?
            </h2>

            {/* Barre de recherche connectée au filtre */}
            <div className="flex justify-center">
              <div className="relative w-full max-w-lg group">
                <input
                  type="text"
                  placeholder="Chercher une activité, une ville ou un organisateur…"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full py-4 pl-6 pr-12 rounded-full shadow-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#3498DB] text-gray-700 text-lg transition"
                />
                <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none transition-colors duration-300 group-focus-within:text-[#3498DB]">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M21 21l-4.35-4.35M17 11a6 6 0 11-12 0 6 6 0 0112 0z" />
                  </svg>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Carte Leaflet */}
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="max-w-5xl mx-auto"
          >
            <div className="h-[60vh] w-full rounded-xl shadow-lg overflow-hidden">
              <MapContainer
                center={center}
                zoom={2.5}
                scrollWheelZoom={true}
                className="h-full w-full z-0"
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png"
                />

                {filteredActivities.map((activity) => {
                  const coords = activity.coordinates;
                  if (!Array.isArray(coords) || coords.length !== 2 || typeof coords[0] !== 'number' || typeof coords[1] !== 'number') {
                    return null;
                  }
                  return (
                    <Marker
                      key={activity.id}
                      position={coords}
                      icon={L.icon({
                        iconUrl: markerIconPng,
                        iconSize: [25, 41],
                        iconAnchor: [12, 41],
                      })}
                    >
                      <Popup>
                        <div className="text-sm space-y-1">
                          <strong>{activity.title}</strong>
                          <p>{activity.location}</p>
                          <Link href={`/activities/${activity.id}/connected`} className="text-blue-600 underline">
                            Voir l’activité →
                          </Link>
                        </div>
                      </Popup>
                    </Marker>
                  );
                })}
              </MapContainer>
            </div>
          </motion.div>
        </section>

        {/* Section Comment ça marche */}
        <section className="py-20 px-6 bg-white">
          <motion.div
            className="max-w-6xl mx-auto text-center mb-16"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-extrabold text-[#1B1B18] mb-4">
              Comment ça marche ?
            </h2>
            <p className="text-gray-600 text-lg">
              Inscrivez-vous gratuitement et commencez à partager vos aventures et activités avec d'autres voyageurs !
            </p>
          </motion.div>

         {/* 4 étapes */}
<motion.div
  initial="hidden"
  whileInView="visible"
  viewport={{ once: true }}
  variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.15 } } }}
  className="max-w-6xl mx-auto"
>
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
    {[
      {
        title: "Étape 1 : Inscrivez-vous",
        text: "Créez votre compte gratuitement.",
        // petit pictogramme SVG
        icon: (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-10 h-10">
            <path fill="currentColor" d="M12 12a5 5 0 1 0-5-5a5 5 0 0 0 5 5m0 2c-4.33 0-8 2.17-8 5v1h16v-1c0-2.83-3.67-5-8-5" />
          </svg>
        ),
      },
      {
        title: "Étape 2 : Trouvez ou créez",
        text: "Publiez une activité ou rejoignez-en une près de chez vous.",
        icon: (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-10 h-10">
            <path fill="currentColor" d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5A6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79L20 21.5L21.5 20zM9.5 14A4.5 4.5 0 1 1 14 9.5A4.5 4.5 0 0 1 9.5 14" />
          </svg>
        ),
      },
      {
        title: "Étape 3 : Échangez & réservez",
        text: "Discutez avec l’organisateur et confirmez votre place.",
        icon: (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-10 h-10">
            <path fill="currentColor" d="M20 2H4a2 2 0 0 0-2 2v14l4-4h14a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2" />
          </svg>
        ),
      },
      {
        title: "Étape 4 : Participez & laissez un avis",
        text: "Vivez l’activité et aidez la communauté avec un retour.",
        icon: (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-10 h-10">
            <path fill="currentColor" d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2L9.19 8.63L2 9.24l5.46 4.73L5.82 21z" />
          </svg>
        ),
      },
    ].map((step, i) => (
      <motion.div
        key={i}
        variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
        className="bg-[#F9FAFB] rounded-xl p-6 text-center shadow hover:shadow-md transition"
      >
        <div className="mx-auto mb-4 flex items-center justify-center rounded-full bg-white w-16 h-16 text-[#247BA0] shadow">
          {step.icon}
        </div>
        <h3 className="font-semibold mb-2">{step.title}</h3>
        <p className="text-sm text-gray-600">{step.text}</p>
      </motion.div>
    ))}
  </div>

  {/* CTA */}
  <div className="mt-10 flex justify-center">
    <Link
      href="/register"
      className="px-6 py-3 rounded-full bg-[#247BA0] hover:bg-[#3498DB] text-white font-medium shadow transition"
    >
      Rejoindre la communauté MeetTrip
    </Link>
  </div>
      </motion.div>
    </section> {/* 🔹 fermeture de la section Comment ça marche */}
  </div>
</GuestLayout>
);
}

