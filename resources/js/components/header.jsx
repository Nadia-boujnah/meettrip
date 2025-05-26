import { Fragment, useState } from 'react';
import { Link } from '@inertiajs/react';
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  Popover,
  PopoverButton,
  PopoverGroup,
  PopoverPanel,
} from '@headlessui/react';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import logo from '@/assets/images/logomeettrip.png';

export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Mobile menu */}
      <Dialog open={open} onClose={setOpen} className="relative z-50 lg:hidden">
        <DialogBackdrop className="fixed inset-0 bg-black/25" />
        <div className="fixed inset-0 flex z-50">
          <DialogPanel className="relative flex w-full max-w-xs flex-col bg-white pb-12 shadow-xl overflow-y-auto">
            <div className="flex px-4 pt-5 pb-2">
              <button
                type="button"
                className="inline-flex items-center justify-center rounded-md p-2 text-gray-400"
                onClick={() => setOpen(false)}
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>

            <div className="space-y-6 px-4 py-6">
              <Link href="/" className="block text-lg font-medium text-gray-900 hover:text-blue-600">Accueil</Link>
              <Link href="/activities" className="block text-lg font-medium text-gray-900 hover:text-blue-600">Activités</Link>
              <Link href="/about" className="block text-lg font-medium text-gray-900 hover:text-blue-600">À propos</Link>
              <Link href="/contact" className="block text-lg font-medium text-gray-900 hover:text-blue-600">Contact</Link>

              <div className="pt-6 border-t border-gray-200">
                <Link
                  href={route('login')}
                  className="block w-full text-center py-2 px-4 rounded-md bg-blue-100 text-blue-700 hover:bg-blue-200 mb-2"
                >
                  Connexion
                </Link>
                <Link
                  href={route('register')}
                  className="block w-full text-center py-2 px-4 rounded-md bg-blue-700 text-white hover:bg-blue-800"
                >
                  Inscription
                </Link>
              </div>
            </div>
          </DialogPanel>
        </div>
      </Dialog>

      {/* Desktop header */}
      <header className="bg-stone-50">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8 h-20" aria-label="Top">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-2">
              <img src={logo} alt="Logo MeetTrip" className="h-12 w-auto" />
              <span className="text-2xl font-bold text-[#2877A7]">MeetTrip</span>
            </Link>
          </div>

          {/* Navigation links */}
          <PopoverGroup className="hidden lg:flex lg:space-x-10">
            <Link href="/" className="text-lg font-medium text-gray-700 hover:text-blue-600">Accueil</Link>
            <Link href="/activities" className="text-lg font-medium text-gray-700 hover:text-blue-600">Activités</Link>
            <Link href="/about" className="text-lg font-medium text-gray-700 hover:text-blue-600">À propos</Link>
            <Link href="/contact" className="text-lg font-medium text-gray-700 hover:text-blue-600">Contact</Link>
          </PopoverGroup>

          {/* Auth buttons */}
          <div className="hidden lg:flex items-center gap-4">
            <Link
              href={route('login')}
              className="px-4 py-2 rounded-md bg-blue-100 text-blue-700 hover:bg-blue-200"
            >
              Connexion
            </Link>
            <Link
              href={route('register')}
              className="px-4 py-2 rounded-md bg-blue-700 text-white hover:bg-blue-800"
            >
              Inscription
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden flex items-center">
            <button
              type="button"
              className="p-2 text-gray-400"
              onClick={() => setOpen(true)}
            >
              <Bars3Icon className="h-6 w-6" />
            </button>
          </div>
        </nav>
      </header>
    </>
  );
}
