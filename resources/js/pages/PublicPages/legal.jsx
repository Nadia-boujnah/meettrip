import GuestLayout from '@/layouts/GuestLayout';

export default function LegalNotice() {
  return (
    <GuestLayout>
      <div className="max-w-4xl mx-auto px-4 py-16 text-[#1B1B18]">
        <h1 className="text-3xl font-bold text-center mb-10">Mentions légales</h1>

        <section className="space-y-6 text-sm leading-relaxed text-gray-700">
          <div>
            <h2 className="font-semibold mb-2 text-[#247BA0]">Éditeur du site</h2>
            <p>
              Ce site est édité par <strong>MeetTrip</strong>, plateforme dédiée à la mise en relation de voyageurs.
            </p>
          </div>

          <div>
            <h2 className="font-semibold mb-2 text-[#247BA0]">Responsable de la publication</h2>
            <p>Nadia B., fondatrice de MeetTrip – contact via la page de contact.</p>
          </div>

          <div>
            <h2 className="font-semibold mb-2 text-[#247BA0]">Hébergement</h2>
            <p>
              Ce site est hébergé par : <br />
              <strong>Hostinger International Ltd</strong><br />
              61 Lordou Vironos Street, 6023 Larnaca, Chypre
            </p>
          </div>

          <div>
            <h2 className="font-semibold mb-2 text-[#247BA0]">Propriété intellectuelle</h2>
            <p>
              Tous les contenus présents sur le site MeetTrip (textes, images, logo, etc.) sont la propriété de
              MeetTrip, sauf mention contraire, et ne peuvent être reproduits sans autorisation.
            </p>
          </div>

          <div>
            <h2 className="font-semibold mb-2 text-[#247BA0]">Utilisation des données</h2>
            <p>
              Les données personnelles collectées via les formulaires sont utilisées exclusivement pour la gestion des
              comptes et la communication avec les utilisateurs.
            </p>
          </div>
        </section>
      </div>
    </GuestLayout>
  );
}
