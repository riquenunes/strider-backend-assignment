import Post from '../entities/Post';
import PostCreatedEvent from '../event/PostCreatedEvent';
import PostRepository from '../repository/PostRepository';
import ProfileRepository from '../repository/ProfileRepository';
import Mediator from './Mediator';

export default class PostCreator {
  constructor(
    private readonly mediator: Mediator,
    private readonly postRepository: PostRepository,
    private readonly profileRepository: ProfileRepository,
  ) { }

  async create(
    username: string,
    post: Post,
  ): Promise<void> {
    post.validate();

    const profile = await this.profileRepository.fetchProfile(username);

    profile.validateTodaysPostCount();

    await this.postRepository.createPost(post);

    this.mediator.publish(new PostCreatedEvent(post, profile));
  }
}
