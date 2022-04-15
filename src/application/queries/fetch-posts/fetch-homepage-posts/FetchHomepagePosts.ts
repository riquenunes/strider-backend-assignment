import { Knex } from 'knex';
import FetchPostsOutput from '../FetchPostsOutput';
import FetchPostsQueryBuilder from '../FetchPostsQueryBuilder';
import appConfig from '../../../../../config/application';

const { homepagePostsLimit } = appConfig;

export default class FetchHomepagePosts {
  constructor(
    private readonly readDb: Knex,
  ) { }

  async execute(username: string, oldestPostPosition?: number, allUsers?: boolean): Promise<FetchPostsOutput[]> {
    const queryBuilder = new FetchPostsQueryBuilder(this.readDb);

    if (allUsers) {
      return queryBuilder
        .paginate(homepagePostsLimit, oldestPostPosition)
        .getResults();
    }

    return queryBuilder
      .whereAuthorIsFollowedBy(username)
      .paginate(homepagePostsLimit, oldestPostPosition)
      .getResults();
  }
}
