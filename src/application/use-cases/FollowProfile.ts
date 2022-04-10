import FollowerAddedEvent from '../../domain/event/FollowerAddedEvent';
import ProfileRepository from '../../domain/repository/ProfileRepository';
import Mediator from '../../domain/services/Mediator';

export default class FollowProfile {
  constructor(
    private readonly profileRepository: ProfileRepository,
    private readonly mediator: Mediator,
  ) { }

  public async execute(followerUsername: string, followedUsername: string): Promise<void> {
    const [follower, followedProfile] = await Promise.all([
      this.profileRepository.fetchProfile(followerUsername),
      this.profileRepository.fetchProfile(followedUsername)
    ]);

    await this.profileRepository.addFollower(followedProfile, follower);

    this.mediator.publish(new FollowerAddedEvent(followedProfile, follower));
  }
}
