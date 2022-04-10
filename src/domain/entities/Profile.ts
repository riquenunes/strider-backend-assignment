class ProfileStats {

}

export default class Profile {

  private followingCountValue: number;
  private followersCountValue: number;
  private postCountTodayValue: number;

  public get followingCount() {
    return this.followingCountValue;
  }

  public get followersCount() {
    return this.followersCountValue;
  }

  public get postCountToday(): number {
    return this.postCountTodayValue;
  }

  constructor(
    public readonly username: string,
    public readonly joinDate: Date,
    postCountToday: number,
    followersCount: number,
    followingCount: number,
  ) {
    this.postCountTodayValue = postCountToday;
    this.followingCountValue = followingCount;
    this.followersCountValue = followersCount;
  }

  public validateTodaysPostCount(): void {
    if (this.postCountTodayValue >= 5) {
      throw new Error('You cannot post more than 5 times a day');
    }
  }

  public incrementTodaysPostCount(): void {
    this.validateTodaysPostCount();
    this.postCountTodayValue++;
  }

  public follow(profile: Profile): void {
    if (profile.username === this.username) {
      throw new Error('You cannot follow yourself');
    }

    this.followingCountValue++;
    profile.addFollower(this);
  }

  public unfollow(profile: Profile): void {
    if (profile.username === this.username) {
      throw new Error('You cannot unfollow yourself');
    }

    this.followingCountValue--;
    profile.removeFollower(this);
  }

  private addFollower(profile: Profile): void {
    if (profile.username === this.username) {
      throw new Error('You cannot be followed by yourself');
    }

    this.followersCountValue++;
  }

  private removeFollower(profile: Profile): void {
    if (profile.username === this.username) {
      throw new Error('You cannot unfollow yourself');
    }

    this.followersCountValue--;
  }
}
