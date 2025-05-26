import { motion } from 'framer-motion';
import { Link } from '@inertiajs/react';
import GuestLayout from '@/Layouts/GuestLayout';
import fondbkp from '@/assets/videos/fondbkp.mp4';
import rencontrEtLogo from '@/assets/images/rencontreetlogo.png';
import repasParis from '@/assets/images/repasparis.png';
import visiteEspagne from '@/assets/images/visiteespagne.png';
import trajetAustralie from '@/assets/images/trajetaustralie.png';
import randoneeMontagne from '@/assets/images/randoneemontagne.png';
import carteMap from '@/assets/images/cartemap.png'; 
import icon1 from '@/assets/images/icon1.png';
import icon2 from '@/assets/images/icon2.png';
import icon3 from '@/assets/images/icon3.png';
import icon4 from '@/assets/images/icon4.png';

export default function Home() {
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
    variants={{
      hidden: {},
      visible: {
        transition: {
          staggerChildren: 0.2
        }
      }
    }}
    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto"
  >
    {/* Chiffre 1 */}
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0 }
      }}
      className="flex flex-col items-center bg-[#F9FAFB] rounded-xl p-8 shadow hover:shadow-md transition"
    >
      <div className="text-5xl font-extrabold text-[#247BA0] mb-4">+10K</div>
      <h3 className="text-lg font-semibold text-center mb-2">Voyageurs inscrits</h3>
      <p className="text-gray-600 text-center">Une communauté active autour du monde.</p>
    </motion.div>

    {/* Chiffre 2 */}
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0 }
      }}
      className="flex flex-col items-center bg-[#F9FAFB] rounded-xl p-8 shadow hover:shadow-md transition"
    >
      <div className="text-5xl font-extrabold text-[#247BA0] mb-4">+2K</div>
      <h3 className="text-lg font-semibold text-center mb-2">Activités partagées</h3>
      <p className="text-gray-600 text-center">Des repas, trajets, randonnées et plus encore.</p>
    </motion.div>

    {/* Chiffre 3 */}
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0 }
      }}
      className="flex flex-col items-center bg-[#F9FAFB] rounded-xl p-8 shadow hover:shadow-md transition"
    >
      <div className="text-5xl font-extrabold text-[#247BA0] mb-4">+500</div>
      <h3 className="text-lg font-semibold text-center mb-2">Destinations</h3>
      <p className="text-gray-600 text-center">Partout en Europe, Asie, Amérique, Océanie et Afrique.</p>
    </motion.div>

    {/* Chiffre 4 */}
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0 }
      }}
      className="flex flex-col items-center bg-[#F9FAFB] rounded-xl p-8 shadow hover:shadow-md transition"
    >
      <div className="text-5xl font-extrabold text-[#247BA0] mb-4">+1K</div>
      <h3 className="text-lg font-semibold text-center mb-2">Rencontres créées</h3>
      <p className="text-gray-600 text-center">Des amitiés, des souvenirs, des aventures uniques !</p>
    </motion.div>
  </motion.div>
</section>


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
    variants={{
      hidden: {},
      visible: {
        transition: {
          staggerChildren: 0.2
        }
      }
    }}
    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
  >
    {/* Activ 1 */}
    <motion.div
      variants={{
        hidden: { opacity: 0, scale: 0.9 },
        visible: { opacity: 1, scale: 1 }
      }}
      className="bg-white rounded-lg shadow-md overflow-hidden"
    >
      <img src={repasParis} alt="Dîner entre voyageurs" className="h-48 w-full object-cover" />
      <div className="p-4">
        <h3 className="font-bold mb-1">Dîner entre voyageurs</h3>
        <p className="text-sm text-blue-600 mb-2">Paris, FRANCE</p>
        <p className="text-sm mb-4">Rejoignez-nous pour un dîner convivial !</p>
        <Link
          href="/activities#activites"
          className="block w-full bg-[#247BA0] text-white text-center py-2 rounded-md hover:bg-[#3498DB] transition"
        >
          Voir plus
        </Link>
      </div>
    </motion.div>

    {/* Les autres activités : même principe */}
    {/* Activ 2 */}
    <motion.div
      variants={{
        hidden: { opacity: 0, scale: 0.9 },
        visible: { opacity: 1, scale: 1 }
      }}
      className="bg-white rounded-lg shadow-md overflow-hidden"
    >
      <img src={visiteEspagne} alt="Visite du centre-ville" className="h-48 w-full object-cover" />
      <div className="p-4">
        <h3 className="font-bold mb-1">Visite du centre-ville</h3>
        <p className="text-sm text-blue-600 mb-2">Barcelone, ESPAGNE</p>
        <p className="text-sm mb-4">Explorez Barcelone avec nous !</p>
        <Link
          href="/activities#activites"
          className="block w-full bg-[#247BA0] text-white text-center py-2 rounded-md hover:bg-[#3498DB] transition"
        >
          Voir plus
        </Link>
      </div>
    </motion.div>

    {/* Activ 3 */}
    <motion.div
      variants={{
        hidden: { opacity: 0, scale: 0.9 },
        visible: { opacity: 1, scale: 1 }
      }}
      className="bg-white rounded-lg shadow-md overflow-hidden"
    >
      <img src={trajetAustralie} alt="Covoiturage vers Sydney" className="h-48 w-full object-cover" />
      <div className="p-4">
        <h3 className="font-bold mb-1">Covoiturage vers Sydney</h3>
        <p className="text-sm text-blue-600 mb-2">Melbourne, AUSTRALIE</p>
        <p className="text-sm mb-4">Proposez une place pour un trip</p>
        <Link
          href="/activities#activites"
          className="block w-full bg-[#247BA0] text-white text-center py-2 rounded-md hover:bg-[#3498DB] transition"
        >
          Voir plus
        </Link>
      </div>
    </motion.div>

    {/* Activ 4 */}
    <motion.div
      variants={{
        hidden: { opacity: 0, scale: 0.9 },
        visible: { opacity: 1, scale: 1 }
      }}
      className="bg-white rounded-lg shadow-md overflow-hidden"
    >
      <img src={randoneeMontagne} alt="Randonnée en montagne" className="h-48 w-full object-cover" />
      <div className="p-4">
        <h3 className="font-bold mb-1">Randonnée en montagne</h3>
        <p className="text-sm text-blue-600 mb-2">Chamonix, FRANCE</p>
        <p className="text-sm mb-4">Découvrons ensemble les Alpes</p>
        <Link
          href="/activities#activites"
          className="block w-full bg-[#247BA0] text-white text-center py-2 rounded-md hover:bg-[#3498DB] transition"
        >
          Voir plus
        </Link>
      </div>
    </motion.div>
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
            <div className="flex justify-center">
              <div className="relative w-full max-w-lg group">
                <input
                  type="text"
                  placeholder="Chercher une activité ou des voyageurs..."
                  className="w-full py-4 pl-6 pr-12 rounded-full shadow-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#3498DB] text-gray-700 text-lg transition"
                />
                <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none transition-colors duration-300 group-focus-within:text-[#3498DB]">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-gray-400 group-focus-within:text-[#3498DB] transition duration-300"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11a6 6 0 11-12 0 6 6 0 0112 0z" />
                  </svg>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="flex justify-center"
          >
            <img
              src={carteMap}
              alt="Carte du monde interactive"
              className="w-full max-w-5xl rounded-xl shadow-lg"
            />
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

          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto mb-12"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={{
              hidden: {},
              visible: {
                transition: {
                  staggerChildren: 0.2
                }
              }
            }}
          >
            {[icon1, icon2, icon3, icon4].map((icon, index) => (
              <motion.div
                key={index}
                variants={{
                  hidden: { opacity: 0, y: 30 },
                  visible: { opacity: 1, y: 0 }
                }}
                className="flex flex-col items-center bg-[#F9FAFB] rounded-xl p-6 shadow hover:shadow-md transition"
              >
                <img src={icon} alt={`Étape ${index + 1}`} className="w-24 h-24 mb-4" />
                <h3 className="font-semibold text-lg mb-2 text-center">
                  Etape {index + 1} : {
                    [
                      "Inscrivez-vous gratuitement",
                      "Proposez ou rejoignez une activité",
                      "Entrez en contact facilement",
                      "Voyagez et partagez des moments uniques"
                    ][index]
                  }
                </h3>
              </motion.div>
            ))}
          </motion.div>

          <motion.div 
            className="flex justify-center"
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            viewport={{ once: true }}
          >
            <a
              href="/register"
              className="px-8 py-4 bg-[#247BA0] text-white text-lg font-semibold rounded-full shadow hover:bg-[#1B5f7a] hover:scale-105 transition-transform duration-200"
            >
              Rejoindre la communauté MeetTrip
            </a>
          </motion.div>
        </section>

      </div>
    </GuestLayout>
  );
}
