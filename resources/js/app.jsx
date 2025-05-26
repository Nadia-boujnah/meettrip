import '../css/app.css';

import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { createRoot } from 'react-dom/client';
import { initializeTheme } from './hooks/use-appearance';

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

createInertiaApp({
  title: (title) => `${title} - ${appName}`,

  resolve: async (name) => {
    const pages = import.meta.glob('./pages/**/*.jsx');
    const page = await resolvePageComponent(`./pages/${name}.jsx`, pages);

    page.default.layout = page.default.layout || ((page) => page);

    return page;
  },

  setup({ el, App, props }) {
    const root = createRoot(el);
    root.render(<App {...props} />);
  },
  

  progress: {
    color: '#4B5563',
  },
});

initializeTheme();
