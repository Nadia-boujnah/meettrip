import GuestLayout from '@/Layouts/GuestLayout';
import photoNadia from "@/assets/images/nadia-voyage.png";

export default function About() {
  return (
    <GuestLayout>
      <div className="max-w-6xl mx-auto px-6 py-20 text-[#1B1B18]">
        <div className="flex flex-col-reverse lg:flex-row items-center gap-12">
          <div className="w-full lg:w-1/2 text-lg space-y-6">
            <h1 className="text-4xl font-extrabold tracking-tight mb-4">
              À propos de <span className="text-[#247BA0]">MeetTrip</span>
            </h1>

            <p>
  Animée par une passion pour le voyage, la découverte et surtout... les rencontres humaines, <strong className="text-[#247BA0]">j’ai imaginé MeetTrip</strong> pour donner du sens aux aventures partagées.
</p>


            <p>
              Après plusieurs aventures autour du monde, j’ai réalisé à quel point il peut être difficile de voyager seul(e), surtout quand on aimerait partager un moment, une activité, ou simplement une discussion autour d’un bon repas.
            </p>

            <p>
              C’est de cette envie qu’est né <strong className="text-[#247BA0]">MeetTrip</strong> : une plateforme pour briser la solitude en voyage, créer du lien et partager des expériences authentiques entre voyageurs et locaux.
            </p>

            <blockquote className="border-l-4 border-[#247BA0] pl-4 italic text-gray-600">
              Merci d’être ici. J’espère que cette aventure vous inspirera autant qu’elle m’inspire chaque jour.
            </blockquote>

            <p className="text-sm text-gray-500 mt-2">— Nadia, fondatrice de MeetTrip</p>
          </div>

          {/* Image à droite */}
          <div className="w-full lg:w-1/2 flex justify-center">
  <img
    src={photoNadia}
    alt="Nadia en voyage"
    className="rounded-xl shadow-lg w-[300px] h-auto object-cover"
  />
</div>

        </div>
      </div>
    </GuestLayout>
  );
}
