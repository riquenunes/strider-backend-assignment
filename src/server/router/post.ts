import { FastifyInstance } from 'fastify';
import PostController from '../controllers/PostController';

export default (controller: PostController) => async (app: FastifyInstance) => {
  return app
    .post('', controller.create.bind(controller));
}
