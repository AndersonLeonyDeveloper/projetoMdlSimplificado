import { useState, type FormEvent } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';

import { homePathFor, useAuth } from '../auth/AuthContext';
import { useI18n } from '../i18n/I18nProvider';
import { WaveIcon } from '../components/icons';

export function LoginPage() {
  const { user, loading, login } = useAuth();
  const navigate = useNavigate();
  const { t, translateError } = useI18n();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ username?: string; password?: string }>({});
  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (!loading && user) return <Navigate to={homePathFor(user)} replace />;

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setFormError('');

    const nextErrors: typeof errors = {};
    if (!username.trim()) nextErrors.username = t('login.usernameRequired');
    if (!password) nextErrors.password = t('login.passwordRequired');
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setSubmitting(true);
    try {
      const loggedUser = await login(username.trim(), password);
      navigate(homePathFor(loggedUser), { replace: true });
    } catch (error) {
      setFormError(translateError(error, 'login.failed'));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="login-wrapper">
      <form className="card login-card" onSubmit={handleSubmit} noValidate data-testid="login-form">
        <span className="brand-mark">
          <WaveIcon />
        </span>
        <h1>{t('app.name')}</h1>
        <p className="muted">{t('login.subtitle')}</p>

        {formError && (
          <div role="alert" className="alert alert-error" data-testid="login-error">
            {formError}
          </div>
        )}

        <label>
          {t('login.username')}
          <input
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            autoComplete="username"
            data-testid="login-username"
          />
          {errors.username && (
            <span className="field-error" data-testid="login-username-error">
              {errors.username}
            </span>
          )}
        </label>

        <label>
          {t('login.password')}
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            autoComplete="current-password"
            data-testid="login-password"
          />
          {errors.password && (
            <span className="field-error" data-testid="login-password-error">
              {errors.password}
            </span>
          )}
        </label>

        <button type="submit" disabled={submitting} data-testid="login-submit">
          {t('login.submit')}
        </button>
      </form>
    </div>
  );
}
