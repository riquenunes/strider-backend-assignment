import Post, { OriginalPost, PostID } from '../../domain/entities/Post';
import PostCreator from '../../domain/services/PostCreator';

export default class CreatePost {
  constructor(
    private readonly postCreator: PostCreator,
  ) { }

  public async execute(username: string, content: string): Promise<Post> {
    const post = new OriginalPost(
      new PostID(),
      username,
      new Date(),
      content,
    );

    await this.postCreator.create(username, post);

    return post;
  }
}
