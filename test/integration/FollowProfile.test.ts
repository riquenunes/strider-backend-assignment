import FollowProfile from '../../src/application/use-cases/FollowProfile';
import FollowerAddedEvent from '../../src/domain/event/FollowerAddedEvent';
import ProfileRepository from '../../src/domain/repository/ProfileRepository';
import Mediator from '../../src/domain/services/Mediator';
import MediatorStub from '../helpers/doubles/MediatorStub';

import ProfileDummy from '../helpers/doubles/ProfileDummy';
import ProfileRepositoryStub from '../helpers/doubles/ProfileRepositoryStub';

describe('Following tests', () => {
  let mediator: Mediator;
  let profileRepository: ProfileRepository;

  beforeEach(() => {
    mediator = new MediatorStub();
    profileRepository = new ProfileRepositoryStub();
  });

  it('follows a profile', async () => {
    const followed = new ProfileDummy({ postCountToday: 0 });
    const follower = new ProfileDummy({ postCountToday: 0 });

    profileRepository.fetchProfile = jest.fn().mockImplementation((username) => {
      if (username === follower.username) return Promise.resolve(follower);

      return Promise.resolve(followed);
    });

    const followProfileUseCase = new FollowProfile(
      profileRepository,
      mediator,
    );

    await followProfileUseCase.execute(
      follower.username,
      followed.username,
    );

    expect(profileRepository.addFollower).toHaveBeenCalledWith(followed, follower);
    expect(mediator.publish).toHaveBeenCalledWith(expect.any(FollowerAddedEvent));
  });
});
