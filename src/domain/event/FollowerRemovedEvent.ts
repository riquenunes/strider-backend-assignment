import Profile from '../entities/Profile';

export default class FollowerRemovedEvent {
  constructor(
    public readonly followed: Profile,
    public readonly follower: Profile,
  ) { }
}
