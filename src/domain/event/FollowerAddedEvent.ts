import Profile from '../entities/Profile';

export default class FollowerAddedEvent {
  constructor(
    public readonly followed: Profile,
    public readonly follower: Profile,
  ) { }
}
