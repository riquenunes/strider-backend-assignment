import container from '../infrastructure/container';
import { buildServer } from './server';

buildServer(container)
  .then(server => {
    server.listen(1337, '0.0.0.0');
    process.on('SIGINT', async () => {
      await server.close();
      await container.db.destroy();
      process.exit(0);
    });
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
