import { Head, useForm, Link } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';

import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import logo from '@/assets/images/logomeettrip.png';

export default function Register() {
  const { data, setData, post, processing, errors, reset } = useForm({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
    accept_cgu: false,
  });

  const submit = (e) => {
    e.preventDefault();
    post(route('register'), {
      onFinish: () => reset('password', 'password_confirmation'),
    });
  };

  return (
    <>
      <Head title="Inscription" />

      <div className="min-h-screen bg-[#F8F8F8] flex items-center justify-center px-4">
        <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-6 sm:p-8">
          {/* Logo */}
          <div className="flex justify-center mb-4">
            <Link href="/">
              <img src={logo} alt="Logo MeetTrip" className="h-16 hover:opacity-80 transition" />
            </Link>
          </div>

          <h1 className="text-2xl font-bold text-center text-[#247BA0] mb-1">Inscription à MeetTrip</h1>
          <p className="text-center text-sm text-gray-600 mb-6">
            Entrez vos informations pour créer votre compte
          </p>

          <form onSubmit={submit} className="space-y-4">
            <div>
              <Label htmlFor="name">Nom complet</Label>
              <Input
                id="name"
                type="text"
                value={data.name}
                onChange={(e) => setData('name', e.target.value)}
                required
                autoFocus
                disabled={processing}
                placeholder="Votre nom"
              />
              <InputError message={errors.name} />
            </div>

            <div>
              <Label htmlFor="email">Adresse email</Label>
              <Input
                id="email"
                type="email"
                value={data.email}
                onChange={(e) => setData('email', e.target.value)}
                required
                autoComplete="email"
                disabled={processing}
                placeholder="exemple@mail.com"
              />
              <InputError message={errors.email} />
            </div>

            <div>
              <Label htmlFor="password">Mot de passe</Label>
              <Input
                id="password"
                type="password"
                value={data.password}
                onChange={(e) => setData('password', e.target.value)}
                required
                autoComplete="new-password"
                disabled={processing}
                placeholder="Mot de passe"
              />
              <InputError message={errors.password} />
            </div>

            <div>
              <Label htmlFor="password_confirmation">Confirmation du mot de passe</Label>
              <Input
                id="password_confirmation"
                type="password"
                value={data.password_confirmation}
                onChange={(e) => setData('password_confirmation', e.target.value)}
                required
                autoComplete="new-password"
                disabled={processing}
                placeholder="Confirmez"
              />
              <InputError message={errors.password_confirmation} />
            </div>

            <div className="text-sm text-gray-600 space-y-2">
              <label className="flex items-start gap-2">
                <input
                  type="checkbox"
                  className="mt-1"
                  checked={data.accept_cgu}
                  onChange={(e) => setData('accept_cgu', e.target.checked)}
                  required
                />
                <span>
                  J'accepte les{' '}
                  <Link href="/cgu" className="text-[#247BA0] hover:underline" target="_blank">
                    conditions générales
                  </Link>
                  , les{' '}
                  <Link href="/mentions-legales" className="text-[#247BA0] hover:underline" target="_blank">
                    mentions légales
                  </Link>{' '}
                  et la{' '}
                  <Link href="/confidentialite" className="text-[#247BA0] hover:underline" target="_blank">
                    politique de confidentialité
                  </Link>
                  .
                </span>
              </label>
              <InputError message={errors.accept_cgu} />
            </div>

            <Button
              type="submit"
              className="w-full mt-2 bg-[#247BA0] hover:bg-[#3498DB] text-white"
              disabled={processing}
            >
              {processing && <LoaderCircle className="h-4 w-4 animate-spin mr-2" />}
              Créer mon compte
            </Button>
          </form>

          <div className="text-center text-sm mt-6 text-gray-600">
            Vous avez déjà un compte ?{' '}
            <Link href={route('login')} className="text-[#247BA0] hover:underline">
              Se connecter
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
