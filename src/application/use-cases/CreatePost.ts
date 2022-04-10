import Post, { PostID } from '../../domain/entities/Post';
import PostCreator from '../../domain/services/PostCreator';

export default class CreatePost {
  constructor(
    private readonly postCreator: PostCreator,
  ) { }

  public async execute(username: string, content: string): Promise<Post> {
    const post = new Post(
      new PostID(),
      username,
      content,
      new Date(),
    );

    await this.postCreator.create(username, post);

    return post;
  }
}
