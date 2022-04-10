import ProfileRepository from '../../../src/domain/repository/ProfileRepository';
import ProfileDummy from './ProfileDummy';

export default class ProfileRepositoryStub implements ProfileRepository {
  updateProfile = jest.fn();
  fetchProfile = jest.fn().mockResolvedValue(new ProfileDummy());
  addFollowing = jest.fn();
}
