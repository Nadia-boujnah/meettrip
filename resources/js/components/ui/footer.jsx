export default function Footer() {
  return (
    <footer className="bg-stone-50">
      <div className="mx-auto max-w-7xl px-6 py-8 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-center w-full">
          <div className="sm:w-1/3">
            <p className="text-sm text-gray-600 text-left">
              © 2025 MeetTrip. Tous droits réservés.
            </p>
          </div>
          <div className="sm:w-1/3 flex justify-center mt-4 sm:mt-0">
            <div className="flex space-x-6">
              <a href="/cgu" className="text-sm text-gray-600 hover:text-gray-900">
                CGU
              </a>
              <a href="/legal" className="text-sm text-gray-600 hover:text-gray-900">
                Mentions légales
              </a>
              <a href="/privacy" className="text-sm text-gray-600 hover:text-gray-900">
              Politique de confidentialité
              </a>
            </div>
          </div>
          <div className="sm:w-1/3"></div>
        </div>
      </div>
    </footer>
  );
}

