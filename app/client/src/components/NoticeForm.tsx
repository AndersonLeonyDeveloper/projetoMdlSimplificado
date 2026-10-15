import { useState, type FormEvent } from 'react';

import type { Notice } from '../types';

interface NoticeFormProps {
  notice?: Notice;
  onSubmit: (values: { title: string; body: string }) => Promise<void>;
  onCancel?: () => void;
}

export function NoticeForm({ notice, onSubmit, onCancel }: NoticeFormProps) {
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
      setError(err instanceof Error ? err.message : 'Unable to save the notice');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form className="card" onSubmit={handleSubmit} noValidate data-testid="notice-form">
      <h2>{notice ? 'Edit notice' : 'New notice'}</h2>
      {error && (
        <div role="alert" className="alert alert-error" data-testid="notice-form-error">
          {error}
        </div>
      )}
      <label>
        Title
        <input value={title} onChange={(event) => setTitle(event.target.value)} data-testid="notice-title-input" />
      </label>
      <label>
        Body
        <textarea
          rows={4}
          value={body}
          onChange={(event) => setBody(event.target.value)}
          data-testid="notice-body-input"
        />
      </label>
      <div className="row">
        <button type="submit" disabled={submitting} data-testid="notice-submit">
          {notice ? 'Save changes' : 'Publish notice'}
        </button>
        {onCancel && (
          <button type="button" className="secondary" onClick={onCancel} data-testid="notice-form-cancel">
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
