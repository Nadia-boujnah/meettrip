import { Link } from '@inertiajs/react';

export default function Header({ auth }) {
  return (
    <header className="flex items-center justify-between p-4 bg-white shadow-md">
      <div className="flex items-center gap-2">
        <img src="/images/logo.png" alt="Logo MeetTrip" className="h-10" />
        <span className="text-xl font-bold text-[#2877A7]">MeetTrip</span>
      </div>

      <nav className="flex items-center gap-8">
        <Link href="/" className="text-black hover:text-blue-500">Accueil</Link>
        <Link href="/activities" className="text-black hover:text-blue-500">Activités</Link>
        <Link href="/about" className="text-black hover:text-blue-500">À propos</Link>
        <Link href="/contact" className="text-black hover:text-blue-500">Contact</Link>
      </nav>

      <div className="flex items-center gap-2">
        {auth?.user ? (
          <Link href="/dashboard" className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
            Dashboard
          </Link>
        ) : (
          <>
            <Link href="/login" className="px-4 py-2 bg-blue-200 text-blue-800 rounded hover:bg-blue-300">
              Connexion
            </Link>
            <Link href="/register" className="px-4 py-2 bg-[#2877A7] text-white rounded hover:bg-blue-700">
              Inscription
            </Link>
          </>
        )}
      </div>
    </header>
  );
}
