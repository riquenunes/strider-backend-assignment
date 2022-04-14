import { FastifyInstance } from 'fastify';
import PostController from '../controllers/PostController';
import ProfileController from '../controllers/ProfileController';
import profileRouter from './profile';
import postRouter from './post';
import errorHandler from '../plugins/error-handler';

export default (
  profileController: ProfileController,
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
    .register(profileRouter(profileController), { prefix: '/profiles' })
    .register(postRouter(postController), { prefix: '/posts' })
    .setErrorHandler(errorHandler);
}
