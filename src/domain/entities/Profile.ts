import DailyPostCreationLimitReached from '../errors/DailyPostCreationLimitReached';
import UnableToFollowSelf from '../errors/UnableToFollowSelf';
import UnableToUnfollowSelf from '../errors/UnableToUnfollowSelf';

export class Username {
  private value: string;

  constructor(value: string) {
    this.value = value;
  }

  validate() {
    if (this.value.length > 14) {
      throw new Error('Username must be 14 characters or less');
    }
  }

  public toString(): string {
    return this.value;
  }

  public isEqual(other: Username): boolean {
    return this.toString() === other.toString();
  }
}

export default class Profile {
  private _followingCount: number;
  private _followersCount: number;
  private _postCount: number;
  private _todaysPostCount: number;

  public get followingCount() {
    return this._followingCount;
  }

  public get followersCount() {
    return this._followersCount;
  }

  public get postCount() {
    return this._postCount;
  }

  public get todaysPostCount() {
    return this._todaysPostCount;
  }

  constructor(
    public readonly username: Username,
    public readonly joinDate: Date,
    postCount: number,
    followersCount: number,
    followingCount: number,
    todaysPostCount: number,
  ) {
    this._postCount = postCount;
    this._followingCount = followingCount;
    this._followersCount = followersCount;
    this._todaysPostCount = todaysPostCount;
  }

  public validateTodaysPostCount() {
    if (this.todaysPostCount >= 5) throw new DailyPostCreationLimitReached();
  }

  public incrementPostCount() {
    this._postCount++;
    this._todaysPostCount++;
  }

  public isEqual(other: Profile): boolean {
    return this.username.isEqual(other.username);
  }

  public follow(profile: Profile): void {
    if (this.isEqual(profile)) throw new UnableToFollowSelf();

    this._followingCount++;
    profile._followersCount++;
  }

  public unfollow(profile: Profile): void {
    if (this.isEqual(profile)) throw new UnableToUnfollowSelf();

    this._followingCount--;
    profile._followersCount--;
  }
}
