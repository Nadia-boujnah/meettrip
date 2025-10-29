import GuestLayout from '@/layouts/GuestLayout';

export default function CGU() {
  return (
    <GuestLayout>
      <div className="max-w-4xl mx-auto px-4 py-16 text-[#1B1B18]">
        <h1 className="text-3xl font-bold mb-8 text-center">Conditions Générales d’Utilisation</h1>

        <div className="space-y-6 text-sm leading-relaxed">
          <p>
            Bienvenue sur <strong>MeetTrip</strong>. En accédant à ce site, vous acceptez les présentes
            Conditions Générales d’Utilisation. Veuillez les lire attentivement.
          </p>

          <h2 className="text-lg font-semibold mt-6">1. Objet</h2>
          <p>
            Les présentes conditions régissent l’utilisation de la plateforme MeetTrip, qui permet aux
            utilisateurs de découvrir, proposer et partager des activités de voyage entre particuliers.
          </p>

          <h2 className="text-lg font-semibold mt-6">2. Accès au service</h2>
          <p>
            Le site est accessible gratuitement. Toutefois, certaines fonctionnalités sont réservées aux
            utilisateurs inscrits. L’inscription est ouverte à toute personne majeure.
          </p>

          <h2 className="text-lg font-semibold mt-6">3. Responsabilités</h2>
          <p>
            MeetTrip ne peut être tenu responsable des échanges ou rencontres organisés entre membres.
            Chaque utilisateur est responsable de ses actions et de ses interactions.
          </p>

          <h2 className="text-lg font-semibold mt-6">4. Données personnelles</h2>
          <p>
            Vos données sont utilisées uniquement dans le cadre du fonctionnement de la plateforme. Pour en
            savoir plus, consultez notre Politique de Confidentialité.
          </p>

          <h2 className="text-lg font-semibold mt-6">5. Modifications</h2>
          <p>
            MeetTrip se réserve le droit de modifier les présentes CGU à tout moment. Les utilisateurs seront
            informés en cas de mise à jour majeure.
          </p>

          <p className="text-sm text-gray-500 mt-10 italic">
            Dernière mise à jour : avril 2025
          </p>
        </div>
      </div>
    </GuestLayout>
  );
}
