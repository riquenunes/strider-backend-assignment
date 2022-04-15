import dbConfig from '../../../../config/database';
import { Knex } from 'knex';
import FetchPostsOutput from './FetchPostsOutput';

const { tables } = dbConfig;

export default class FetchPostsQueryBuilder {
  private query: Knex.QueryBuilder;

  constructor(readDb: Knex) {
    this.query = readDb(tables.post)
      .select(
        `${tables.post}.id`,
        `${tables.post}.content`,
        `${tables.post}.author`,
        `${tables.post}.createdAt`,
        `${tables.post}.position`,
        'originalPost.id as originalPostId',
        'originalPost.content as originalPostContent',
        'originalPost.author as originalPostAuthor',
        'originalPost.createdAt as originalPostCreatedAt',
      )
      .orderBy(`${tables.post}.position`, 'desc')
      .leftJoin({ originalPost: tables.post }, `${tables.post}.originalPostId`, '=', 'originalPost.id')
  }

  paginate(limit: number, oldestPostPosition?: number): FetchPostsQueryBuilder {
    if (oldestPostPosition) {
      this.query = this.query.where(`${tables.post}.position`, '<', oldestPostPosition);
    }

    this.query = this.query.limit(limit);

    return this;
  }

  whereAuthorIs(username: string): FetchPostsQueryBuilder {
    this.query = this.query.where(`${tables.post}.author`, username);

    return this;
  }

  whereAuthorIsFollowedBy(username: string): FetchPostsQueryBuilder {
    this.query = this.query
      .leftJoin(tables.followers, `${tables.followers}.followed`, '=', `${tables.post}.author`)
      .where(`${tables.followers}.follower`, username);

    return this;
  }

  whereContentIsSimilarTo(search: string): FetchPostsQueryBuilder {
    this.query = this.query.whereRaw(`"${tables.post}"."contentTokens" @@ to_tsquery(?)`, search);

    return this;
  }

  async getResults(): Promise<FetchPostsOutput[]> {
    const dbPosts = await this.query;

    return dbPosts.map(dbPost => ({
      id: dbPost.id,
      author: dbPost.author,
      createdAt: dbPost.createdAt,
      content: dbPost.content,
      position: dbPost.position,
      originalPost: dbPost.originalPostId
        ? {
          id: dbPost.originalPostId,
          author: dbPost.originalPostAuthor,
          createdAt: dbPost.originalPostCreatedAt,
          content: dbPost.originalPostContent,
        }
        : undefined,
    }));
  }
}
