import { FastifyInstance } from 'fastify';
import PostController from '../controllers/PostController';
import ProfileController from '../controllers/ProfileController';
import profileRouter from './profile';
import postRouter from './post';
import errorHandler from '../plugins/error-handler';
import authorization from '../plugins/authorization';

export default (
  profileController: ProfileController,
  postController: PostController,
) => (app: FastifyInstance) => {
  return app
    .decorateRequest('username', 'supermax') // sets the default value for the username
    .addHook('onRequest', authorization)
    .register(profileRouter(profileController), { prefix: '/profiles' })
    .register(postRouter(postController), { prefix: '/posts' })
    .setErrorHandler(errorHandler);
}
