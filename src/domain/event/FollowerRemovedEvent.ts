import Profile from '../entities/Profile';
import DomainEvent from './DomainEvent';

export default class FollowerRemovedEvent implements DomainEvent {
  name: string = this.constructor.name;

  constructor(
    public readonly followed: Profile,
    public readonly follower: Profile,
  ) { }
}
