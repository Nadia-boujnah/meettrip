import AppLayout from '@/layouts/app-layout';
import { Head, usePage, Link } from '@inertiajs/react';
import dayjs from 'dayjs';
import 'dayjs/locale/fr';
dayjs.locale('fr');

const breadcrumbs = [{ title: 'Accueil', href: '/dashboard' }];

// Helper d'affichage de date
const fmt = (d) => (d ? dayjs(d).format('YYYY-MM-DD HH:mm:ss') : '—');

export default function Dashboard() {
  const { auth, reservations = [], threads = [], annonces = [] } = usePage().props;

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Accueil CO" />

      <div className="p-4 sm:p-6 space-y-6">
        {/* Profil utilisateur */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 p-4 rounded-xl shadow bg-white">
          <img
            src={auth?.user?.avatar_url || auth?.user?.profile_photo_url || '/images/placeholder.jpg'}
            alt="Photo de profil"
            className="w-20 h-20 rounded-full object-cover"
          />
          <div className="text-center sm:text-left">
            <Link href="/profil" className="font-semibold text-lg text-blue-600 hover:underline transition">
              {auth?.user?.prenom || auth?.user?.name} {auth?.user?.nom || ''}
            </Link>
            <p className="text-sm text-gray-500">✔️ Compte vérifié</p>
          </div>
        </div>

        {/* Grille */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Mes Réservations */}
          <div className="rounded-xl p-4 bg-white shadow flex flex-col justify-between">
            <div>
              <h2 className="font-semibold text-lg mb-4">Mes réservations</h2>
              {reservations.length === 0 ? (
                <p className="text-sm text-gray-500">Aucune réservation.</p>
              ) : (
                <ul className="space-y-2 text-sm">
                  {reservations.map((r) => (
                    <li key={r.id}>
                      📅 <strong>{fmt(r.date)}</strong> – {r.title}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="mt-4 space-y-2">
              <Link
                href="/my-reservations"
                className="block w-full text-center rounded border border-blue-400 text-blue-500 py-2 text-sm"
              >
                Voir mes réservations
              </Link>

              <Link
                href="/activitesconnected"
                className="block w-full text-center rounded bg-blue-400 text-white py-2 text-sm"
              >
                Voir toutes les activités
              </Link>
            </div>
          </div>

          {/* Messagerie Rapide */}
          <div className="p-4 bg-white shadow rounded-xl flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <h2 className="font-semibold text-lg">Messagerie Rapide</h2>
                <span className="bg-blue-500 text-white text-xs font-semibold px-2 py-0.5 rounded-full">
                  {threads.length}
                </span>
              </div>

              {threads.length === 0 ? (
                <p className="text-sm text-gray-500">Aucun message récent.</p>
              ) : (
                <ul className="text-sm space-y-1">
                  {threads.map((t) => (
                    <li key={t.id}>
                      👤 <strong>{t.organizer_name || 'Organisateur'}</strong>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <Link href="/messagerie" className="block w-full text-center rounded bg-blue-400 text-white py-2 text-sm">
              Voir tous les messages
            </Link>
          </div>

          {/* Mes Annonces */}
          <div className="p-4 bg-white shadow rounded-xl flex flex-col justify-between">
            <div>
              <h2 className="font-semibold text-lg mb-2">Mes annonces</h2>
              {annonces.length === 0 ? (
                <p className="text-sm text-gray-500">Aucune annonce publiée.</p>
              ) : (
                <ul className="text-sm space-y-2">
                  {annonces.map((a) => (
                    <li key={a.id}>
                      📅 <strong>{fmt(a.date)}</strong> – {a.title}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="mt-4 space-y-2">
              <Link href="/annonces" className="w-full block text-center rounded bg-blue-400 text-white py-2 text-sm">
                Voir toutes les annonces
              </Link>
              <Link href="/annonces" className="w-full block text-center rounded border border-blue-400 text-blue-500 py-2 text-sm">
                Créer une annonce
              </Link>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
