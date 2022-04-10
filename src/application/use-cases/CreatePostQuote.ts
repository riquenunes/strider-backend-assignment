import { PostID, QuotedPost } from '../../domain/entities/Post';
import PostRepository from '../../domain/repository/PostRepository';
import PostCreator from '../../domain/services/PostCreator';

export default class CreatePostQuote {
  constructor(
    private readonly postCreator: PostCreator,
    private readonly postRepository: PostRepository,
  ) { }

  public async execute(username: string, quote: string, postId: string): Promise<QuotedPost> {
    const originalPost = await this.postRepository.fetchPost(postId);
    const post = new QuotedPost(
      new PostID(),
      username,
      new Date(),
      originalPost,
      quote
    );

    await this.postCreator.create(username, post);

    return post;
  }
}
