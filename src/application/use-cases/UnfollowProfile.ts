import FollowerRemovedEvent from '../../domain/event/FollowerRemovedEvent';
import ProfileRepository from '../../domain/repository/ProfileRepository';
import Mediator from '../../domain/services/Mediator';

export default class UnfollowProfile {
  constructor(
    private readonly profileRepository: ProfileRepository,
    private readonly mediator: Mediator,
  ) { }

  public async execute(username: string, usernameToBeUnfollowed: string): Promise<void> {
    const [follower, toBeUnfollowed] = await Promise.all([
      this.profileRepository.fetchProfile(username),
      this.profileRepository.fetchProfile(usernameToBeUnfollowed)
    ]);

    follower.unfollow(toBeUnfollowed);

    await this.profileRepository.removeFollower(toBeUnfollowed, follower);

    this.mediator.publish(new FollowerRemovedEvent(toBeUnfollowed, follower));
  }
}
