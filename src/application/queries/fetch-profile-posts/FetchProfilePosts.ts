import { Knex } from 'knex';
import Post from '../../../domain/entities/Post';
import dbConfig from '../../../../config/database';
import dbPostToPost from '../../../infrastructure/db-post-mapper';

export default class FetchProfilePosts {
  constructor(
    private readonly readDb: Knex,
  ) { }

  async execute(username: string, skip: number, limit: number): Promise<Post[]> {
    const { post } = dbConfig.tables;
    const dbPosts = await this.readDb(post)
      .select(
        `${post}.id`,
        `${post}.content`,
        `${post}.author`,
        `${post}.createdAt`,
        'originalPost.id as originalPostId',
        'originalPost.content as originalPostContent',
        'originalPost.author as originalPostAuthor',
        'originalPost.createdAt as originalPostCreatedAt',
      )
      .offset(skip)
      .limit(limit)
      .orderBy(`${post}.createdAt`, 'desc')
      .leftJoin({ originalPost: post }, `${post}.originalPostId`, '=', 'originalPost.id')
      .where(`${post}.author`, username);

    return dbPosts.map(dbPostToPost);
  }
}
