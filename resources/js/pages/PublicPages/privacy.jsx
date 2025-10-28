import GuestLayout from '@/layouts/GuestLayout';

export default function PrivacyPolicy() {
  return (
    <GuestLayout>
      <div className="max-w-4xl mx-auto px-4 py-16 text-[#1B1B18]">
        <h1 className="text-3xl font-bold text-center mb-10">Politique de Confidentialité</h1>

        <section className="space-y-6 text-sm leading-relaxed text-gray-700">
          <div>
            <h2 className="font-semibold mb-2 text-[#247BA0]">1. Introduction</h2>
            <p>
              Chez MeetTrip, la protection de votre vie privée est une priorité. Cette page vous informe sur la manière
              dont vos données personnelles sont collectées, utilisées et sécurisées.
            </p>
          </div>

          <div>
            <h2 className="font-semibold mb-2 text-[#247BA0]">2. Données collectées</h2>
            <p>Nous collectons uniquement les données nécessaires à l'utilisation de notre plateforme :</p>
            <ul className="list-disc list-inside mt-2">
              <li>Nom et prénom</li>
              <li>Adresse email</li>
              <li>Messages via le formulaire de contact</li>
              <li>Données de navigation (cookies)</li>
            </ul>
          </div>

          <div>
            <h2 className="font-semibold mb-2 text-[#247BA0]">3. Utilisation des données</h2>
            <p>Vos données sont utilisées uniquement pour :</p>
            <ul className="list-disc list-inside mt-2">
              <li>Créer et gérer votre compte</li>
              <li>Répondre à vos messages</li>
              <li>Améliorer nos services</li>
              <li>Vous informer sur les mises à jour importantes</li>
            </ul>
          </div>

          <div>
            <h2 className="font-semibold mb-2 text-[#247BA0]">4. Sécurité</h2>
            <p>
              MeetTrip met en place des mesures de sécurité pour protéger vos données contre tout accès non autorisé.
            </p>
          </div>

          <div>
            <h2 className="font-semibold mb-2 text-[#247BA0]">5. Vos droits</h2>
            <p>
              Conformément à la loi, vous pouvez demander l'accès, la modification ou la suppression de vos données à
              tout moment via notre formulaire de contact.
            </p>
          </div>

          <div>
            <h2 className="font-semibold mb-2 text-[#247BA0]">6. Contact</h2>
            <p>
              Pour toute question liée à cette politique de confidentialité, vous pouvez nous contacter via la page{' '}
              <a href="/contact" className="text-[#247BA0] underline">
                Contact
              </a>{' '}
              
            </p>
          </div>
        </section>
      </div>
    </GuestLayout>
  );
}
