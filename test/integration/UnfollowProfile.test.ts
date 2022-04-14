import UnfollowProfile from '../../src/application/use-cases/UnfollowProfile';
import UnableToUnfollowSelf from '../../src/domain/errors/UnableToUnfollowSelf';
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
    const followed = new ProfileDummy({ todaysPostCount: 0 });
    const follower = new ProfileDummy({ todaysPostCount: 0 });

    profileRepository.fetchProfile = jest.fn().mockImplementation((username) => {
      if (username === follower.username.toString()) return Promise.resolve(follower);

      return Promise.resolve(followed);
    });

    const unfollowProfileUseCase = new UnfollowProfile(
      profileRepository,
      mediator,
    );

    await unfollowProfileUseCase.execute(
      follower.username.toString(),
      followed.username.toString(),
    );

    expect(profileRepository.removeFollower).toHaveBeenCalledWith(followed, follower);
    expect(mediator.publish).toHaveBeenCalledWith(expect.any(FollowerRemovedEvent));
  });

  it('throws an error when trying to unfollow yourself', async () => {
    const profile = new ProfileDummy({ todaysPostCount: 0 });

    profileRepository.fetchProfile = jest.fn().mockResolvedValue(profile);

    const followProfileUseCase = new UnfollowProfile(
      profileRepository,
      mediator,
    );

    await expect(
      followProfileUseCase.execute(
        profile.username.toString(),
        profile.username.toString(),
      ),
    ).rejects.toThrow(UnableToUnfollowSelf);
  });

  it('decrements followers and following count', async () => {
    const followed = new ProfileDummy({ todaysPostCount: 0, followersCount: 1 });
    const follower = new ProfileDummy({ todaysPostCount: 0, followingCount: 1 });

    profileRepository.fetchProfile = jest.fn().mockImplementation((username) => {
      if (username === follower.username.toString()) return Promise.resolve(follower);

      return Promise.resolve(followed);
    });

    const followProfileUseCase = new UnfollowProfile(
      profileRepository,
      mediator,
    );

    await followProfileUseCase.execute(
      follower.username.toString(),
      followed.username.toString(),
    );

    expect(followed.followersCount).toEqual(0);
    expect(follower.followingCount).toEqual(0);
  });
});
