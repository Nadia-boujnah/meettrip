import { Head } from '@inertiajs/react';
import GuestLayout from '@/Layouts/GuestLayout';

export default function SeoExample() {
  return (
    <GuestLayout>
      {/* === BALISES SEO === */}
      <Head>
        <title>MeetTrip – Découvrez le monde autrement</title>
        <meta
          name="description"
          content="MeetTrip est la plateforme qui connecte les voyageurs du monde entier pour partager activités, repas et trajets dans une ambiance conviviale."
        />
        <meta
          name="keywords"
          content="MeetTrip, voyage, activités, backpackers, covoiturage, rencontres, tourisme"
        />
        <link rel="canonical" href="https://meettrip.fr/" />

        {/* Balises Open Graph pour les réseaux sociaux */}
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="MeetTrip" />
        <meta property="og:title" content="MeetTrip – Rencontrez, partagez, voyagez" />
        <meta
          property="og:description"
          content="Connectez-vous avec d'autres voyageurs, partagez vos aventures et vivez le monde autrement."
        />
        <meta property="og:image" content="https://meettrip.fr/images/og-image.jpg" />
        <meta property="og:url" content="https://meettrip.fr/" />

        {/* Balises Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="MeetTrip – Rencontrez, partagez, voyagez" />
        <meta
          name="twitter:description"
          content="L’application qui relie les voyageurs autour d’expériences partagées."
        />
        <meta name="twitter:image" content="https://meettrip.fr/images/og-image.jpg" />

        {/* Données structurées JSON-LD */}
        <script type="application/ld+json">
          {JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'WebSite',
            name: 'MeetTrip',
            url: 'https://meettrip.fr/',
            potentialAction: {
              '@type': 'SearchAction',
              target: 'https://meettrip.fr/activities?q={search_term_string}',
              'query-input': 'required name=search_term_string'
            }
          })}
        </script>
      </Head>

      {/* === CONTENU DE DÉMONSTRATION === */}
      <div className="max-w-4xl mx-auto px-6 py-20 text-[#1B1B18]">
        <h1 className="text-4xl font-bold mb-8 text-center">
          Bienvenue sur <span className="text-[#247BA0]">MeetTrip</span>
        </h1>
        <h2 className="text-2xl font-semibold mb-4">Découvrez le monde autrement</h2>
        <p className="leading-relaxed mb-6">
          MeetTrip facilite les rencontres entre voyageurs autour d’activités,
          de repas partagés et de trajets communs. Chaque utilisateur peut créer,
          rejoindre et partager des expériences locales dans une ambiance
          conviviale et internationale.
        </p>
        <h2 className="text-2xl font-semibold mb-4">Pourquoi l’utiliser ?</h2>
        <ul className="list-disc ml-6 space-y-2">
          <li>Faire des rencontres authentiques lors de vos voyages.</li>
          <li>Partager des repas, excursions ou trajets à plusieurs.</li>
          <li>Vivre des aventures humaines, pas seulement des destinations.</li>
        </ul>
      </div>
    </GuestLayout>
  );
}
