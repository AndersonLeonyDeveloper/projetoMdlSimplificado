import cors from 'cors';
import express from 'express';

import { config } from './config.js';
import { HttpError } from './errors.js';
import authRoutes from './routes/auth.routes.js';
import noticesRoutes from './routes/notices.routes.js';
import testRoutes from './routes/test.routes.js';

export function createApp() {
  const app = express();

  app.use(cors());
  app.use(express.json());

  app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok', bugs: [...config.bugs] });
  });

  app.use('/api/auth', authRoutes);
  app.use('/api/notices', noticesRoutes);
  if (config.testApiEnabled) app.use('/api/test', testRoutes);

  app.use('/api', (_req, res) => {
    res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Route not found' } });
  });

  // eslint-disable-next-line no-unused-vars
  app.use((err, _req, res, _next) => {
    if (err instanceof HttpError) {
      return res.status(err.status).json({ error: { code: err.code, message: err.message } });
    }
    console.error(err);
    res.status(500).json({ error: { code: 'INTERNAL_ERROR', message: 'Unexpected error' } });
  });

  return app;
}
