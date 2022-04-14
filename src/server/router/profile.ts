import { FastifyInstance } from 'fastify';
import ProfileController from '../controllers/ProfileController';

export default (controller: ProfileController) => async (app: FastifyInstance) => {
  return app
    .get('/:username', controller.fetch.bind(controller))
    .get('/:username/posts', controller.fetchProfilePosts.bind(controller))
    .post('/:username/follow', controller.follow.bind(controller))
    .post('/:username/unfollow', controller.unfollow.bind(controller));
}
