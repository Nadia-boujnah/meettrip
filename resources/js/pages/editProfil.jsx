import AppLayout from '@/layouts/app-layout';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { useMemo, useState } from 'react';

export default function EditProfil() {
  // Je récupère les props envoyées par Inertia (dont le user courant)
  const { props } = usePage();
  const user = props?.user || {};

  /**
   * updateUrl
   * -> Détermine la route d’envoi du formulaire :
   *    - si Ziggy "route()" existe, j’utilise profile.update
   *    - sinon, je retombe sur /profil (fallback)
   */
  const updateUrl = useMemo(() => {
    try {
      // @ts-ignore
      return typeof route === 'function' ? route('profile.update') : '/profil';
    } catch {
      return '/profil';
    }
  }, []);

  /**
   * useForm
   * -> Je prépare les champs du formulaire.
   *    _method: 'put' permet d’envoyer un PUT via POST (override côté Laravel).
   *    avatar / document sont des fichiers donc je les laisse à null au départ.
   */
  const { data, setData, post, processing, errors, progress } = useForm({
    _method: 'put',
    prenom: user.prenom || '',
    nom: user.nom || '',
    location: user.location || '',
    bio: user.bio || '',
    avatar: null,
    document: null,
  });

  // Aperçu de l’avatar (soit l’actuel, soit une image par défaut)
  const [preview, setPreview] = useState(user?.avatar || user?.photo || '/images/default-avatar.png');
  // Petit message de feedback (succès / rappel de pièce d’identité)
  const [message, setMessage] = useState('');

  // Sécurité : si la page n’a pas reçu "user", j’explique comment corriger côté back
  if (!props?.user) {
    return (
      <AppLayout>
        <Head title="Modifier mon profil" />
        <div className="max-w-xl mx-auto px-6 py-12 text-center text-gray-500">
          Impossible de charger le profil. Vérifie que la route pointe bien sur
          <code className="mx-1 bg-gray-100 px-1 rounded">ProfileController@edit</code>
          et que cette action envoie <code>user</code> dans les props.
        </div>
      </AppLayout>
    );
  }

  /**
   * onChangeAvatar
   * -> Quand je sélectionne un fichier, je mets le File dans le form state
   *    et je génère un aperçu local via URL.createObjectURL.
   */
  const onChangeAvatar = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setData('avatar', file);
      setPreview(URL.createObjectURL(file));
    }
  };

  /**
   * onChangeDoc
   * -> Stocke le fichier de la pièce d’identité dans le form state.
   */
  const onChangeDoc = (e) => {
    const file = e.target.files?.[0];
    if (file) setData('document', file);
  };

  /**
   * submit
   * -> Envoi du formulaire :
   *    - je vérifie que le document est présent (si aucun déjà enregistré)
   *    - j’envoie via Inertia en FormData (forceFormData: true pour les fichiers)
   *    - en cas de succès, j’affiche un message puis je le masque après 2,5s
   */
  const submit = (e) => {
    e.preventDefault();

    // Document requis si aucun déjà présent
    if (!data.document && !user.document) {
      setMessage("⚠️ La pièce d'identité est obligatoire pour vérifier le compte.");
      setTimeout(() => setMessage(''), 3500);
      return;
    }

    post(updateUrl, {
      forceFormData: true, // indispensable pour les fichiers
      onSuccess: () => {
        setMessage('✔️ Profil mis à jour avec succès.');
        setTimeout(() => setMessage(''), 2500);
      },
    });
  };

  return (
    <AppLayout>
      <Head title="Modifier mon profil" />

      <div className="max-w-2xl mx-auto px-4 py-10">
        <h1 className="text-2xl font-semibold text-center mb-6">Modifier mon Profil</h1>

        {/* Message de feedback (succès / rappel) */}
        {message && (
          <div className="mb-4 text-center text-green-700 bg-green-50 border border-green-200 px-3 py-2 rounded">
            {message}
          </div>
        )}

        {/* Formulaire principal */}
        <form onSubmit={submit} className="bg-white p-6 rounded-xl shadow space-y-6">
          {/* Bloc Avatar : aperçu + input fichier */}
          <div className="flex flex-col items-center gap-3">
            <img
              src={preview}
              alt="Aperçu avatar"
              className="w-28 h-28 rounded-full object-cover ring-2 ring-gray-100"
            />
            <label className="cursor-pointer bg-gray-100 border px-3 py-2 rounded hover:bg-gray-200">
              📷 Joindre une photo
              <input type="file" className="hidden" accept="image/*" onChange={onChangeAvatar} />
            </label>
            {errors.avatar && <p className="text-sm text-red-600">{errors.avatar}</p>}
          </div>

          {/* Prénom / Nom */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-gray-700">Prénom</label>
              <input
                value={data.prenom}
                onChange={(e) => setData('prenom', e.target.value)}
                className="w-full border p-2 rounded"
              />
              {errors.prenom && <p className="text-sm text-red-600">{errors.prenom}</p>}
            </div>
            <div>
              <label className="text-sm text-gray-700">Nom</label>
              <input
                value={data.nom}
                onChange={(e) => setData('nom', e.target.value)}
                className="w-full border p-2 rounded"
              />
              {errors.nom && <p className="text-sm text-red-600">{errors.nom}</p>}
            </div>
          </div>

          {/* Localisation */}
          <div>
            <label className="text-sm text-gray-700">Localisation</label>
            <input
              value={data.location}
              onChange={(e) => setData('location', e.target.value)}
              className="w-full border p-2 rounded"
            />
            {errors.location && <p className="text-sm text-red-600">{errors.location}</p>}
          </div>

          {/* Bio / À propos */}
          <div>
            <label className="text-sm text-gray-700">À propos</label>
            <textarea
              rows={4}
              value={data.bio}
              onChange={(e) => setData('bio', e.target.value)}
              className="w-full border p-2 rounded"
            />
            {errors.bio && <p className="text-sm text-red-600">{errors.bio}</p>}
          </div>

          {/* Pièce d'identité (obligatoire si pas déjà fournie) */}
          <div className="text-center">
            <label className="block border rounded p-4 cursor-pointer hover:bg-gray-50">
              📄 Joindre une pièce d'identité
              <input type="file" className="hidden" accept="image/*,.pdf" onChange={onChangeDoc} />
            </label>
            {errors.document && <p className="text-sm text-red-600 mt-1">{errors.document}</p>}
            {/* Barre de progression upload fournie par Inertia si dispo */}
            {progress && (
              <p className="text-xs text-gray-500 mt-1">Upload… {progress.percentage}%</p>
            )}
          </div>

          {/* Actions (submit + annuler) */}
          <div className="flex justify-center gap-3 pt-2">
            <button
              type="submit"
              disabled={processing}
              className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
            >
              Enregistrer
            </button>

            {/* Lien d’annulation : je retourne sur mon profil */}
            <Link
              href={typeof route === 'function' ? route('profile.me') : '/profil'}
              className="border px-6 py-2 rounded hover:bg-gray-50"
            >
              Annuler
            </Link>
          </div>
        </form>
      </div>
    </AppLayout>
  );
}
