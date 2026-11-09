import { Link } from 'react-router-dom';

import { useAuth } from '../auth/AuthContext';
import { ArrowIcon, CalendarIcon, MegaphoneIcon } from '../components/icons';
import { useI18n } from '../i18n/I18nProvider';
import { Layout } from '../components/Layout';
import { adminNav } from '../navigation';

export function AdminDashboard() {
  const { user } = useAuth();
  const { t } = useI18n();

  return (
    <Layout nav={adminNav}>
      <h1 data-testid="admin-dashboard-title">{t('admin.title')}</h1>
      <p className="lead">{t('common.welcome', { name: user?.name ?? '' })}</p>
      <div className="grid">
        <Link className="card tile" to="/admin/notices" data-testid="tile-manage-notices">
          <span className="tile-icon">
            <MegaphoneIcon />
          </span>
          {t('admin.manageNotices')}
          <span className="tile-desc">{t('admin.manageNoticesDesc')}</span>
          <span className="tile-arrow">
            <ArrowIcon />
          </span>
        </Link>
        <Link className="card tile" to="/admin/reservations" data-testid="tile-all-reservations">
          <span className="tile-icon">
            <CalendarIcon />
          </span>
          {t('admin.allReservations')}
          <span className="tile-desc">{t('admin.allReservationsDesc')}</span>
          <span className="tile-arrow">
            <ArrowIcon />
          </span>
        </Link>
      </div>
    </Layout>
  );
}
