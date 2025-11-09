import { Link } from '@inertiajs/react';

/**
 * Barre d'onglets pour les pages de paramètres :
 * Profil / Mot de passe / Apparence
 */
export default function SettingsTabs() {
  return (
    <nav className="flex flex-wrap gap-6 text-sm font-medium border-b pb-2">
      <Link
        href={route('settings.profile.edit')}
        className="hover:underline"
      >
        Profil
      </Link>

      <Link
        href={route('settings.password.edit')}
        className="hover:underline"
      >
        Mot de passe
      </Link>

      <Link
        href={route('settings.appearance')}
        className="hover:underline"
      >
        Apparence
      </Link>
    </nav>
  );
}
