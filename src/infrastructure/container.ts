import knex from 'knex';
import dbConfig from '../../config/database';
import OnFollowerAdded from '../application/event-handlers/OnFollowerAdded';
import OnFollowerRemoved from '../application/event-handlers/OnFollowerRemoved';
import OnPostCreated from '../application/event-handlers/OnPostCreated';
import FetchHomepagePosts from '../application/queries/fetch-posts/fetch-homepage-posts/FetchHomepagePosts';
import FetchProfile from '../application/queries/fetch-profile/FetchProfile';
import FetchProfilePosts from '../application/queries/fetch-posts/fetch-profile-posts/FetchProfilePosts';
import CreatePost from '../application/use-cases/CreatePost';
import CreatePostQuote from '../application/use-cases/CreatePostQuote';
import CreateRepost from '../application/use-cases/CreateRepost';
import FollowProfile from '../application/use-cases/FollowProfile';
import UnfollowProfile from '../application/use-cases/UnfollowProfile';
import FollowerAddedEvent from '../domain/event/FollowerAddedEvent';
import FollowerRemovedEvent from '../domain/event/FollowerRemovedEvent';
import PostCreatedEvent from '../domain/event/PostCreatedEvent';
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

mediator
  .register(FollowerAddedEvent.name, new OnFollowerAdded(repositories.profile))
  .register(FollowerRemovedEvent.name, new OnFollowerRemoved(repositories.profile))
  .register(PostCreatedEvent.name, new OnPostCreated(repositories.profile));

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
