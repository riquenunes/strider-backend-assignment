import Profile from '../entities/Profile';

export default interface ProfileRepository {
  updateProfile(profile: Profile): Promise<void>;
  fetchProfile(username: string): Promise<Profile | undefined>;
  addFollower(followed: Profile, follower: Profile): Promise<void>;
  removeFollower(followed: Profile, follower: Profile): Promise<void>;
}
