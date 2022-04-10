import Post from '../entities/Post';

export default interface PostRepository {
  createPost(post: Post): Promise<void>;
  fetchPost(id: string): Promise<Post | undefined>;
}
