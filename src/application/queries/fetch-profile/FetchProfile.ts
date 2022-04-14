import { Knex } from 'knex';
import dbConfig from '../../../../config/database';
import ProfileNotFound from '../../../domain/errors/ProfileNotFound';
import FetchProfileOutput from './FetchProfileOutput';

const { tables } = dbConfig;

export default class FetchProfile {
  constructor(
    private readonly readDb: Knex,
  ) { }

  async execute(loggedUsername: string, username: string): Promise<FetchProfileOutput> {
    const { rows: [dbProfile] } = await this.readDb.raw(`
      SELECT
        ${tables.profile}."username",
        ${tables.profile}."joinDate",
        ${tables.profile}."postCount",
        ${tables.profile}."followersCount",
        ${tables.profile}."followingCount",
        ${tables.followers}."follower" IS NOT NULL AS "isFollowing"
      FROM
        ${tables.profile}
      LEFT JOIN ${tables.followers} ON ${tables.followers}.followed = ${tables.profile}.username AND ${tables.followers}.follower = ?
      WHERE
        ${tables.profile}.username = ?
      LIMIT 1
    `, [loggedUsername, username]);

    if (!dbProfile) throw new ProfileNotFound(username);

    return {
      username: dbProfile.username,
      joinDate: dbProfile.joinDate.toLocaleDateString(
        'en-US', { month: 'long', day: 'numeric', year: 'numeric' },
      ),
      postCount: dbProfile.postCount,
      followersCount: dbProfile.followersCount,
      followingCount: dbProfile.followingCount,
      isFollowing: dbProfile.isFollowing,
    };
  }
}
