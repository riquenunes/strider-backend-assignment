import Post from '../entities/Post';
import Profile from '../entities/Profile';

export default class PostCreatedEvent {
  constructor(
    public readonly post: Post,
    public readonly profile: Profile,
  ) { }
}
