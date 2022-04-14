import { Knex } from 'knex';

import dbConfig from '../../../../config/database';
import Post from '../../../domain/entities/Post';
import dbPostToPost from '../../../infrastructure/db-post-mapper';

export default class FetchHomepagePosts {
  constructor(
    private readonly readDb: Knex
  ) { }

  async execute(username: string, skip: number, limit: number, allUsers: boolean): Promise<Post[]> {
    const { followers, post } = dbConfig.tables;
    let query = this.readDb(post)
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
      .leftJoin({ originalPost: post }, `${post}.originalPostId`, '=', 'originalPost.id');

    if (!allUsers) {
      query = query
        .leftJoin(followers, `${followers}.followed`, '=', `${post}.author`)
        .where(`${followers}.follower`, username);
    }

    const dbPosts = await query;

    return dbPosts.map(dbPostToPost);
  }
}
