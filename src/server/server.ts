import './types/fastify';
import fastify from 'fastify';
import { Container } from '../infrastructure/container';
import router from './router';

export const buildServer = async ({ db, controllers }: Container) => {
  try {
    const server = fastify({ logger: process.env.NODE_ENV !== 'test' });

    await db.migrate.latest();
    await db.seed.run();

    server
      .register(router(
        controllers.profile,
        controllers.post,
      ));

    return server;
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}
