import { Knex } from 'knex';
import FetchPostsOutput from '../FetchPostsOutput';
import FetchPostsQueryBuilder from '../FetchPostsQueryBuilder';

export default class FetchHomepagePosts {
  constructor(
    private readonly readDb: Knex,
  ) { }

  async execute(username: string, oldestPostPosition?: number, allUsers?: boolean): Promise<FetchPostsOutput[]> {
    const queryBuilder = new FetchPostsQueryBuilder(this.readDb);

    if (allUsers) {
      return queryBuilder
        .paginate(10, oldestPostPosition)
        .getResults();
    }

    return queryBuilder
      .whereAuthorIsFollowedBy(username)
      .paginate(10, oldestPostPosition)
      .getResults();
  }
}
