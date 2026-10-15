import { createApp } from './app.js';
import { config } from './config.js';

createApp().listen(config.port, () => {
  const bugs = config.bugs.size ? ` (planted bugs: ${[...config.bugs].join(', ')})` : '';
  console.log(`API listening on http://localhost:${config.port}${bugs}`);
});
