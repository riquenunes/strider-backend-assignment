import FetchPostsQueryBuilder from '../FetchPostsQueryBuilder';
import FetchPostsOutput from '../FetchPostsOutput';
import { Knex } from 'knex';
import appConfig from '../../../../../config/application';

const { profilePagePostsLimit } = appConfig;

export default class FetchProfilePosts {
  constructor(
    private readonly readDb: Knex,
  ) { }

  async execute(username: string, oldestPostPosition?: number): Promise<FetchPostsOutput[]> {
    const queryBuilder = new FetchPostsQueryBuilder(this.readDb);

    return queryBuilder
      .whereAuthorIs(username)
      .paginate(profilePagePostsLimit, oldestPostPosition)
      .getResults();
  }
}
