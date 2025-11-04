import GuestLayout from '@/layouts/GuestLayout';
import { useState } from 'react';

export default function Contact() {
  const [sent, setSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSent(true);
    setTimeout(() => setSent(false), 4000); 
  };

  return (
    <GuestLayout>
      <div className="max-w-4xl mx-auto px-4 py-16 text-[#1B1B18] relative">
        <h1 className="text-3xl font-bold text-center mb-10">Contactez-nous</h1>

        <p className="text-center text-lg mb-11">
          Besoin d'aide ou envie d’échanger ? Contactez-nous !
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="name">
              Nom
            </label>
            <input
              type="text"
              id="name"
              className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring focus:ring-[#247BA0]"
              placeholder="Votre nom"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="email">
              Adresse email
            </label>
            <input
              type="email"
              id="email"
              className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring focus:ring-[#247BA0]"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="message">
              Message
            </label>
            <textarea
              id="message"
              rows="5"
              className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring focus:ring-[#247BA0]"
              placeholder="Écrivez votre message ici..."
            ></textarea>
            <p className="text-sm text-gray-500 mt-2">
              Nous vous répondons sous 24 à 48h.
            </p>
          </div>

          <button
            type="submit"
            className="bg-[#247BA0] hover:bg-[#3498DB] text-white font-semibold px-6 py-2 rounded-md transition"
          >
            Envoyer
          </button>
        </form>

        {/* ✅ Popup de confirmation */}
        {sent && (
          <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-white border border-[#247BA0] text-[#1B1B18] px-6 py-3 rounded-lg shadow-lg text-sm font-medium animate-fade-in-out z-50">
            ✅ Votre message a été envoyé avec succès !
          </div>
        )}
      </div>
    </GuestLayout>
  );
}
