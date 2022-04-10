import Profile from '../entities/Profile';

export default interface ProfileRepository {
  updateProfile(profile: Profile): Promise<void>;
  fetchProfile(username: string): Promise<Profile | undefined>;
  addFollowing(profile: Profile, targetProfile: Profile): Promise<void>;
}
