import container from '../infrastructure/container';
import { buildServer } from './server';

buildServer(container)
  .then(server => {
    server.listen(1337, '0.0.0.0');
    process.on('SIGINT', () => server.close());
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });

process.on('SIGINT', async () => {
  await container.db.destroy();
  process.exit(0);
});
