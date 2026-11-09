import { useI18n, type Lang } from './I18nProvider';

export function LanguageSwitcher() {
  const { lang, setLang, t } = useI18n();

  return (
    <select
      className="lang-switcher"
      value={lang}
      onChange={(event) => setLang(event.target.value as Lang)}
      aria-label={t('lang.label')}
      data-testid="language-switcher"
    >
      <option value="en">English</option>
      <option value="pt">Português</option>
    </select>
  );
}
