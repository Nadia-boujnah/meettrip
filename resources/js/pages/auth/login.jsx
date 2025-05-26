import { Head, useForm } from '@inertiajs/react';
import logo from '@/assets/images/logomeettrip.png';
import { Link } from '@inertiajs/react'; 

export default function Login({ status, canResetPassword }) {
  const { data, setData, post, processing, errors, reset } = useForm({
    email: '',
    password: '',
    remember: false,
  });

  const submit = (e) => {
    e.preventDefault();
    post(route('login'), {
      onFinish: () => reset('password'),
    });
  };

  return (
    <>
      <Head title="Connexion" />
      <div className="min-h-screen bg-[#F9F9F9] flex items-center justify-center px-4">
        <div className="bg-white rounded-lg shadow-md w-full max-w-md p-8">
        <div className="flex justify-center mb-6">
            <Link href="/">
            <img src={logo} alt="Logo MeetTrip" className="h-16 hover:opacity-80 transition" />
            </Link>
        </div>

          <h1 className="text-2xl font-bold text-center text-[#247BA0] mb-6">
            Connexion à <span className="text-[#1B1B18]">MeetTrip</span>
          </h1>

          {status && (
            <div className="mb-4 text-sm text-center font-medium text-green-600">
              {status}
            </div>
          )}

          <form onSubmit={submit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-1">
                Adresse email
              </label>
              <input
                id="email"
                type="email"
                value={data.email}
                onChange={(e) => setData('email', e.target.value)}
                required
                className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-[#247BA0] focus:outline-none"
                placeholder="exemple@mail.com"
              />
              {errors.email && <p className="text-sm text-red-500 mt-1">{errors.email}</p>}
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label htmlFor="password" className="text-sm font-medium">
                  Mot de passe
                </label>
                {canResetPassword && (
                  <a href={route('password.request')} className="text-sm text-[#247BA0] hover:underline">
                    Mot de passe oublié ?
                  </a>
                )}
              </div>
              <input
                id="password"
                type="password"
                value={data.password}
                onChange={(e) => setData('password', e.target.value)}
                required
                className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-[#247BA0] focus:outline-none"
                placeholder="●●●●●●●●"
              />
              {errors.password && <p className="text-sm text-red-500 mt-1">{errors.password}</p>}
            </div>

            <div className="flex items-center">
              <input
                id="remember"
                type="checkbox"
                checked={data.remember}
                onChange={(e) => setData('remember', e.target.checked)}
                className="mr-2"
              />
              <label htmlFor="remember" className="text-sm">Se souvenir de moi</label>
            </div>

            <button
              type="submit"
              disabled={processing}
              className="w-full bg-[#247BA0] hover:bg-[#3498DB] text-white font-semibold py-2 rounded-md transition"
            >
              Se connecter
            </button>
          </form>

          <p className="text-center text-sm text-gray-600 mt-6">
            Pas encore de compte ?{' '}
            <a href={route('register')} className="text-[#247BA0] hover:underline">
              Inscription
            </a>
          </p>
        </div>
      </div>
    </>
  );
}
