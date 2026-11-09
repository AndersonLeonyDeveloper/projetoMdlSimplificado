import { useCallback, useEffect, useState } from 'react';

import { api } from '../api';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { Layout } from '../components/Layout';
import { NoticeForm } from '../components/NoticeForm';
import { useI18n } from '../i18n/I18nProvider';
import { adminNav, residentNav } from '../navigation';
import type { Notice, NoticePage } from '../types';

// Shared by both roles. Only the admin sees the write controls.
export function NoticesPage({ canManage }: { canManage: boolean }) {
  const { t, translateError, formatDateTime } = useI18n();
  const [data, setData] = useState<NoticePage | null>(null);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [error, setError] = useState('');
  const [editing, setEditing] = useState<Notice | null>(null);
  const [deleting, setDeleting] = useState<Notice | null>(null);

  const load = useCallback(async () => {
    try {
      const query = new URLSearchParams({ page: String(page), search });
      setData(await api<NoticePage>(`/notices?${query}`));
      setError('');
    } catch (err) {
      setError(translateError(err, 'notices.loadFailed'));
    }
  }, [page, search, translateError]);

  useEffect(() => {
    load();
  }, [load]);

  async function publish(values: { title: string; body: string }) {
    await api('/notices', { method: 'POST', body: values });
    setPage(1);
    await load();
  }

  async function saveEdit(values: { title: string; body: string }) {
    if (!editing) return;
    await api(`/notices/${editing.id}`, { method: 'PUT', body: values });
    setEditing(null);
    await load();
  }

  async function confirmDelete() {
    if (!deleting) return;
    try {
      await api(`/notices/${deleting.id}`, { method: 'DELETE' });
      setDeleting(null);
      await load();
    } catch (err) {
      setDeleting(null);
      setError(translateError(err, 'notices.deleteFailed'));
    }
  }

  return (
    <Layout nav={canManage ? adminNav : residentNav}>
      <h1 data-testid="notices-title">{canManage ? t('notices.titleAdmin') : t('notices.titleResident')}</h1>

      {error && (
        <div role="alert" className="alert alert-error" data-testid="notices-error">
          {error}
        </div>
      )}

      {canManage && (
        <div className="stack" style={{ marginBottom: '1.5rem' }}>
          <NoticeForm onSubmit={publish} />
        </div>
      )}

      <div className="toolbar">
        <input
          type="search"
          placeholder={t('notices.search')}
          value={search}
          onChange={(event) => {
            setSearch(event.target.value);
            setPage(1);
          }}
          data-testid="notice-search"
        />
        {search && (
          <button type="button" className="secondary" onClick={() => setSearch('')} data-testid="notice-search-clear">
            {t('notices.clear')}
          </button>
        )}
      </div>

      {data && data.items.length === 0 && <p data-testid="notices-empty">{t('notices.empty')}</p>}

      <div className="stack" data-testid="notice-list">
        {data?.items.map((notice) =>
          editing?.id === notice.id ? (
            <NoticeForm key={notice.id} notice={notice} onSubmit={saveEdit} onCancel={() => setEditing(null)} />
          ) : (
            <article key={notice.id} className="card notice" data-testid="notice-item">
              <h3 data-testid="notice-item-title">{notice.title}</h3>
              <time dateTime={notice.createdAt} data-testid="notice-item-date">
                {formatDateTime(notice.createdAt)}
              </time>
              <p data-testid="notice-item-body">{notice.body}</p>
              {canManage && (
                <div className="row">
                  <button
                    type="button"
                    className="secondary"
                    onClick={() => setEditing(notice)}
                    data-testid="notice-edit"
                  >
                    {t('notices.edit')}
                  </button>
                  <button type="button" className="danger" onClick={() => setDeleting(notice)} data-testid="notice-delete">
                    {t('notices.delete')}
                  </button>
                </div>
              )}
            </article>
          ),
        )}
      </div>

      {data && data.totalPages > 1 && (
        <div className="pagination" data-testid="notices-pagination">
          <button type="button" className="secondary" disabled={page <= 1} onClick={() => setPage(page - 1)} data-testid="page-prev">
            {t('notices.previous')}
          </button>
          <span data-testid="page-indicator">
            {t('notices.page', { page: data.page, total: data.totalPages })}
          </span>
          <button
            type="button"
            className="secondary"
            disabled={page >= data.totalPages}
            onClick={() => setPage(page + 1)}
            data-testid="page-next"
          >
            {t('notices.next')}
          </button>
        </div>
      )}

      {deleting && (
        <ConfirmDialog
          title={t('notices.deleteTitle')}
          message={t('notices.deleteMessage', { title: deleting.title })}
          confirmLabel={t('notices.delete')}
          onConfirm={confirmDelete}
          onCancel={() => setDeleting(null)}
        />
      )}
    </Layout>
  );
}
