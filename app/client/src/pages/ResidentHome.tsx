import { Link } from 'react-router-dom';

import { useAuth } from '../auth/AuthContext';
import { ArrowIcon, CalendarIcon, MegaphoneIcon } from '../components/icons';
import { useI18n } from '../i18n/I18nProvider';
import { Layout } from '../components/Layout';
import { residentNav } from '../navigation';

export function ResidentHome() {
  const { user } = useAuth();
  const { t } = useI18n();

  return (
    <Layout nav={residentNav}>
      <h1 data-testid="resident-home-title">{t('home.title')}</h1>
      <p className="lead">{t('common.welcome', { name: user?.name ?? '' })}</p>
      <div className="grid">
        <Link className="card tile" to="/notices" data-testid="tile-notices">
          <span className="tile-icon">
            <MegaphoneIcon />
          </span>
          {t('home.notices')}
          <span className="tile-desc">{t('home.noticesDesc')}</span>
          <span className="tile-arrow">
            <ArrowIcon />
          </span>
        </Link>
        <Link className="card tile" to="/reservations" data-testid="tile-reservations">
          <span className="tile-icon">
            <CalendarIcon />
          </span>
          {t('home.reservations')}
          <span className="tile-desc">{t('home.reservationsDesc')}</span>
          <span className="tile-arrow">
            <ArrowIcon />
          </span>
        </Link>
      </div>
    </Layout>
  );
}
