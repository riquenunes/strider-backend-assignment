import Post from '../entities/Post';
import Profile from '../entities/Profile';
import DomainEvent from './DomainEvent';

export default class PostCreatedEvent implements DomainEvent {
  public name: string = this.constructor.name;

  constructor(
    public readonly post: Post,
    public readonly profile: Profile,
  ) { }
}
