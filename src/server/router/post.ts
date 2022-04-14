import { FastifyInstance } from 'fastify';
import PostController from '../controllers/PostController';

export default (controller: PostController) => async (app: FastifyInstance) => {
  return app
    .get('', controller.fetchHomePosts.bind(controller))
    .post('', controller.create.bind(controller))
    .post('/:postId/quote', controller.quote.bind(controller))
    .post('/:postId/repost', controller.repost.bind(controller));
}
