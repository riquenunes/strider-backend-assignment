import knex from 'knex';
import dbConfig from '../../config/database';
import CreatePost from '../application/use-cases/CreatePost';
import Mediator from '../domain/services/Mediator';
import PostCreator from '../domain/services/PostCreator';
import PostController from '../server/controllers/PostController';
import PGPostRepository from './PGPostRepository';
import PGProfileRepository from './PGProfileRepository';

const db = knex(dbConfig);

const repositories = {
  post: new PGPostRepository(db),
  profile: new PGProfileRepository(db),
};

const mediator = new Mediator();

const domainServices = {
  postCreator: new PostCreator(
    mediator,
    repositories.post,
    repositories.profile
  ),
};

const useCases = {
  createPost: new CreatePost(domainServices.postCreator),
};

const controllers = {
  post: new PostController(
    useCases.createPost,
  ),
};

const container = {
  db,
  repositories,
  useCases,
  controllers,
}

export default container;
export type Container = typeof container;
