import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';

import { Link, router, usePage } from '@inertiajs/react';
import {
  Home,
  User,
  Mail,
  Newspaper,
  Settings,
  LogOut,
  Handshake,
  CalendarCheck,
  Map,
  ListTodo,
} from 'lucide-react';

import logoMeetTrip from '@/assets/images/logomeettrip.png';

const mainNavItems = [
  { title: 'Profil', url: '/profil', icon: User },
  { title: 'Activités', url: '/activitesconnected', icon: Handshake },
  { title: 'Mes réservations', url: '/my-reservations', icon: CalendarCheck },
  { title: 'Carte', url: '/carte', icon: Map },
  { title: 'Messagerie', url: '/messagerie', icon: Mail }, // le badge sera injecté dynamiquement
  { title: 'Annonces', url: '/annonces', icon: Newspaper },
];

const adminNavItems = [
  { title: 'Accueil', url: '/admin/dashboard', icon: Home },
  { title: 'Profil des membres', url: '/admin/admin-organizers', icon: Handshake },
  { title: 'Validation Identités', url: '/admin/identity-validation', icon: CalendarCheck },
  { title: 'Statistiques', url: '/admin/statistics', icon: Map },
  { title: 'Vue des activités', url: '/admin/admin-activities', icon: ListTodo },
];

const footerNavItems = [
  { title: 'Paramètres', url: '/parametres', icon: Settings },
];

export function AppSidebar() {
  const page = usePage();
  const { auth, host, messaging } = page.props;

  const pendingCount = host?.pending_reservations || 0;

  // 🔵 Ici on récupère le total non lus (fourni par le back via HandleInertiaRequests)
  const unreadMessages = messaging?.unread_total ?? 0;

  // Construire la liste d’items avec les badges
  const isAdmin = auth?.user && auth.user.role === 'admin';
  let navItems = isAdmin ? [...adminNavItems] : [...mainNavItems];

  if (!isAdmin) {
    // Injecter le badge sur "Messagerie"
    navItems = navItems.map((it) =>
      it.title === 'Messagerie' ? { ...it, badge: unreadMessages > 0 ? unreadMessages : null } : it
    );

    // Ajouter "Demandes reçues" avec son badge existant
    navItems = [
      ...navItems,
      {
        title: 'Demandes reçues',
        url: '/host/reservations',
        icon: ListTodo,
        badge: pendingCount > 0 ? pendingCount : null,
      },
    ];
  }

  return (
    <Sidebar collapsible="icon" variant="inset">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link
                href={isAdmin ? '/admin/dashboard' : '/profil'}
                prefetch
                className="flex items-center gap-2 px-2 pt-4 mb-9"
              >
                <img src={logoMeetTrip} alt="MeetTrip Logo" className="h-12" />
                <span className="text-[#2C7CA9] text-lg font-semibold">MeetTrip</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarMenu>
          {navItems.map((item) => (
            <SidebarMenuItem key={item.url}>
              <SidebarMenuButton asChild>
                <Link href={item.url} className="flex items-center justify-between w-full">
                  <span className="flex items-center gap-2">
                    <item.icon className="w-5 h-5" />
                    <span>{item.title}</span>
                  </span>
                  {item.badge ? (
                    <span className="bg-blue-500 text-white text-xs font-semibold px-2 py-0.5 rounded-full">
                      {item.badge}
                    </span>
                  ) : null}
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          {footerNavItems.map((item) => (
            <SidebarMenuItem key={item.url}>
              <SidebarMenuButton asChild>
                <Link
                  href={item.url}
                  className="flex items-center gap-2 text-sm px-4 py-2 w-full hover:bg-gray-100 rounded"
                >
                  <item.icon className="w-5 h-5 flex-shrink-0" />
                  <span>{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}

          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={() => router.post('/logout')}
              className="flex items-center gap-2 text-sm px-4 py-2 w-full hover:bg-gray-100 rounded"
            >
              <LogOut className="w-5 h-5 flex-shrink-0" />
              <span>Déconnexion</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
