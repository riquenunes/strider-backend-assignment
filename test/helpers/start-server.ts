import container from '../../src/infrastructure/container';
import { buildServer } from '../../src/server/server';
import appConfig from '../../config/application';

export default async function startServer() {
  const server = await buildServer(container);
  await server.listen(appConfig.port);

  return server;
}
