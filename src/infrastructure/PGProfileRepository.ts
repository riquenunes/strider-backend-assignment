import { Knex } from 'knex';
import Profile, { Username } from '../domain/entities/Profile';
import ProfileNotFound from '../domain/errors/ProfileNotFound';
import ProfileRepository from '../domain/repository/ProfileRepository';
import dbConfig from '../../config/database';

const { tables } = dbConfig;

export default class PGProfileRepository implements ProfileRepository {
  constructor(
    private readonly db: Knex,
  ) { }

  async updateProfile(profile: Profile): Promise<void> {
    await this.db(tables.profile)
      .where({ username: profile.username.toString() })
      .update({
        followersCount: profile.followersCount,
        followingCount: profile.followingCount,
        postCount: profile.postCount,
      });

    await this.db(tables.dailyProfileStats)
      .insert({
        profile: profile.username.toString(),
        date: new Date(),
        postCount: profile.todaysPostCount,
      })
      .onConflict(['profile', 'date'])
      .merge();
  }

  async fetchProfile(username: string): Promise<Profile> {
    const dbProfile = await this.db(tables.profile)
      .select(
        `${tables.profile}.username`,
        `${tables.profile}.joinDate`,
        `${tables.profile}.postCount`,
        `${tables.profile}.followersCount`,
        `${tables.profile}.followingCount`,
        this.db.raw(`COALESCE(${tables.dailyProfileStats}."postCount", 0) AS "todaysPostCount"`),
      )
      .leftJoin(tables.dailyProfileStats, `${tables.profile}.username`, `${tables.dailyProfileStats}.profile`)
      .where({ [`${tables.profile}.username`]: username })
      .first();

    if (!dbProfile) throw new ProfileNotFound(username);

    return new Profile(
      new Username(username),
      dbProfile.joinDate,
      dbProfile.postCount,
      dbProfile.followersCount,
      dbProfile.followingCount,
      dbProfile.todaysPostCount
    );
  }
  async addFollower(followed: Profile, follower: Profile): Promise<void> {
    await this.db(tables.followers)
      .insert({
        followed: followed.username.toString(),
        follower: follower.username.toString(),
      });
  }

  async removeFollower(followed: Profile, follower: Profile): Promise<void> {
    await this.db(tables.followers)
      .where({
        followed: followed.username.toString(),
        follower: follower.username.toString(),
      })
      .delete();
  }
}
