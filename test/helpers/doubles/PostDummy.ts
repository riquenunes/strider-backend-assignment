import { OriginalPost, PostID } from '../../../src/domain/entities/Post';
import chance from 'chance';

export default class PostDummy extends OriginalPost {
  constructor(overrides: Partial<OriginalPost> = {}) {
    super(
      overrides.id || new PostID(chance().guid()),
      overrides.author || chance().twitter().substring(1),
      overrides.createdAt || chance().date(),
      overrides.content || chance().sentence(),
    );
  }
}
