import { Repost } from '../../domain/entities/Post';
import PostRepository from '../../domain/repository/PostRepository';
import PostCreator from '../../domain/services/PostCreator';

export default class CreateRepost {
  constructor(
    private readonly postCreator: PostCreator,
    private readonly postRepository: PostRepository,
  ) { }

  public async execute(username: string, postId: string): Promise<Repost> {
    const originalPost = await this.postRepository.fetchPost(postId);
    const post = originalPost.createRepost(username);

    await this.postCreator.create(username, post);

    return post;
  }
}
