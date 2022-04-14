import FollowerAddedEvent from '../../domain/event/FollowerAddedEvent';
import ProfileRepository from '../../domain/repository/ProfileRepository';
import { Handler } from '../../domain/services/Mediator';

export default class OnFollowerAdded implements Handler {
  constructor(
    private readonly profileRepository: ProfileRepository,
  ) { }

  async handle({ followed, follower }: FollowerAddedEvent): Promise<void> {
    await Promise.all([
      this.profileRepository.updateProfile(followed),
      this.profileRepository.updateProfile(follower)
    ]);
  }
}
