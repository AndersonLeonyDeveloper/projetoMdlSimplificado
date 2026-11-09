import { useState, type FormEvent } from 'react';

import { useI18n } from '../i18n/I18nProvider';
import type { Notice } from '../types';

interface NoticeFormProps {
  notice?: Notice;
  onSubmit: (values: { title: string; body: string }) => Promise<void>;
  onCancel?: () => void;
}

export function NoticeForm({ notice, onSubmit, onCancel }: NoticeFormProps) {
  const { t, translateError } = useI18n();
  const [title, setTitle] = useState(notice?.title ?? '');
  const [body, setBody] = useState(notice?.body ?? '');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await onSubmit({ title, body });
      if (!notice) {
        setTitle('');
        setBody('');
      }
    } catch (err) {
      setError(translateError(err, 'noticeForm.failed'));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form className="card" onSubmit={handleSubmit} noValidate data-testid="notice-form">
      <h2>{notice ? t('noticeForm.edit') : t('noticeForm.new')}</h2>
      {error && (
        <div role="alert" className="alert alert-error" data-testid="notice-form-error">
          {error}
        </div>
      )}
      <label>
        {t('noticeForm.title')}
        <input value={title} onChange={(event) => setTitle(event.target.value)} data-testid="notice-title-input" />
      </label>
      <label>
        {t('noticeForm.body')}
        <textarea
          rows={4}
          value={body}
          onChange={(event) => setBody(event.target.value)}
          data-testid="notice-body-input"
        />
      </label>
      <div className="row">
        <button type="submit" disabled={submitting} data-testid="notice-submit">
          {notice ? t('noticeForm.save') : t('noticeForm.publish')}
        </button>
        {onCancel && (
          <button type="button" className="secondary" onClick={onCancel} data-testid="notice-form-cancel">
            {t('common.cancel')}
          </button>
        )}
      </div>
    </form>
  );
}
