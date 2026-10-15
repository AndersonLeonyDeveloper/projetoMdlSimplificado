import { useCallback, useEffect, useState } from 'react';

import { api } from '../api';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { Layout } from '../components/Layout';
import { NoticeForm } from '../components/NoticeForm';
import { adminNav, residentNav } from '../navigation';
import type { Notice, NoticePage } from '../types';

// Shared by both roles. Only the admin sees the write controls.
export function NoticesPage({ canManage }: { canManage: boolean }) {
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
      setError(err instanceof Error ? err.message : 'Unable to load notices');
    }
  }, [page, search]);

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
      setError(err instanceof Error ? err.message : 'Unable to delete the notice');
    }
  }

  return (
    <Layout nav={canManage ? adminNav : residentNav}>
      <h1 data-testid="notices-title">{canManage ? 'Manage notices' : 'Community notices'}</h1>

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
          placeholder="Search by title"
          value={search}
          onChange={(event) => {
            setSearch(event.target.value);
            setPage(1);
          }}
          data-testid="notice-search"
        />
        {search && (
          <button type="button" className="secondary" onClick={() => setSearch('')} data-testid="notice-search-clear">
            Clear
          </button>
        )}
      </div>

      {data && data.items.length === 0 && <p data-testid="notices-empty">No notices found</p>}

      <div className="stack" data-testid="notice-list">
        {data?.items.map((notice) =>
          editing?.id === notice.id ? (
            <NoticeForm key={notice.id} notice={notice} onSubmit={saveEdit} onCancel={() => setEditing(null)} />
          ) : (
            <article key={notice.id} className="card notice" data-testid="notice-item">
              <h3 data-testid="notice-item-title">{notice.title}</h3>
              <time dateTime={notice.createdAt} data-testid="notice-item-date">
                {new Date(notice.createdAt).toLocaleString()}
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
                    Edit
                  </button>
                  <button type="button" className="danger" onClick={() => setDeleting(notice)} data-testid="notice-delete">
                    Delete
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
            Previous
          </button>
          <span data-testid="page-indicator">
            Page {data.page} of {data.totalPages}
          </span>
          <button
            type="button"
            className="secondary"
            disabled={page >= data.totalPages}
            onClick={() => setPage(page + 1)}
            data-testid="page-next"
          >
            Next
          </button>
        </div>
      )}

      {deleting && (
        <ConfirmDialog
          title="Delete notice"
          message={`Are you sure you want to delete "${deleting.title}"?`}
          confirmLabel="Delete"
          onConfirm={confirmDelete}
          onCancel={() => setDeleting(null)}
        />
      )}
    </Layout>
  );
}
