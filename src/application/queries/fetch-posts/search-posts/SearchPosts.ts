import { Knex } from 'knex';
import FetchPostsOutput from '../FetchPostsOutput';
import FetchPostsQueryBuilder from '../FetchPostsQueryBuilder';
import appConfig from '../../../../../config/application';

const { homepagePostsLimit } = appConfig;
export default class SearchPosts {
  constructor(
    private readonly readDb: Knex,
  ) { }

  async execute(searchTerm: string, oldestPostPosition?: number): Promise<FetchPostsOutput[]> {
    const queryBuilder = new FetchPostsQueryBuilder(this.readDb);

    return queryBuilder
      .whereContentIsSimilarTo(searchTerm)
      .paginate(homepagePostsLimit, oldestPostPosition)
      .getResults();
  }
}
