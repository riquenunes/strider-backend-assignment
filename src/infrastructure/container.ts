import knex from 'knex';
import dbConfig from '../../config/database';
import FetchHomepagePosts from '../application/queries/fetch-homepage-posts/FetchHomepagePosts';
import FetchProfile from '../application/queries/fetch-profile/FetchProfile';
import FetchProfilePosts from '../application/queries/fetch-profile-posts/FetchProfilePosts';
import CreatePost from '../application/use-cases/CreatePost';
import CreatePostQuote from '../application/use-cases/CreatePostQuote';
import CreateRepost from '../application/use-cases/CreateRepost';
import FollowProfile from '../application/use-cases/FollowProfile';
import UnfollowProfile from '../application/use-cases/UnfollowProfile';
import Mediator from '../domain/services/Mediator';
import PostCreator from '../domain/services/PostCreator';
import PostController from '../server/controllers/PostController';
import ProfileController from '../server/controllers/ProfileController';
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
  createPostQuote: new CreatePostQuote(domainServices.postCreator, repositories.post),
  createRepost: new CreateRepost(domainServices.postCreator, repositories.post),
  followProfile: new FollowProfile(repositories.profile, mediator),
  unfollowProfile: new UnfollowProfile(repositories.profile, mediator),
};

const queries = {
  fetchProfilePosts: new FetchProfilePosts(db),
  fetchHomepagePosts: new FetchHomepagePosts(db),
  fetchProfile: new FetchProfile(db),
}

const controllers = {
  post: new PostController(
    useCases.createPost,
    useCases.createPostQuote,
    useCases.createRepost,
    queries.fetchHomepagePosts,
  ),
  profile: new ProfileController(
    useCases.followProfile,
    useCases.unfollowProfile,
    queries.fetchProfile,
    queries.fetchProfilePosts,
  ),
};

const container = {
  db,
  repositories,
  useCases,
  queries,
  controllers,
}

export default container;
export type Container = typeof container;
