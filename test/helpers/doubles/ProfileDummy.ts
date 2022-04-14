import Profile, { Username } from '../../../src/domain/entities/Profile';
import chance from 'chance';

export default class ProfileDummy extends Profile {
  constructor(overrides: Partial<Profile> = {}) {
    super(
      overrides.username ?? new Username(chance().twitter().substring(1)),
      overrides.joinDate ?? chance().date(),
      overrides.postCount ?? chance().integer({ min: 0 }),
      overrides.followersCount ?? chance().integer({ min: 0 }),
      overrides.followingCount ?? chance().integer({ min: 0 }),
      overrides.todaysPostCount ?? chance().integer({ min: 0 }),
    );
  }
}
