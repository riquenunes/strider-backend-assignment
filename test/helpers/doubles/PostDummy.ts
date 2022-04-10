import Post, { PostID } from '../../../src/domain/entities/Post';
import chance from 'chance';

export default class PostDummy extends Post {
  constructor(overrides: Partial<Post> = {}) {
    super(
      overrides.id || new PostID(chance().guid()),
      overrides.author || chance().twitter().substring(1),
      overrides.content || chance().sentence(),
      overrides.createdAt || chance().date(),
    );
  }
}
