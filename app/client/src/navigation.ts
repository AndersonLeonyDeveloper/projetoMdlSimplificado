import type { TranslationKey } from './i18n/en';

interface NavLinkItem {
  to: string;
  label: TranslationKey;
  testId: string;
}

export const adminNav: NavLinkItem[] = [
  { to: '/admin', label: 'nav.dashboard', testId: 'nav-dashboard' },
  { to: '/admin/notices', label: 'nav.notices', testId: 'nav-notices' },
  { to: '/admin/reservations', label: 'nav.reservations', testId: 'nav-reservations' },
];

export const residentNav: NavLinkItem[] = [
  { to: '/home', label: 'nav.home', testId: 'nav-home' },
  { to: '/notices', label: 'nav.notices', testId: 'nav-notices' },
  { to: '/reservations', label: 'nav.myReservations', testId: 'nav-reservations' },
];
