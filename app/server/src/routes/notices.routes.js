import { Router } from 'express';

import { badRequest, notFound } from '../errors.js';
import { authenticate, requireRole } from '../middleware/auth.js';
import { now, state } from '../store.js';

export const TITLE_MAX_LENGTH = 100;
export const PAGE_SIZE = 10;

const router = Router();

router.use(authenticate);

function validate(body) {
  const title = typeof body?.title === 'string' ? body.title.trim() : '';
  const text = typeof body?.body === 'string' ? body.body.trim() : '';

  if (!title) throw badRequest('Title is required');
  if (title.length > TITLE_MAX_LENGTH) {
    throw badRequest(`Title must be at most ${TITLE_MAX_LENGTH} characters`);
  }
  if (!text) throw badRequest('Body is required');

  return { title, body: text };
}

function findNotice(id) {
  const notice = state.notices.find((candidate) => candidate.id === Number(id));
  if (!notice) throw notFound('Notice not found');
  return notice;
}

// Any authenticated user: newest first, paginated, optional title filter.
router.get('/', (req, res) => {
  const page = Math.max(1, Number.parseInt(req.query.page, 10) || 1);
  const search = String(req.query.search ?? '').trim().toLowerCase();

  const filtered = state.notices
    .filter((notice) => !search || notice.title.toLowerCase().includes(search))
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt) || b.id - a.id);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const start = (page - 1) * PAGE_SIZE;

  res.json({
    items: filtered.slice(start, start + PAGE_SIZE),
    page,
    pageSize: PAGE_SIZE,
    total: filtered.length,
    totalPages,
  });
});

router.get('/:id', (req, res, next) => {
  try {
    res.json(findNotice(req.params.id));
  } catch (error) {
    next(error);
  }
});

router.post('/', requireRole('admin'), (req, res, next) => {
  try {
    const fields = validate(req.body);
    const notice = {
      id: state.nextNoticeId++,
      ...fields,
      createdAt: now().toISOString(),
      updatedAt: null,
    };
    state.notices.push(notice);
    res.status(201).json(notice);
  } catch (error) {
    next(error);
  }
});

router.put('/:id', requireRole('admin'), (req, res, next) => {
  try {
    const notice = findNotice(req.params.id);
    Object.assign(notice, validate(req.body), { updatedAt: now().toISOString() });
    res.json(notice);
  } catch (error) {
    next(error);
  }
});

router.delete('/:id', requireRole('admin'), (req, res, next) => {
  try {
    const notice = findNotice(req.params.id);
    state.notices.splice(state.notices.indexOf(notice), 1);
    res.status(204).end();
  } catch (error) {
    next(error);
  }
});

export default router;
