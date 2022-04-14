import { FastifyInstance } from 'fastify';
import PostController from '../controllers/PostController';
import postRouter from './post';

export default (
  postController: PostController,
) => (app: FastifyInstance) => {
  return app
    .decorateRequest('username', 'supermax')
    .addHook('onRequest', (request, reply, done) => {
      if (request.headers.authorization) {
        request.username = request.headers.authorization;
      }

      done();
    })
    .register(postRouter(postController), { prefix: '/posts' });
}
