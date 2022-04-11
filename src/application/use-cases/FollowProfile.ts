import FollowerAddedEvent from '../../domain/event/FollowerAddedEvent';
import ProfileRepository from '../../domain/repository/ProfileRepository';
import Mediator from '../../domain/services/Mediator';

export default class FollowProfile {
  constructor(
    private readonly profileRepository: ProfileRepository,
    private readonly mediator: Mediator,
  ) { }

  public async execute(username: string, usernameToBeFollowed: string): Promise<void> {
    const [follower, toBeFollowed] = await Promise.all([
      this.profileRepository.fetchProfile(username),
      this.profileRepository.fetchProfile(usernameToBeFollowed)
    ]);

    follower.follow(toBeFollowed);

    await this.profileRepository.addFollower(toBeFollowed, follower);

    this.mediator.publish(new FollowerAddedEvent(toBeFollowed, follower));
  }
}
