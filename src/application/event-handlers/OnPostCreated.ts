import PostCreatedEvent from '../../domain/event/PostCreatedEvent';
import ProfileRepository from '../../domain/repository/ProfileRepository';
import { Handler } from '../../domain/services/Mediator';

export default class OnPostCreated implements Handler {
  constructor(
    private readonly profileRepository: ProfileRepository,
  ) { }

  async handle({ profile }: PostCreatedEvent): Promise<void> {
    profile.incrementPostCount();

    await this.profileRepository.updateProfile(profile);
  }
}
