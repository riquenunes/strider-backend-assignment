import UnfollowProfile from '../../src/application/use-cases/UnfollowProfile';
import FollowerRemovedEvent from '../../src/domain/event/FollowerRemovedEvent';
import ProfileRepository from '../../src/domain/repository/ProfileRepository';
import Mediator from '../../src/domain/services/Mediator';
import MediatorStub from '../helpers/doubles/MediatorStub';

import ProfileDummy from '../helpers/doubles/ProfileDummy';
import ProfileRepositoryStub from '../helpers/doubles/ProfileRepositoryStub';

describe('Unfollowing tests', () => {
  let mediator: Mediator;
  let profileRepository: ProfileRepository;

  beforeEach(() => {
    mediator = new MediatorStub();
    profileRepository = new ProfileRepositoryStub();
  });

  it('unfollows a profile', async () => {
    const followed = new ProfileDummy({ postCountToday: 0 });
    const follower = new ProfileDummy({ postCountToday: 0 });

    profileRepository.fetchProfile = jest.fn().mockImplementation((username) => {
      if (username === follower.username) return Promise.resolve(follower);

      return Promise.resolve(followed);
    });

    const unfollowProfileUseCase = new UnfollowProfile(
      profileRepository,
      mediator,
    );

    await unfollowProfileUseCase.execute(
      follower.username,
      followed.username,
    );

    expect(profileRepository.removeFollower).toHaveBeenCalledWith(followed, follower);
    expect(mediator.publish).toHaveBeenCalledWith(expect.any(FollowerRemovedEvent));
  });
});
